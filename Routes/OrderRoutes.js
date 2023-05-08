const express = require("express");
const cartController = require("./../Controllers/CartController");
const authController = require("./../Controllers/AuthController");
const orderController = require("./../Controllers/OrderController");
const router = express.Router();

router.route("/").post( authController.protect,orderController.CreateOrder);