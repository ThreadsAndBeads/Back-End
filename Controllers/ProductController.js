const Product = require("../Models/ProductModel");

exports.createProduct = async (req, res, next) => {
    try {
        const newProduct = await Product.create({
            user_id: req.body.user_id,
            name: req.body.name,
            category: req.body.category,
            price: req.body.price,
            priceDiscount: req.body.priceDiscount,
            description: req.body.description,
            images: req.body.images,
        });

        res.status(201).json({
            status: "success",
            data: {
                product: newProduct,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        let filter = {};
        if (req.query.filterBy) {
            filter = {
                ...filter,
                [req.query.filterBy]: req.query.filterValue,
            };
        }
        const products = await Product.find(filter);

        if (products.length === 0) {
            return res.status(400).json({
                status: "fail",
                message: "No products Found",
            });
        }

        res.status(201).json({
            status: "success",
            data: {
                products: products,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if(! product){
            return res.status(404).json({
                status: "Not Found",
                message: "Product not found for the given ID",
            });
        }
        res.status(201).json({
            status: "success",
            data: {
                product: product,
            },
        });
    } catch (error) {
        res.status(400).json({
            status: "fail",
            message: error.message,
        });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
        return res.status(404).json({
            status: "fail",
            message: "Product not found",
        });
        }

        res.status(200).json({
        status: "success",
        message: "product is deleted successfully",
        });
    } catch (error) {
        res.status(400).json({
        status: "fail",
        message: error.message,
        });
    }
};
