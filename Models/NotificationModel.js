const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  sellerId: {
    type: String,
    required: true,
  },
  notificationDetails: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
