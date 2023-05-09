const AppError = require("./../utils/appError");

exports.deleteOne = (Model, errorMsg) => async (req, res, next) => {
  try {
    const product = await Model.findByIdAndDelete(req.params.id);
    if (!product) {
      return next(new AppError("object not found", 404));
    }
    res.status(200).json({
      status: "success",
      message: errorMsg,
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};
exports.updateOne = (Model, errorMsg) => async (req, res, next) => {
  try {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    console.log(doc);
    if (doc) {
      res.status(200).json({
        status: "success",
        data: {
          data: doc,
        },
      });
    } else {
      return next(new AppError(errorMsg, 404));
    }
  } catch (err) {
    return next(new AppError(err.message));
  }
};
exports.createOne = (Model, errorMsg) => async (req, res, next) => {
  try {
    const doc = await Model.create(req.body);
    res.status(201).json({
      status: "success",
      data: {
        product: doc,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.getOne = (Model, errorMsg) => async (req, res, next) => {
  try {
    const doc = await Model.findById(req.params.id);
    if (!doc) {
      return next(new AppError(errorMsg, 404));
    }
    res.status(201).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  } catch (error) {
    return next(new AppError(error.message, 404));
  }
};
