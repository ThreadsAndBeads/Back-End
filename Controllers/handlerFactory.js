const AppError = require("./../utils/appError");

exports.deleteOne = (Model, msg) => async (req, res, next) => {
  try {
    const product = await Model.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new AppError("Product not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: msg,
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};
