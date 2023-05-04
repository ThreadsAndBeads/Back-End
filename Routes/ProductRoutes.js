const express = require("express");
const productController = require("./../Controllers/ProductController");
const router = express.Router();

router.route("/")
    .get(productController.getAllProducts)
    .post(productController.createProduct);

//router.route("/:id")
  //  .get(productController.getProduct)
    //.delete(productController.deleteProduct);

router.route("/discountedproducts")
.get(productController.getHighestDiscountedProducts);

module.exports = router;