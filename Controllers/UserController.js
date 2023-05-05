//user controller
const User = require("../Models/UserModel");
const Product = require("../Models/ProductModel");

exports.getUserById = async (req, res) => {
  try {
    userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "User not found",
      });
    }

    res.status(200).json({
      status: "success",
      data: {
        sellers: user,
      },
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

//get all sellers
exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await User.find({ type: "seller" });
    res.status(200).json({
      status: "success",
      data: {
        sellers: sellers,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};


