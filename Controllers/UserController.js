//user controller
const User = require("../Models/UserModel");

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
