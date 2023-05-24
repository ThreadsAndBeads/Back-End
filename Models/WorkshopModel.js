const mongoose = require("mongoose");
const workshopSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Workshop must have a user id "],
  },
  seller_name: {
    type: String,
  },
  title: {
    type: String,
    required: [true, "Workshop must have a title"],
  },
  price: {
    type: Number,
    required: [true, "Workshop must have a price"],
  },
  description: {
    type: String,
    trim: true,
  },
  image: {
    type: String,
    required: [true, "Workshop must have a photo"],
  },
  startDate: {
    type: Date,
    default: Date.now(),
    required: [true, "Workshop must have a start date"],
  },
  endDate: {
    type: Date,
    required: [true, "Workshop must have a end date"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

const Workshop = mongoose.model("Workshop", workshopSchema);
module.exports = Workshop;
