const express = require("express");
const cartController = require("./../Controllers/CartController");
const authController = require("./../Controllers/AuthController");
const orderController = require("./../Controllers/OrderController");
const router = express.Router();

router
  .route("/createOrder")
  .post(
    authController.protect,
    authController.restrictTo("seller"),
    orderController.CreateOrder
  );
router
  .route("/:sellerId")
  .get(
    authController.protect,
    authController.restrictTo("seller"),
    orderController.GetSellerOrder
  ),
  router
    .route("/manageOrder")
    .patch(
      authController.protect,
      authController.restrictTo("seller"),
      orderController.ManageOrder
    );
    router.get("/orders/user/:userId", orderController.GetCustomerOrder);
    module.exports = router;
