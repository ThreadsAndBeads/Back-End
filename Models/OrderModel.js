const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },

    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },

        quantity: {
            type: Number,
            required: true,
            default: 1
        }
    }],
    totalPrice: { 
        type: Number,
        required: true,
    },
    orderStatus: [{
        type: String,
        required: true,
    }]
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
