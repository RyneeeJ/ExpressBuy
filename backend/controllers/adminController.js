const Product = require("../models/productModel");
const AppError = require("../utils/appError");

exports.addNewProduct = async (req, res, next) => {
  const { name, brand, primaryImage, description, variants, price } = req.body;
  try {
    const newProduct = await Product.create({
      name,
      brand,
      primaryImage,
      description,
      variants,
      price,
      priceDiscount: req.body.priceDiscount || undefined,
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
      req.params.productId,
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

exports.addProductVariant = async (req, res, next) => {
  const newVariant = req.body;
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) throw new AppError("No product found with this id", 404);

    product.variants.push(newVariant);
    await product.save();

    res.status(201).json({
      status: "Success",
      data: {
        productVariant: newVariant,
      },
      message: "New product variant added",
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProductVariant = async (req, res, next) => {
  const { productId, variantId } = req.params;
  let message;
  try {
    // check if there is a product htat mathces with productId
    const product = await Product.findById(productId);

    if (!product) throw new AppError("No product found with this id", 404);

    // Check if there is a variant that matches with variantId
    const variant = product.variants.find(
      (variant) => String(variant._id) === variantId
    );

    if (!variant)
      throw new AppError(
        "Product variant with the specified variantId not found in the database",
        404
      );

    if (product.hasOnlyOneVariant()) {
      await Product.findByIdAndDelete(productId);
      message = "Last variant deleted. Product removed.";
    } else {
      product.variants.pull({ _id: variantId });
      await product.save();
      message = "Product variant deleted.";
    }

    res.status(204).json({
      status: "Success",
      message,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.findByIdAndDelete(req.params.productId);

    res.status(204).json({
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};
