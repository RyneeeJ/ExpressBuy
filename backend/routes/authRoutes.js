const express = require("express");

const authController = require("../controllers/authController");

const router = express.Router();

router.post(
  "/signup",
  authController.protectRoute(true),
  authController.checkAdminRole,
  authController.signup
);
router.post("/login", authController.login);
router.post("/logout", authController.protectRoute(), authController.logout);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

module.exports = router;
