const express = require("express");

const productController = require("../controllers/productController");
const router = express.Router();

router.get("/", productController.getAllProducts);
router.route("/:productId").get(productController.getProduct);

module.exports = router;
