const express = require("express");

const productController = require("../controllers/productController");
const authController = require("../controllers/authController");
const reviewController = require("../controllers/reviewController");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.route("/:productId").get(productController.getProduct);

router
  .route("/:productId/reviews")
  .post(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    reviewController.createReview
  );

module.exports = router;
