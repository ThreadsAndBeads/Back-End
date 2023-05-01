const express = require("express");
const productController = require("./../Controllers/ProductController");
const router = express.Router();

router.route("/").post(productController.createProduct);
module.exports = router;
