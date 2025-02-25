const Cart = require("../models/cartModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const { calculateSelectedTotalPrice } = require("./cart");

const createOrder = async ({
  cartId,
  userId,
  paymentIntent = undefined,
  shippingAddress,
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

  // Update products' stocks in the db
  const bulkOperations = selectedItems.map((item) => ({
    updateOne: {
      filter: { _id: item.product.id },
      update: { $inc: { "variants.$[variant].stock": -item.quantity } },
      arrayFilters: [{ "variant._id": item.variant.id }],
    },
  }));

  await Product.bulkWrite(bulkOperations);

  // Delete purchased items from cart
  cart.items.pull({ selected: true });
  await cart.save();

  return placedOrder;
};

module.exports = createOrder;
