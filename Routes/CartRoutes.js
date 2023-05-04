const express = require("express");
const cartController = require("./../Controllers/CartController");
const router = express.Router();

router.route("/").post(cartController.AddToCart);


module.exports = router;