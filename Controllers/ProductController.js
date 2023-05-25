const Product = require("../Models/ProductModel");
const Workshop = require("../Models/WorkshopModel");
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");

const fs = require("fs/promises");

const Cart = require("../Models/CartModel");
const APIFeatures = require("./../utils/apiFeatures");

const { storage } = require("../storage/storage");
const { log } = require("console");
const upload = multer({ storage });

exports.resizeProductImages = async (req, res, next) => {
  if (!req.files) return next();
  if (!req.files.images) return next();
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = file.path;
      req.body.images.push(filename);
    })
  );
  next();
};

exports.uploadProductImages = upload.fields([{ name: "images", maxCount: 3 }]);
exports.createProduct = (req, res, next) => {
  const { price, priceDiscount } = req.body;
  let actualPrice = price; 
  if (priceDiscount > 0) {
    actualPrice = price - priceDiscount; 
  }
  req.body.actualPrice = actualPrice; 
  factory.createOne(Product)(req, res, next); 
};
// exports.createProduct = factory.createOne(Product);

exports.getAllProducts = async (req, res, next) => {
  try {
    let filter = {};
    const features = new APIFeatures(Product.find(filter), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const totalRecords = await Product.countDocuments();
    const products = await features.query;
    res.status(201).json({
      status: "success",
      data: {
        products: products,
        totalRecords: totalRecords,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.getProduct = factory.getOne(
  Product,
  "Product not found for the given ID"
);

exports.deleteProduct = factory.deleteOne(
  Product,
  "product is deleted successfully"
);

exports.updateProduct = factory.updateOne(Product, "can not find product");

exports.getHighestDiscountedProducts = async (req, res, next) => {
  try {
    // Find all products with a discount
    const discountedProducts = await Product.find({
      priceDiscount: { $gt: 0 },
    });

    // Sort the products by descending order of discount percentage
    const sortedDiscountedProducts = discountedProducts.sort((a, b) => {
      const discountA = a.discountPercentage;
      const discountB = b.discountPercentage;
      return discountB - discountA;
    });

    // Return the top 10 products with the highest discount
    const topDiscountedProducts = sortedDiscountedProducts.slice(0, 10);

    res.status(200).json({
      status: "success",
      data: {
        products: topDiscountedProducts,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.getAllCategories = async (req, res, next) => {
  try {
    const categoriesJson = await fs.readFile("categories.json");
    const categoriesParse = JSON.parse(categoriesJson);
    const products = await Product.find();

    const categories = categoriesParse.map((category) => {
      const productNum = products.filter(
        (product) => product.category === category.name
      ).length;
      return { id: category.id, name: category.name, productNum };
    });

    res.json(categories);
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.search = async (req, res, next) => {
  try {
    const products = await Product.find({
      $or: [{ name: { $regex: req.query.q, $options: "i" } }],
    });
    const workshops = await Workshop.find({
      $or: [{ title: { $regex: req.query.q, $options: "i" } }],
    });
    results = {
      products,
      workshops,
    };
    res.json(results);
  } catch (err) {
    return next(new AppError(err.message));
  }
};
