const express = require("express");
const cartController = require("./../Controllers/CartController");
const authController = require("./../Controllers/AuthController");
const router = express.Router();

router.route("/").post(authController.protect, cartController.AddToCart);
router
  .route("/:id/clear")
  .post(authController.protect, cartController.clearCart);

router.route("/:id/count").get(cartController.getTotalProductsInCart);

router.route("/showcart").get(cartController.showCart);

module.exports = router;
