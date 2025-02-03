const Product = require("../models/productModel");
const AppError = require("../utils/appError");

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

exports.updateProductDetails = async (req, res, next) => {
  try {
    if (req.body.variants)
      throw new AppError(
        "This route is for updating general details of the product and not product variant(s) updates",
        400
      );
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
        select: "-variants -__v",
      }
    );

    if (!updatedProduct)
      throw new AppError("Product with this id not found in the database", 404);

    res.status(200).json({
      status: "Success",
      data: {
        product: updatedProduct,
      },
      message: "Product successfully updated",
    });
  } catch (err) {
    next(err);
  }
};
