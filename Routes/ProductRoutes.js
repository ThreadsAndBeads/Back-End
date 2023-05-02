const express = require("express");
const productController = require("./../Controllers/ProductController");
const router = express.Router();

router.route("/")
    .get(productController.getAllProducts)
    .post(productController.createProduct)
    .delete(productController.deleteProduct);

module.exports = router;