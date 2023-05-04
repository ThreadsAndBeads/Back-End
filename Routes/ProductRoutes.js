const express = require("express");
const productController = require("./../Controllers/ProductController");
const authController = require("./../Controllers/AuthController");

const router = express.Router();

router
  .route("/")
  .get(productController.getAllProducts)
  .post(productController.createProduct);

router
  .route("/:id")
  .get(productController.getProduct)
  .delete(productController.deleteProduct);
module.exports = router;
