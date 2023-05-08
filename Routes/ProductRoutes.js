const express = require("express");
const productController = require("./../Controllers/ProductController");
const authController = require("./../Controllers/AuthController");
const router = express.Router();

router
  .route("/")
  .get(authController.protect, productController.getAllProducts)



router
  .route("/discountedproducts")
  .get(authController.protect, productController.getHighestDiscountedProducts);

router
  .route("/:id")
  .get(authController.protect, productController.getProduct)
  .post(
    authController.protect,
    authController.restrictTo("seller"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.createProduct
  )
  .delete(
    authController.protect,
    authController.restrictTo("seller"),
    productController.deleteProduct
  )
  .patch(
    authController.protect,
    authController.restrictTo("seller"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  );

module.exports = router;
