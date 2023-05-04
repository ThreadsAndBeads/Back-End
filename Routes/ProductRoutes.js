const express = require("express");
const productController = require("./../Controllers/ProductController");
const authController = require("./../Controllers/AuthController");

const router = express.Router();

router
  .route("/")
  .get(authController.protect, productController.getAllProducts)
  .post(authController.protect, productController.createProduct);

router
  .route("/:id")
  .get(authController.protect, productController.getProduct)
  .delete(authController.protect, productController.deleteProduct);
module.exports = router;
