const express = require("express");
const productController = require("./../Controllers/ProductController");
const authController = require("./../Controllers/AuthController");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../storage/storage");
const upload = multer({ storage });

router
  .route("/")
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo("seller"),
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.createProduct
  );
router.get("/search", productController.search);
router.get("/categories", productController.getAllCategories);
router
  .route("/discountedproducts")
  .get(productController.getHighestDiscountedProducts);

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
    productController.uploadProductImages,
    productController.resizeProductImages,
    productController.updateProduct
  );

// router.get("/categories", productController.getAllCategories);

module.exports = router;
