const Workshop = require("../Models/WorkshopModel");
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");

exports.createWorkshop = async (req, res, next) => {
  try {
    // console.log(req.body.seller_id);
    let seller_id = req.body.seller_id;
    const seller = await User.findById(seller_id);
    if (!seller) {
      return next(new AppError("Seller id not found in users", 404));
    }
    const newWorkshop = await Workshop.create({
      seller_id: seller_id,
      title: req.body.title,
      category: req.body.category,
      price: req.body.price,
      description: req.body.description,
      images: req.body.images,
      startDate: req.body.startDate,
      endDate: req.body.endDate,
    });

    res.status(201).json({
      status: "success",
      data: {
        workshop: newWorkshop,
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

exports.updateWorkshop = async (req, res, next) => {
  try {
    const workshopId = req.params.id;
    const updates = req.body;
    const options = { new: true };
    const updatedWorkshop = await Workshop.findByIdAndUpdate(
      workshopId,
      updates,
      options
    );
    if (updatedWorkshop) {
      res.status(200).json({
        status: "success",
        data: {
          workshop: updatedWorkshop,
        },
      });
    } else {
      return next(new AppError("can not find Workshop", 404));
    }
  } catch (err) {
    return next(new AppError(err.message));
  }
};

<<<<<<<<< Temporary merge branch 1
exports.deleteWorkshop = async (req, res, next) => {
  try {
    const workshopId = req.params.id;
    const deletedWorkshop = await Workshop.findByIdAndDelete(workshopId);
    if (deletedWorkshop) {
      res.status(200).json({
        status: "success",
        data: null,
      });
    } else {
      return next(new AppError("Can not find workshop", 404));
    }
  } catch (err) {
    return next(new AppError(err.message));
  }
};

exports.showAllWorkshops = async (req, res, next) => {
  try {
    const workshops = await Workshop.find();
    res.status(200).json({
      status: "success",
      data: {
        workshops: workshops,
=========
exports.getWorkshopById = async (req, res, next) => {
  try {
    const workshopId = req.params.id;
    const workshop = await Workshop.findById(workshopId);
    if (!workshop) {
      return next(new AppError("Workshop not found", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        workshop,
>>>>>>>>> Temporary merge branch 2
      },
    });
  } catch (error) {
    return next(new AppError(error.message));
  }
};

