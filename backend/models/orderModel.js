const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    items: [
      {
        product: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
          },
          name: { type: String, required: true }, // This is to store product name for future references if product/variant is deleted in the store database
        },
        variant: {
          id: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
          },
          description: { type: String, required: true },
        },
        quantity: { type: Number, required: true },
        image: String,
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
    payment: {
      method: {
        type: String,
        enum: ["Card", "COD"],
        required: [true, "Please select your mode of payment"],
      },
      status: {
        type: String,
        enum: ["Paid", "Pending", "Failed"],
        default: "Pending",
      },
      transactionId: String,
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
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
