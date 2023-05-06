const express = require("express");
const productController = require("./../Controllers/ProductController");
const authController = require("./../Controllers/AuthController");

const router = express.Router();

router
    .route("/")
    .get(authController.protect, productController.getAllProducts)
    .post(
        authController.protect,
        authController.restrictTo("seller"),
        productController.createProduct
    );
  
router
    .route("/discountedproducts")
    .get(authController.protect, productController.getHighestDiscountedProducts);

router
    .route("/:id")
    .get(authController.protect, productController.getProduct)
    .delete(
        authController.protect,
        authController.restrictTo("seller"),
        productController.deleteProduct
    )
    .patch(
        authController.protect,
        authController.restrictTo("seller"),
        productController.updateProduct
    );

module.exports = router;
