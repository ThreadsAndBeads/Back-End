const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserModel");
const Order = require("../Models/OrderModel");
const AppError = require("./../utils/appError");

exports.CreateOrder = async (req, res, next) => { 
    try {
        const user_id = req.params.user_id;
        const cart = await Cart.findOne({ user_id }).populate("products.productId");
        if (!cart.products.length) {
            return res.status(404).json({
              status: "fail",
              message: "No products in cart",
            });
          }
        const newOrder = new Order({
            userId: cart.userId,
            products: cart.products,
        });
  
        const totalPrice = cart.products.reduce(
                         (total, product) => total + product.quantity * product.productId.price,0);
        newOrder.totalPrice = totalPrice;
  
        newOrder.orderStatus = "pending";

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
