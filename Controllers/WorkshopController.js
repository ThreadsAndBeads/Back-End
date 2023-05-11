const Workshop = require("../Models/WorkshopModel");
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
require("dotenv").config();
const { storage } = require("../storage/storage");
const upload = multer({ storage });

exports.resizeWorkshopImage = async (req, res, next) => {
  if (!req.file) return next();
  console.log(req.file.path);
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
  const user = await User.findById(req.body.seller_id);
  // console.log(user);
  req.body.seller_name = user.name;
  next();
};
exports.showAllWorkshops = async (req, res, next) => {
  try {
    const page = req.query.page * 1 || 1;
    const limit = req.query.limit * 1 || 5;
    const skip = (page - 1) * limit;
    const workshops = await Workshop.find().skip(skip).limit(limit);
    res.status(200).json({
      status: "success",
      data: {
        workshops: workshops,
      },
    });
  } catch (err) {
    return next(new AppError(err.message));
  }
};
