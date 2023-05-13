const express = require("express");
const cartController = require("./../Controllers/CartController");
const authController = require("./../Controllers/AuthController");
const router = express.Router();

router.route("/").post( authController.protect,cartController.AddToCart);

router
  .route("/:id/count")
  .get(authController.protect, cartController.getTotalProductsInCart);

router
  .route("/:id")
  .get(authController.protect, cartController.showCart)
  .post(authController.protect, cartController.clearCart)
  .patch(authController.protect, cartController.DeleteProduct);

module.exports = router;
