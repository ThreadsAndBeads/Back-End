const express = require("express");
const cartController = require("./../Controllers/CartController");
const router = express.Router();

router.route("/").post(cartController.AddToCart);
router.route("/:id/clear").post(cartController.clearCart);
router.route("/count").post(cartController.getTotalProductsInCart);

module.exports = router;