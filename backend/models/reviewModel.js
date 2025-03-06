const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    comment: String,
    rating: {
      type: Number,
      enum: [1, 2, 3, 4, 5],
      required: [true, "At least leave a rating"],
    },
  },
  { timestamps: true }
);

// Prevent duplicate reviews per user-product pair
// Prevents race conditions where two reviews might be created at the same time.
reviewSchema.index({ user: 1, product: 1 }, { unique: true });

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
