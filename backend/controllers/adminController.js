const Product = require("../models/productModel");

exports.addNewProduct = async (req, res, next) => {
  const { name, brand, primaryImage, description, variants } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      brand,
      primaryImage,
      description,
      variants,
    });

    res.status(201).json({
      status: "Success",
      data: {
        product: newProduct,
      },
      message: "New product created!",
    });
  } catch (err) {
    next(err);
  }
};
