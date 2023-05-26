const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, "product must have a user id "],
    ref: "Users",
  },
  name: {
    type: String,
    required: [true, "product must have a name"],
  },
  category: {
    type: String,
    required: [true, "product must have a category"],
  },
  price: {
    type: Number,
    required: [true, "product must have a price"],
  },
  inStock: {
    type: Number,
  },
  priceDiscount: {
    type: Number,
    validate: {
      validator: function (val) {
        console.log(val, this.get("price"));
        return val < this.get("price");
      },
      message: "discount price should be below regular price",
    },
  },
  actualPrice: {
    type: Number,
  },
  description: {
    type: String,
    trim: true,
  },
  images: {
    type: [String],
    required: [true, "product must have a price"],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

productSchema.virtual("discountPercentage").get(function () {
  return (this.priceDiscount / this.price) * 100;
});
productSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate();
  const filter = this.getFilter();

  if (update.price || update.priceDiscount) {
    const product = await this.model.findOne(filter);

    if (update.priceDiscount > 0) {
      update.actualPrice = update.price - update.priceDiscount; 
    } else {
      update.actualPrice = update.price; 
    }
  }

  next();
});
const Product = mongoose.model("Product", productSchema);
module.exports = Product;
