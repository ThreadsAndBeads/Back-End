const Product = require("../Models/ProductModel");
const Workshop = require("../Models/WorkshopModel");
const Cart = require("../Models/CartModel");
const AppError = require("./../utils/appError");
const factory = require("./handlerFactory");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;

const fs = require("fs/promises");

const APIFeatures = require("./../utils/apiFeatures");

const { storage } = require("../storage/storage");
const upload = multer({ storage });

exports.resizeProductImages = async (req, res, next) => {
    if (!req.files) return next();
    if (!req.files.images) return next();
    req.body.images = [];
    await Promise.all(
        req.files.images.map(async (file, i) => {
            const filename = file.path;
            req.body.images.push(filename);
        })
    );
    next();
};

exports.uploadProductImages = upload.fields([{ name: "images", maxCount: 3 }]);
exports.createProduct = (req, res, next) => {
    const { price, priceDiscount } = req.body;
    let actualPrice = price;
    if (priceDiscount > 0) {
        actualPrice = price - priceDiscount;
    }
    req.body.actualPrice = actualPrice;
    factory.createOne(Product)(req, res, next);
};

exports.getAllProducts = async (req, res, next) => {
    try {
        let filter = {};
        const features = new APIFeatures(Product.find(filter), req.query)
            .filter()
            .sort()
            .limitFields()
            .paginate();

        const totalRecords = await Product.countDocuments();
        const products = await features.query;
        res.status(201).json({
            status: "success",
            data: {
                products: products,
                totalRecords: totalRecords,
            },
        });
    } catch (error) {
        return next(new AppError(error.message));
    }
};

exports.getProduct = factory.getOne(
    Product,
    "Product not found for the given ID"
);

exports.deleteProduct = factory.deleteOne(
    Product,
    "product is deleted successfully"
);

exports.updateProduct = factory.updateOne(Product, "can not find product");

exports.getHighestDiscountedProducts = async (req, res, next) => {
    try {
        const discountedProducts = await Product.find({
            priceDiscount: { $gt: 0 },
        });

        // Sort the products by descending order of discount percentage
        const sortedDiscountedProducts = discountedProducts.sort((a, b) => {
            const discountA = a.discountPercentage;
            const discountB = b.discountPercentage;
            return discountB - discountA;
        });

        // Return the top 10 products with the highest discount
        const topDiscountedProducts = sortedDiscountedProducts.slice(0, 10);

        res.status(200).json({
            status: "success",
            data: {
                products: topDiscountedProducts,
            },
        });
    } catch (error) {
        return next(new AppError(error.message));
    }
};

exports.getAllCategories = async (req, res, next) => {
    try {
        const categoriesJson = await fs.readFile("categories.json");
        const categoriesParse = JSON.parse(categoriesJson);
        const products = await Product.find();

        const categories = categoriesParse.map((category) => {
            const productNum = products.filter(
                (product) => product.category === category.name
            ).length;
            return { id: category.id, name: category.name, productNum };
        });

        res.json(categories);
    } catch (error) {
        return next(new AppError(error.message));
    }
};

exports.search = async (req, res, next) => {
    try {
        const products = await Product.find({
            $or: [{ name: { $regex: req.query.q, $options: "i" } }],
        });
        const workshops = await Workshop.find({
            $or: [{ title: { $regex: req.query.q, $options: "i" } }],
        });
        results = {
            products,
            workshops,
        };
        res.json(results);
    } catch (err) {
        return next(new AppError(err.message));
    }
};

exports.priceRange = async (req, res, next) => {
    try {
        const prices = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    minPrice: { $min: "$price" },
                    maxPrice: { $max: "$price" },
                },
            },
        ]);

        const minPrice = prices[0].minPrice;
        const maxPrice = prices[0].maxPrice;

        return res.json({
            minPrice: minPrice,
            maxPrice: maxPrice,
        });
    } catch (error) {
        return next(new AppError(error.message));
    }
};

exports.deleteProductImages = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);
        if (product.images.length > 0) {
            product.images.forEach(async (image) => {
                const imageUrl = image.split("/");
                const imageName = imageUrl[imageUrl.length - 1];
                const name = imageName.split(".")[0];
                deleteimage(name);
            });
        }
        next();
    } catch (error) {
        return next(new AppError(error.message));
    }
};

exports.checkIfProductInCart = async (req, res, next) => {
    try {
        const productId = req.params.id;
        const carts = await Cart.find({ "products.productId": productId });
        if (carts) {
            carts.forEach(async (cart) => {
                let productIndex = cart.products.findIndex(
                    (p) => p.productId == productId
                );
                if (productIndex != -1) {
                    cart.products.splice(productIndex, 1);
                    await cart.save();
                }
            });
        }
        next();
    } catch (error) {
        return next(new AppError(error.message));
    }
};

const deleteimage = async (image) => {
    return await cloudinary.uploader.destroy(
        `CloudinaryDemo/${image}`,
        { invalidate: true, resource_type: "image" },
        function (err, res) {
            if (err) {
                console.log(err);
                return res.status(400).json({
                    ok: false,
                    mensaje: "Error deleting file",
                    errors: err,
                });
            }
            console.log(res);
        }
    );
};
