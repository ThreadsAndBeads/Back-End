const Product = require("../Models/ProductModel");

exports.createProduct = async (req, res, next) => {
  try {
    const newProduct = await Product.create({
      user_id: req.body.user_id,
      name: req.body.name,
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
    console.error("Error creating product:", error.message);
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
