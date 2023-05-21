//user controller
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");
const Sale = require("../Models/SaleModel");

const factory = require("./handlerFactory");
const multer = require("multer");
const { storage } = require("../storage/storage");
const upload = multer({ storage });
exports.resizeUserImage = async (req, res, next) => {
  if (!req.file) return next();
  console.log(req.file.path);
  req.body.image = req.file.path;
  next();
};

exports.uploadUserImage = upload.single("image");
exports.updateUser = factory.updateOne(User, "user is not found!");

exports.getUserById = async (req, res, next) => {
  try {
    userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return next(new AppError("User not found", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        user: user,
      },
    });
  } catch (err) {
    return next(new AppError(err.message, 404));
  }
};
//get all sellers
exports.getAllSellers = async (req, res, next) => {
  try {
    const sellers = await User.find({ type: "seller" });
    res.status(200).json({
      status: "success",
      data: {
        sellers: sellers,
      },
    });
  } catch (error) {
    return next(new AppError(err.message, 404));
  }
};
exports.getTopSellers = async (req, res, next) => {
  try {
    const topSellers = await Sale.aggregate([
      {
        $group: {
          _id: "$sellerId",
          totalRevenue: { $sum: "$totalPrice" },
        },
      },
      {
        $sort: { totalRevenue: -1 },
      },
      {
        $limit: 3,
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "seller",
        },
      },
      {
        $unwind: "$seller",
      },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "user_id",
          as: "sellerProducts",
        },
      },
      // {
      //   $lookup: {
      //     from: "images",
      //     localField: "_id",
      //     foreignField: "sellerId",
      //     as: "sellerImage",
      //   },
      // },
      {
        $project: {
          _id: 0,
          sellerId: "$_id",
          sellerName: "$seller.name",
          totalRevenue: 1,
          sellerProductsCount: { $size: "$sellerProducts" },
          sellerImage: "$seller.image",
        },
      },
    ]);

    res.status(200).json({
      status: "success",
      data: {
        topSellers,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};
