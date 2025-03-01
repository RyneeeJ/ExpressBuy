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
  )
  .get(authController.protectRoute(), orderController.getOrders);

router
  .route("/:orderId")
  .get(authController.protectRoute(), orderController.getOrder);

router.patch(
  "/:orderId/cancel",
  authController.protectRoute(),
  orderController.cancelOrder
);
module.exports = router;
