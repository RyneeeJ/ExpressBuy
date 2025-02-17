const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  items: [
    {
      product: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        name: { type: String, required: true },
      },
      variant: {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
        },
        description: { type: String, required: true },
      },
      price: {
        type: Number,
        required: [true, "asdasdasadssß"],
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
      selected: {
        type: Boolean,
        default: false,
      },
    },
  ],
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;
