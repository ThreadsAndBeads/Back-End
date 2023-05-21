const Cart = require("../Models/CartModel");
const User = require("../Models/UserModel");
const Order = require("../Models/OrderModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const Product = require("../Models/ProductModel");
const socketModule = require("../socket");

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
      await newOrder.save();
      sendNotification(sellerId);
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
        orders,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

const sendNotification = (sellerId) => {
  const socket = socketModule.getSocket();
  const room = `seller_${sellerId}`;
  console.log(room);
  let sellerSocket;
  const sellerSockets = socket.sockets.adapter.rooms.get(room);
  if (sellerSockets && sellerSockets.size === 1) {
    const [sellerSocketId] = sellerSockets;
    sellerSocket = socket.sockets.sockets.get(sellerSocketId);
  }

  if (sellerSocket) {
    sellerSocket.emit("notification", { data: "You Have A New Order" });
    console.log("Notification sent to the seller.");
  } else {
    console.log("Seller socket not found in the room.");
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

exports.cancelOrder = async function (req, res, next) {
  try {
    const orderId = req.params.id;
    let order = await Order.findById(orderId);

    if (!order) {
      res.status(404).json({
        status: "fail",
        message: "Order not found.",
      });
      return;
    }

    if (order.orderStatus === "shipped" || order.orderStatus === "delivered") {
      res.status(400).json({
        status: "fail",
        message:
          "Order has already been shipped/delivered and cannot be cancelled.",
      });
    } else {
      await Order.findByIdAndDelete(orderId);

      res.status(200).json({
        status: "success",
        message: "Order has been cancelled and deleted.",
      });
    }
  } catch (error) {
    return next(new AppError(error.message));
  }
};
