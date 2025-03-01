const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const { calculateSelectedTotalPrice } = require("./cart");
const sendEmail = require("./sendEmail");
const updateProductStock = require("./updateProductStock");

const createOrder = async ({
  cartId,
  userId,
  paymentIntent = undefined,
  shippingAddress,
  email,
}) => {
  const cart = await Cart.findById(cartId);

  const selectedItems = cart.items.filter((item) => item.selected);
  // Create a new Order Doc
  const newOrder = {
    user: userId,
    items: selectedItems,
    totalPrice: calculateSelectedTotalPrice(cart),
    payment: {
      method: paymentIntent ? "Card" : "COD",
      status: paymentIntent ? "Paid" : "Pending",
    },
    shippingAddress: paymentIntent
      ? JSON.parse(shippingAddress)
      : shippingAddress,
    transactionId: paymentIntent?.id ?? undefined,
  };

  const placedOrder = await Order.create(newOrder);

  // Delete purchased items from cart
  cart.items.pull({ selected: true });

  await Promise.all([
    // Update products' stocks in the db
    updateProductStock({ itemsArr: selectedItems, addStock: false }),
    cart.save(),
    // Send notification email to the customer
    sendEmail({
      recipient: email,
      subject: "ExpressBuy Purchase",
      message: `Thank you for your purchase! Your order ID is ${placedOrder._id}`,
    }),
  ]);

  return placedOrder;
};

module.exports = createOrder;
