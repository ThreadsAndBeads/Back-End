const Favourite = require("../Models/FavouriteModel");
const Product = require("../Models/ProductModel");
const User = require("../Models/UserModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");

exports.addToFavourite = async (req, res, next) => {
    try{
        const productId = req.body.productId;
        const product = await Product.findById(productId);
        const user = await User.findById(req.user._id);
        let userFavoutites = await Favourite.findOne({
            userId: req.user._id,
        });

        if (!product) {
            return next(new AppError("Product not found", 404));
        }

        if (!user) {
            return next(new AppError("user not found", 404));
        }

        if (!userFavoutites) {
            userFavoutites = await Favourite.create({
                userId: req.user._id,
                products: [{ product: productId }],
            });
        }else{
            userFavoutites.products.push({product: productId});
            await userFavoutites.save();
        }


        res.status(200).json({
            status: "success",
            data: userFavoutites,
        });
    } catch(error){
        return next(new AppError(error.message));
    }
};

exports.removeFromFavourite = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        const user = await User.findById(req.user._id);
        const userFavoutites = await Favourite.findOne({userId: user._id});
        
        if (!product) {
            return next(new AppError("Product not found", 404));
        }
        if (!user) {
            return next(new AppError("user not found", 404));
        }
        if (!userFavoutites) {
            return next(new AppError("user Favourites not found", 404));
        }

        let productIndex = userFavoutites.products.findIndex(
            (p) => p.product == productId
        );

        if (productIndex === -1) {
            return next(
                new AppError("Product not found in user Favoutites", 404)
            );
        }

        userFavoutites.products.splice(productIndex, 1);
        if(userFavoutites.products.length === 0) {
            await Favourite.findByIdAndDelete(userFavoutites._id);
        }else{
            await userFavoutites.save();
        }

        res.status(200).json({
            status: "success",
            data: userFavoutites,
        });
    } catch (error) {
        return next(new AppError(error.message));
    }
};

exports.clearFavourite = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const userFavoutites = await Favourite.findOneAndDelete({ userId: user._id });
        res.status(200).json({
            status: "success",
            message: "Favourite cleared successfully",
        });
    } catch (error) {
        return next(new AppError(error.message));
    }
};

exports.showFavourite = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const userFavoutites = await Favourite.findOne({
            userId: user._id,
        }).populate("products.product");
        res.status(200).json({
            status: "success",
            data: userFavoutites,
        });
    } catch (error) {
        return next(new AppError(error.message));
    }
}

exports.getTotalFavourites = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        const userFavoutites = await Favourite.findOne({
            userId: user._id,
        });

        let totalFavourites = 0;
        if(userFavoutites){
            totalFavourites = userFavoutites.products.length;
        }

        res.status(200).json({
            status: "success",
            totalFavourites: totalFavourites,
        });

    } catch (error) {
        return next(new AppError(error.message));
    }
}