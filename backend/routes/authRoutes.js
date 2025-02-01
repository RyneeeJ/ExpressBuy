const express = require("express");

const authController = require("../controllers/authControllers");

const router = express.Router();

router.post(
  "/signup",
  authController.protectRoute(true),
  authController.checkAdminRole,
  authController.signup
);
router.post("/login", authController.login);
router.post("/logout", authController.protectRoute(), authController.logout);

module.exports = router;
