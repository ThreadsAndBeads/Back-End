const Product = require("../Models/ProductModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
const sharp = require("sharp");
require("dotenv").config();
const { storage } = require("../storage/storage");
const upload = multer({ storage });


// const multerStorage = multer.memoryStorage();
// const multerFilter = (req, file, cb) => {
//   if (file.mimetype.startsWith("image")) {
//     cb(null, true);
//   } else {
//     cb(new AppError("not an image please upload only images", 400), false);
//   }
// };
// const upload = multer({
//   storage: multerStorage,
//   fileFilter: multerFilter,
// });

exports.resizeProductImages = async (req, res, next) => {
  if (!req.files) return next();
  if (!req.files.images) return next();
  req.body.images = [];
  await Promise.all(
    req.files.images.map(async (file, i) => {
      const filename = file.path;
      // await sharp(file.buffer)
      //   // .resize(500, 500, {
      //   //   fit: "contain",
      //   // })
      //   .toFormat("jpeg")
      //   .jpeg({ quality: 90 })
      //   .toFile(`public/img/products/${filename}`);
      req.body.images.push(filename);
    })
    );
  next();
};

exports.uploadProductImages = upload.fields([{ name: "images", maxCount: 3 }]);

// exports.createProduct = factory.createOne(Product);
exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create({
      user_id: req.body.user_id,
      name: req.body.name,
      category: req.body.category,
      price: req.body.price,
      priceDiscount: req.body.priceDiscount,
      description: req.body.description,
      images: req.body.images,
    });

    res.status(201).json({
      status: "success",
      data: {
        product: newProduct,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.getAllProducts = async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.query.filterBy) {
      filter = {
        ...filter,
        [req.query.filterBy]: req.query.filterValue,
      };
    }
    const products = await Product.find(filter).skip(skip).limit(limit);
    res.status(201).json({
      status: "success",
      data: {
        products: products,
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
