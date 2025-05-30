const express = require("express");

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");

const router = express.Router();

router
  .route("/me")
  .get(authController.protectRoute(), userController.getMe)
  .patch(authController.protectRoute(), userController.updateProfileDetails);

router.patch(
  "/me/change-password",
  authController.protectRoute(),
  userController.changePassword
);
router
  .route("/me/address")
  .post(authController.protectRoute(), userController.addAddress);

router
  .route("/me/address/:addressId")
  .delete(authController.protectRoute(), userController.deleteAddress)
  .patch(authController.protectRoute(), userController.editAddress);

router.patch(
  "/me/address/:addressId/set-default",
  authController.protectRoute(),
  userController.setDefaultAddress
);

router
  .route("/me/wishlist/:productId/:variantId")
  .post(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    userController.addWishlist
  )
  .delete(
    authController.protectRoute(),
    authController.restrictTo("customer"),
    userController.removeFromWishlist
  );

router.delete(
  "/me/wishlist/clear",
  authController.protectRoute(),
  authController.restrictTo("customer"),
  userController.clearWishlist
);
module.exports = router;
