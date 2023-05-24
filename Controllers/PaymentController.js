const Cart = require("../Models/CartModel");
const User = require("../Models/UserModel");

const Order = require("../Models/OrderModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const Product = require("../Models/ProductModel");
const mongoose = require("mongoose");

exports.makePayment = async (req, res) => { 
    console.log(req);
      try {
        const { token, amount } = req.body;
        // Create a charge using the Stripe API
        const charge = await stripe.charges.create({
          amount: amount,
          currency: 'USD',
          source: token,
          description: 'Payment description',
        });
          
        res.status(200).json({ message: 'Payment successful' });
      } catch (error) {        res.status(500).json({ error: 'Payment failed' });
      }
    };
