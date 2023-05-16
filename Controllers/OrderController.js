const Cart = require("../Models/CartModel");

const Order = require("../Models/OrderModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.CreateOrder = async (req, res, next) => {
  try {
    const userId = req.body.userId;
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    if (!cart || !cart.products.length) {
      return res.status(404).json({
        status: "fail",
        message: "No products in cart",
      });
    }
    const newOrder = new Order({
      userId: cart.userId,
      products: cart.products,
      orderDate: new Date(),
      orderStatus: "pending",
      clientAddress: req.body.clientAddress,
      payment_method: req.body.payment_method,
      phone: req.body.phone,
      client_name: req.body.client_name,
    });
    const totalPrice = cart.products.reduce(
      (total, product) => total + product.quantity * product.productId.price,
      0
    );
    newOrder.totalPrice = totalPrice;

    await newOrder.save();

    cart.products = [];
    await cart.save();
    res.status(201).json({
      status: "success",
      data: {
        Order: newOrder,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};
exports.ManageOrder = async (req, res, next) => {
  try {
    const orderId = req.body.orderId;
    let order = await Order.findById(orderId);
    if (!order) {
      return next(new AppError("order not found", 404));
    }
    order.orderStatus = req.body.orderStatus;
    order.markModified("orderStatus");
    await order.save({ validateBeforeSave: false });
    res.status(200).json({
      status: "success",
      data: {
        data: order,
      },
    });
    console.log(order);
  } catch (error) {
    return next(new AppError(error.message));
  }
};
