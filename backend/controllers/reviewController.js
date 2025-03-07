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

exports.updateReview = async (req, res, next) => {
  const userId = req.user._id.toString();
  const { productId, reviewId } = req.params;
  const { updatedRating, updatedComment } = req.body;
  try {
    // check if this review belongs to the user

    const review = await Review.findOne({
      user: userId,
      product: productId,
      _id: reviewId,
    });

    if (!review) throw new AppError("This review could not be found", 404);

    if (!updatedComment && !updatedRating)
      throw new AppError(
        "Please make changes to either the comment or rating to update this review",
        400
      );

    if (updatedRating) review.rating = updatedRating;
    if (updatedComment) review.comment = updatedComment;

    const updatedReview = await review.save({ validateBeforeSave: true });
    res.status(200).json({
      status: "Success",
      data: {
        review: updatedReview,
      },
    });
  } catch (err) {
    next(err);
  }
};
