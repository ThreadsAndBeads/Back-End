const mongoose = require("mongoose");
const workshopSchema = new mongoose.Schema({
  seller_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "Workshop must have a user id "],
  },
  title: {
    type: String,
    required: [true, "Workshop must have a title"],
  },
  category: {
    type: String,
    required: [true, "Workshop must have a category"],
  },
  price: {
    type: Number,
    required: [true, "Workshop must have a price"],
  },
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    required: [true, "Workshop must have a price"],
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
