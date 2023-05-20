const Cart = require("../Models/CartModel");
const User = require("../Models/UserModel");
const Sale = require("../Models/SaleModel");
const Order = require("../Models/OrderModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const Product = require("../Models/ProductModel");
const mongoose = require("mongoose");

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

    // Create a new order and sale for each seller
    const orders = [];
    for (const sellerId in productsBySeller) {
      const seller = await User.findById(sellerId);
      if (!seller) {
        return res.status(404).json({
          status: "fail",
          message: "Seller not found",
       });
      }

      const sellerProducts = productsBySeller[sellerId];
      const productIds = sellerProducts.map((product) => product.productId._id);

      const products = await Product.find({ _id: { $in: productIds } });
      if (products.length !== productIds.length) {
        return res.status(404).json({
          status: "fail",
          message: "One or more products not found",
        });
      }

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

      const savedOrder = await newOrder.save();

      // Create a new sale document for each product in the order
      for (const product of sellerProducts) {
        const productData = products.find((p) => p._id.equals(product.productId._id));
        const sale = new Sale({
          sellerId,
          productId: product.productId._id,
          quantity: product.quantity,
          totalPrice: product.quantity * productData.price,
          orderDate: new Date(),
        });
        await sale.save();
      }

      // Add the order to the list of orders
      orders.push({
        seller,
        order: savedOrder,
      });
    }
    cart.products = [];
    await cart.save();
    res.status(201).json({
      status: "success",
      data: {
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
    order.save({ validateBeforeSave: false });
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

exports.getOrder = factory.getOne(Order, "Order not found for the given ID");

exports.GetCustomerOrder = async (req, res, next) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId: userId });
    console.log("orders:", orders);
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
