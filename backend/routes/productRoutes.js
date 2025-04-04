const express = require("express");

const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.get("/categories", productController.getProductCategories);
router.route("/:productId").get(productController.getProduct);

router
  .route("/:productId/reviews")
  .post(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    reviewController.createReview
  );

router.get(
  "/:productId/reviews/all",
  authController.protectRoute(),
  reviewController.getAllReviews
);
router.get(
  "/:productId/reviews/limited",
  authController.protectRoute(),
  reviewController.getLimitedReviews
);

router
  .route("/:productId/reviews/:reviewId")
  .patch(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    reviewController.updateReview
  )
  .delete(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    reviewController.deleteReview
  );

module.exports = router;
