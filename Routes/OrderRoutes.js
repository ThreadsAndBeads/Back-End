const express = require("express");
const cartController = require("./../Controllers/CartController");
const authController = require("./../Controllers/AuthController");
const orderController = require("./../Controllers/OrderController");
const router = express.Router();

router
  .route("/createOrder")
  .post(authController.protect, orderController.CreateOrder);
module.exports = router;
