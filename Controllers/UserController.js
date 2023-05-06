//user controller
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");

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
        sellers: user,
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
