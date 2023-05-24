const express = require("express");
const cartController = require("./../Controllers/CartController");
const authController = require("./../Controllers/AuthController");
const orderController = require("./../Controllers/OrderController");
const PaymentController = require("./../Controllers/PaymentController");
const router = express.Router();

router
    .route("/processPayment")
    .post(
        // authController.protect,
        // authController.restrictTo(""),
        PaymentController.makePayment
);
  
module.exports = router;