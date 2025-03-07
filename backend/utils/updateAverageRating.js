const mongoose = require("mongoose");
const Review = require("../models/reviewModel");
const Product = require("../models/productModel");

const updateAverageRating = async (productId) => {
  const productObjectId = new mongoose.Types.ObjectId(productId);

  const result = await Review.aggregate([
    { $match: { product: productObjectId } }, // Match all reviews for the product
    {
      $group: {
        _id: "$product",
        averageRating: { $avg: "$rating" },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await Product.findByIdAndUpdate(productId, {
      averageRating: result[0].averageRating,
      numReviews: result[0].numReviews,
    });
  } else {
    await Product.findByIdAndUpdate(productId, {
      averageRating: 0,
      numReviews: 0,
    });
  }
};

module.exports = updateAverageRating;
