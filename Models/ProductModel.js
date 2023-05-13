const mongoose = require("mongoose");
const productSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "product must have a user id "],
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
        required: [true, "product must have in stock quantity"],
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function (val) {
                return val < this.price;
            },
            message: "discount price should be below regular price",
        },
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

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
