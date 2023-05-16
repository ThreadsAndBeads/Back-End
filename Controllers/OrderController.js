const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserModel");
const Order = require("../Models/OrderModel");
const AppError = require("./../utils/appError");

exports.CreateOrder = async (req, res, next) => {
  try {
    // const user_id = req.params.user_id;
    const userId = req.body.userId;
    // console.log(userId);
    // let userId = req.body.userId;
    // console.log(newOrder);
    // .populate("products.productId");
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    // console.log(cart, "hi");
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
    // const newOrder = new Order(req.body);

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
