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
    if (!product) {
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

exports.getHighestDiscountedProducts = async (req, res) => {
    try {
      // Find all products with a discount
      const discountedProducts = await Product.find({ priceDiscount: { $gt: 0 } });
      
  
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
      res.status(400).json({
        status: "fail",
        message: error.message,
      });
    }
  };

  exports.updateProduct = async (req, res) => {
    try {
      const productId = req.params.id;
      const updates = req.body;
      const options = { new: true };
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        updates,
        options
      );
      res.json(updatedProduct);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
  };  
