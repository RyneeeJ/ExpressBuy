const Order = require("../models/orderModel");
const Review = require("../models/reviewModel");
const AppError = require("../utils/appError");

exports.createReview = async (req, res, next) => {
  const userId = req.user._id.toString();
  const { productId } = req.params;
  const { comment, rating } = req.body;
  try {
    // Check if the user has already reviewed the product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });

    if (existingReview)
      throw new AppError("You have already reviewed this product", 400);

    // Check if at least one delivered order contains the product
    const deliveredOrderExists = await Order.exists({
      user: userId,
      status: "Delivered",
      "items.product.id": productId, // Checking if at least one order has the product in its items array
    });

    if (!deliveredOrderExists)
      throw new AppError(
        "You can only review products you have purchased and received",
        403
      );

    // Create the review
    const newReview = await Review.create({
      user: userId,
      product: productId,
      comment,
      rating,
    });
    res.status(200).json({
      status: "Success",
      data: {
        review: newReview,
      },
    });
  } catch (err) {
    next(err);
  }
};
