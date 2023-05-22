const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Users",
    required: true,
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    // ref: "Users",
    required: true,
  },
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        default: 1,
      },
    },
  ],
  totalPrice: {
    type: Number,
    required: true,
  },
  orderStatus: {
    type: String,
    enum: ["pending", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  clientAddress: {
    apartmentNo: {
      type: String,
    },
    city: {
      type: String,
      required: true,
    },
    address: {
      type: String,
      required: true,
    },
  },
  phone: {
    type: String,
    required: true,
  },
  client_name: {
    type: String,
    required: true,
  },
  payment_method: {
    type: String,
    enum: ["cash", "credit"],
    default: "cash",
  },
});

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
