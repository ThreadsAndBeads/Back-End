const Workshop = require("../Models/WorkshopModel");
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const APIFeatures = require("./../utils/apiFeatures");

const multer = require("multer");
require("dotenv").config();
const { storage } = require("../storage/storage");
const upload = multer({ storage });

exports.resizeWorkshopImage = async (req, res, next) => {
  if (!req.file) return next();
  req.body.image = req.file.path;
  next();
};

exports.uploadWorkshopImage = upload.single("image");
exports.createWorkshop = factory.createOne(Workshop);

exports.updateWorkshop = factory.updateOne(Workshop, "can not find Workshop");

exports.deleteWorkshop = factory.deleteOne(
  Workshop,
  "workshop is deleted successfully"
);

exports.getWorkshopById = factory.getOne(Workshop, "Workshop not found");
exports.saveSellerData = async (req, res, next) => {
  try {
    const user = await User.findById(req.body.seller_id);
    req.body.seller_name = user.name;
    next();
  } catch (err) {}
};
exports.showAllWorkshops = async (req, res, next) => {
  try {
    let filter = {};
    const features = new APIFeatures(Workshop.find(filter), req.query)
      .filter()
      .limitFields()
      .paginate();

    const workshops = await features.query;
    const totalRecords = await Workshop.countDocuments();
    res.status(201).json({
      status: "success",
      data: {
        workshops: workshops,
        totalRecords: totalRecords,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};
