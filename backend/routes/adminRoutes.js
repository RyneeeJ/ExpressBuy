const express = require("express");

const authController = require("../controllers/authController");
const adminController = require("../controllers/adminController");

const router = express.Router();

router
  .route("/products")
  .post(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.addNewProduct
  );

router
  .route("/products/:id")
  .patch(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.updateProductDetails
  );
module.exports = router;
