const Workshop = require("../Models/WorkshopModel");
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
exports.createWorkshop = factory.createOne(Workshop);
exports.updateWorkshop = factory.updateOne(Workshop, "can not find Workshop");
exports.deleteWorkshop = factory.deleteOne(
  Workshop,
  "workshop is deleted successfully"
);
exports.getWorkshopById = factory.getOne(Workshop, "Workshop not found");

exports.showAllWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find();
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
