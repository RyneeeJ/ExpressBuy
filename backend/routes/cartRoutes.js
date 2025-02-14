const express = require("express");

const authController = require("../controllers/authController");
const cartController = require("../controllers/cartController");
const router = express.Router();

router.get(
  "/",
  authController.protectRoute(),
  authController.restrictTo("customer"),
  cartController.getCartItems
);

router
  .route("/:productId")
  .post(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    cartController.addToCart
  )
  .delete(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    cartController.removeFromCart
  );

router.patch(
  "/:productId/toggle-select",
  authController.protectRoute(),
  authController.restrictTo("customer"),
  cartController.toggleSelectItem
);

router.patch(
  "/:productId/quantity",
  authController.protectRoute(),
  authController.restrictTo("customer"),
  cartController.updateQuantity
);

module.exports = router;
