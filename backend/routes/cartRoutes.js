const express = require("express");

const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");
const router = express.Router();

router
  .route("/:productId")
  .patch(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    cartController.addToCart
  )
  .delete(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    cartController.removeFromCart
  );
module.exports = router;
