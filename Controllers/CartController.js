const Cart = require("../Models/CartModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserModel");

exports.AddToCart = async (req, res) => {
    try {
        const productId = req.body.products.productId;
        const product = await Product.findById(productId);
        const user = await User.findById(req.body.userId);
        let cart = await Cart.findOne({ userId: req.body.userId });
        
        if (!product) {
            return res.status(400).json({
                status: "fail",
                message: "Product not found",
            });
        }
        
        if (!user) {
            return res.status(400).json({
                status: "fail",
                message: "user not found",
            });
        }
        
        if (!cart) {
            cart = await Cart.create({ userId: req.body.userId, products: [] });
        }

        let productIndex = cart.products.findIndex(
            (p) => p.productId == productId
        );

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
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};
