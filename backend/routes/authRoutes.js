const express = require("express");

const router = express.Router();
const authController = require("../controllers/authControllers");

router.post(
  "/signup",
  authController.protectRoute({ isSigningUp: true }),
  authController.checkAdminRole,
  authController.signup
);
router.post("/login", authController.login);
router.post("logout", authController.protectRoute, authController.logout);
module.exports = router;
