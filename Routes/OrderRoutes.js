const express = require("express");
const cartController = require("./../Controllers/CartController");
const authController = require("./../Controllers/AuthController");
const orderController = require("./../Controllers/OrderController");
const router = express.Router();

router.route("/").post(authController.protect, orderController.CreateOrder);
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
  router.get("/client/:userId", orderController.GetCustomerOrder);
router.route("/:id").get(orderController.getOrder);

module.exports = router;
