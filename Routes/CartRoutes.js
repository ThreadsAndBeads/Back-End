const express = require("express");
const cartController = require("./../Controllers/CartController");
const authController = require("./../Controllers/AuthController");
const router = express.Router();

router
    .route("/")
    .post(authController.protect, cartController.AddToCart)
    .get(authController.protect, cartController.showCart)
    .delete(authController.protect, cartController.clearCart);

router
  .route("/count")
  .get(authController.protect, cartController.getTotalProductsInCart);

router
  .route("/:id")
  .delete(authController.protect, cartController.DeleteProduct)
  .patch(authController.protect, cartController.updateCart);

module.exports = router;
