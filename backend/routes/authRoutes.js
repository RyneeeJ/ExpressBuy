const express = require("express");

const router = express.Router();
const authController = require("../controllers/authControllers");

router.post("/signup", authController.checkAdminRole, authController.signup);
router.post("/login", authController.login);

module.exports = router;
