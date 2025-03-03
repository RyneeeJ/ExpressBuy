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
  .route("/products/:productId")
  .patch(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.updateProductDetails
  )
  .delete(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.deleteProduct
  );

router
  .route("/products/:productId/variants")
  .post(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.addProductVariant
  );

router
  .route("/products/:productId/variants/:variantId")
  .delete(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.deleteProductVariant
  )
  .patch(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.updateProductVariant
  );

router
  .route("/orders/:orderId/status")
  .patch(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.updateOrderStatus
  );

router.get(
  "/orders/stats",
  authController.protectRoute(),
  authController.restrictTo("admin"),
  adminController.getOrderStats
);
module.exports = router;
