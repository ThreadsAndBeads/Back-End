const Cart = require("../Models/CartModel");
const User = require("../Models/UserModel");

const Order = require("../Models/OrderModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const Product = require("../Models/ProductModel");

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

    const productsBySeller = {};
    cart.products.forEach((product) => {
      const sellerId = product.productId.user_id.toString();
      if (!productsBySeller[sellerId]) {
        productsBySeller[sellerId] = [];
      }
      productsBySeller[sellerId].push(product);
    });

    // Create a new order for each seller
    const orders = [];
    for (const sellerId in productsBySeller) {
      const seller = await User.findById(sellerId);
      const sellerProducts = productsBySeller[sellerId];

      const totalPrice = sellerProducts.reduce(
        (total, product) => total + product.quantity * product.productId.price,
        0
      );

      const newOrder = new Order({
        userId: cart.userId,
        sellerId,
        products: sellerProducts,
        orderDate: new Date(),
        orderStatus: "pending",
        clientAddress: req.body.clientAddress,
        payment_method: req.body.payment_method,
        phone: req.body.phone,
        client_name: req.body.client_name,
        totalPrice,
      });
      console.log(newOrder);

      await newOrder.save();

      // Add the order to the list of orders
      orders.push({
        seller,
        order: newOrder,
      });
    }
    cart.products = [];
    await cart.save();
    res.status(201).json({
      status: "success",
      data: {
        // Order: newOrder,
        orders,
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
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.GetSellerOrder = async (req, res, next) => {
  try {
    const sellerId = req.params.sellerId;
    const orders = await Order.find({ sellerId: sellerId });
    res.status(200).json({
      status: "success",
      data: {
        data: orders,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

const modifyProduct = async (pro) => {
  let product = await Product.findOne(pro.productId);
  pro.name = product.name;
  return pro;
};
