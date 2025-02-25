const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const orderController = require("../controllers/orderController");

router
  .route("/")
  .post(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    orderController.attemptCheckout
  );

module.exports = router;
