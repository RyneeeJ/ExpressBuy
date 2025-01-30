const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "For Delivery", "Delivered", "Cancelled"],
      default: "Pending",
    },
    shippingAddress: {
      street: {
        type: String,
        required: [true, "Please enter your street name"],
      },
      city: {
        type: String,
        required: [true, "Please enter your city/province name"],
      },
      country: {
        type: String,
        required: [true, "Please enter your country name"],
      },
    },
    orderedAt: {
      type: Date,
      default: Date.now(),
    },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
