const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const { default: mongoose } = require("mongoose");
const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const { calculateSelectedTotalPrice } = require("../utils/cart");
const createOrder = require("../utils/createOrder");
const refundPayment = require("../utils/refundStripePayment");
const sendEmail = require("../utils/sendEmail");
const { handlePaymentSuccess } = require("../utils/stripeHandlers");
const updateProductStock = require("../utils/updateProductStock");

exports.attemptCheckout = async (req, res, next) => {
  const userId = req.user._id.toString();
  const { payment, shippingAddress } = req.body;
  try {
    const [cart, user] = await Promise.all([
      Cart.findOne({ user: userId }),
      User.findById(userId),
    ]);

    if (!cart) throw new AppError("Cart not found", 404);

    const cartId = cart._id.toString();

    const selectedItems = cart.items.filter((item) => item.selected);
    if (!selectedItems || selectedItems.length === 0)
      throw new AppError(
        "Invalid request. Please select item/s in your cart",
        400
      );

    if (payment === "Card") {
      if (user.lastPaymentIntentId) {
        try {
          await stripe.paymentIntents.cancel(user.lastPaymentIntentId);
        } catch (err) {
          throw new AppError(
            `There was a problem cancelling your last paymentIntent: ${err.message}`,
            500
          );
        }
      }
      // Create Payment Intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount: calculateSelectedTotalPrice(cart) * 100,
        currency: "php",
        automatic_payment_methods: {
          enabled: true,
        },
        metadata: {
          userId,
          email: user.email,
          cartId,
          shippingAddress: JSON.stringify(shippingAddress),
        },
      });

      user.lastPaymentIntentId = paymentIntent.id;
      await user.save();

      // Send clientSecret into the frontend
      res.status(200).json({
        status: "Success",
        clientSecret: paymentIntent.client_secret,
      });
    } else if (payment === "COD") {
      // Immediately create Order
      const placedOrder = await createOrder({
        userId,
        cartId,
        shippingAddress,
        email: user.email,
      });

      res.status(201).json({
        status: "Success",
        data: {
          order: placedOrder,
        },
      });
    }
  } catch (err) {
    next(err);
  }
};

exports.handleStripeWebhook = async (req, res, next) => {
  const sig = req.headers["stripe-signature"];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;
  try {
    try {
      event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
    } catch (err) {
      throw new AppError(`Webhook Error: ${err.message}`, 400);
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object;
        const placedOrder = await handlePaymentSuccess(paymentIntent);
        return res.status(200).json({
          message: "Order created successfully",
          order: placedOrder,
        });
      }
      default:
        // eslint-disable-next-line no-console
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a response to acknowledge receipt of the event
    res.status(200).json({ received: true });
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  try {
    const queryFilter = {};

    if (req.user.role === "customer") {
      queryFilter.user = req.user._id;
    }

    if (req.query.search) {
      const searchTerm = req.query.search;

      // If the search term is a valid ObjectId, assume it's an order ID
      if (mongoose.Types.ObjectId.isValid(searchTerm)) {
        queryFilter._id = searchTerm;
      } else if (req.user.role === "admin") {
        // If it's not an ObjectId, check if it's an email (admins only)
        const user = await User.findOne({ email: searchTerm }).select("_id");
        if (user) {
          queryFilter.user = user._id;
        } else throw new AppError("No user found with this email", 404);
      } else
        throw new AppError(
          "Customers can only search orders by their order id"
        );
    }

    let query = Order.find(queryFilter);

    if (req.user.role === "admin")
      query = query.populate({
        path: "user",
        select: "firstName lastName email",
        options: { strictPopulate: true },
      });

    const orders = await query.select("-updatedAt -__v -shippingAddress");

    res.status(200).json({
      status: "Success",
      result: orders.length,
      data: {
        orders,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrder = async (req, res, next) => {
  const { role } = req.user;
  const { orderId } = req.params;
  try {
    const queryFilter = { _id: orderId };

    if (role === "customer") queryFilter.user = req.user._id.toString();

    let query = Order.findOne(queryFilter);

    if (role === "admin")
      query = query.populate("user", "firstName lastName email");
    const order = await query;

    if (!order) throw new AppError("Order not found", 404);
    res.status(200).json({
      status: "Success",
      data: {
        order,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.cancelOrder = async (req, res, next) => {
  const { role, _id: userId } = req.user;
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId).populate("user", "email");

    if (role === "customer" && userId.toString() !== order.user)
      throw new AppError(
        "You can't cancel this order as this does not belong to you",
        403
      );

    if (order.status !== "Pending" || order.status === "Cancelled")
      throw new AppError("Only pending orders can be cancelled", 400);

    if (order.payment.method === "Card" && order.transactionId)
      await refundPayment(order.transactionId);

    // Update order status to Cancelled
    order.status = "Cancelled";

    await Promise.all([
      // Restock items in DB
      updateProductStock({ itemsArr: order.items, addStock: true }),
      order.save(),
      sendEmail({
        recipient: order.user.email,
        subject: "ExpressBuy Purchase Cancelled",
        message: `Your order with an ID of ${order._id.toString()} has been cancelled ${
          order.payment.method === "Card" ? "and payment was refunded" : ""
        }`,
      }),
    ]);

    res.status(200).json({
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};
