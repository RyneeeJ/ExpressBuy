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
module.exports = router;
