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
