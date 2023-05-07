const { log } = require("console");
const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");

exports.AddToCart = async (req, res, next) => {
  try {
    const productId = req.body.products.productId;
    const product = await Product.findById(productId);
    const user = await User.findById(req.body.userId);
    let cart = await Cart.findOne({ userId: req.body.userId });

    if (!product) {
      return next(new AppError("Product not found", 404));
    }

    if (!user) {
      return next(new AppError("user not found", 404));
    }

    if (!cart) {
      cart = await Cart.create({ userId: req.body.userId, products: [] });
    }

    let productIndex = cart.products.findIndex((p) => p.productId == productId);

    if (productIndex !== -1) {
      cart.products[productIndex].quantity += req.body.products.quantity || 1;
    } else {
      cart.products.push({
        productId: productId,
        quantity: req.body.products.quantity || 1,
      });
    }

    await cart.save();

    res.status(201).json({
      status: "success",
      data: {
        cart: cart,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.params.id;
    const cart = await Cart.deleteOne({ userId });

    if (!cart) {
      return next(new AppError("Cart not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: "Cart cleared successfully",
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.DeleteProduct = async (req, res, next) => {
  try { 
    const productId = req.params.id;
    const userId = req.user._id;
    const cart = await Cart.findOne({ userId });
    if(!cart){
      return next(new AppError("Cart not found", 404));
    }

    let productIndex = cart.products.findIndex((p) => p.productId == productId);

    if (productIndex === -1) {
      return next(new AppError("Product not found in cart", 404));
    }

    cart.products.splice(productIndex, 1);
    await cart.save();

    res.status(200).json({
      status: "success",
      data: cart,
    });

  } catch (error) {
    return next(new AppError(error.message));
  }
}

exports.getTotalProductsInCart = async (req, res) => {
  const userId = req.params.id;
  try {
    const cart = await Cart.find({userId});
    let total = cart[0].products.length;
    res.status(200).json({ 
        status: 'success',
        totalProducts: total });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
        status: 'failed',
        message: "Error retrieving cart products." });
  }
};

exports.showCart = async (req, res) => {
  const userId = req.params.id;
  try {
    const cart = await Cart.findOne({ userId }).populate("products.productId");
    res.status(200).json({
      status: "success",
      data: {
        cart: cart,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ 
        status: 'failed',
        message: "Error retrieving cart products." });
  }
};