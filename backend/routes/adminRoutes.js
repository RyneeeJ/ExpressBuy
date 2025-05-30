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

router.get(
  "/orders/low-stock-products",
  authController.protectRoute(),
  authController.restrictTo("admin"),
  adminController.getLowStockProducts
);

router.get(
  "/users",
  authController.protectRoute(),
  authController.restrictTo("admin"),
  adminController.getAllUsers
);

router
  .route("/users/:userId")
  .get(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.getUserDetails
  )
  .patch(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.updateUserRole
  )
  .delete(
    authController.protectRoute(),
    authController.restrictTo("admin"),
    adminController.deleteUser
  );

module.exports = router;
