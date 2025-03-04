const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");

// Product management
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

exports.updateProductVariant = async (req, res, next) => {
  const { productId, variantId } = req.params;
  const { description, SKU, stock, price } = req.body;
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

    if (description) variant.description = description;
    if (SKU) variant.SKU = SKU;
    if (stock) variant.stock = stock;
    if (price) variant.price = price;

    await product.save({ validateModifiedOnly: true });

    res.status(200).json({
      status: "Success",
      data: {
        product,
      },
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

// Order management
exports.updateOrderStatus = async (req, res, next) => {
  const { status } = req.body;
  try {
    const order = await Order.findById(req.params.orderId).populate({
      path: "user",
      select: "email firstName",
    });
    if (!order) throw new AppError("Order not found", 404);

    if (order.status.toLowerCase() === status.toLowerCase())
      throw new AppError(
        "Please select an order status different from the current one",
        400
      );

    order.status = status;
    const updatedOrder = await order.save();

    // Send email notification of the updates order status
    await sendEmail({
      recipient: updatedOrder.user.email,
      subject: "ExpressBuy: Order status update",
      message: `Hi ${updatedOrder.user.firstName},your order with an ID of #${
        updatedOrder._id
      } has been ${updatedOrder.status.toLowerCase()}. Thank you for ordering! 😊`,
    });

    res.status(200).json({
      status: "Success",
      message: "Order status updated",
      data: {
        order: updatedOrder,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getOrderStats = async (req, res, next) => {
  try {
    const successfulOrdersPromise = Order.countDocuments({
      status: "Delivered",
    });

    const pendingOrdersPromise = Order.countDocuments({
      status: "Pending",
    });

    const cancelledOrdersPromise = Order.countDocuments({
      status: "Cancelled",
    });

    const totalRevenuePromise = Order.aggregate([
      { $match: { status: "Delivered" } },
      { $group: { _id: null, revenue: { $sum: "$totalPrice" } } },
    ]);

    const mostSoldProductsPromise = Order.aggregate([
      { $match: { status: "Delivered" } },
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.product.id",
          totalSold: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalSold: -1 } },
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productDetails",
        },
      },
      { $unwind: "$productDetails" },
      {
        $project: {
          _id: 1,
          totalSold: 1,
          "productDetails.name": 1,
          "productDetails.price": 1,
          "productDetails.primaryImage": 1, // If you store product images
        },
      },
    ]);

    const [
      successfulOrders,
      pendingOrders,
      cancelledOrders,
      [{ revenue }],
      mostSoldProducts,
    ] = await Promise.all([
      successfulOrdersPromise,
      pendingOrdersPromise,
      cancelledOrdersPromise,
      totalRevenuePromise,
      mostSoldProductsPromise,
    ]);

    res.status(200).json({
      status: "Success",
      data: {
        successfulOrders,
        pendingOrders,
        cancelledOrders,
        totalRevenue: revenue,
        mostSoldProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getLowStockProducts = async (req, res, next) => {
  const lowStockProducts = await Product.aggregate([
    {
      $unwind: "$variants",
    },
    {
      $match: {
        "variants.stock": { $lt: Number(process.env.LOW_STOCK_THRESHOLD) },
      },
    },
    {
      $project: {
        name: 1,
        "variants.description": 1,
        "variants.SKU": 1,
        "variants.stock": 1,
      },
    },
  ]);

  try {
    res.status(200).json({
      status: "Success",
      data: {
        products: lowStockProducts,
      },
    });
  } catch (err) {
    next(err);
  }
};

// User management
exports.getAllUsers = async (req, res, next) => {
  try {
    const groupedUsers = await User.aggregate([
      {
        $project: {
          firstName: 1,
          lastName: 1,
          email: 1,
          role: 1,
        },
      },
      {
        $facet: {
          admins: [{ $match: { role: "admin" } }],
          customers: [{ $match: { role: "customer" } }],
        },
      },
    ]);

    res.status(200).json({
      status: "Success",
      data: {
        users: groupedUsers,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getUserDetails = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.userId).select(
      "-__v -password"
    );

    if (!user) throw new AppError("User not found", 404);

    res.status(200).json({
      status: "Success",
      data: {
        user,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateUserRole = async (req, res, next) => {
  const { userId } = req.params;
  const { newRole } = req.body;
  const myId = req.user._id.toString();
  try {
    if (myId === userId)
      throw new AppError("You cannot change your own role", 400);

    const user = await User.findById(userId).select(
      "firstName lastName email role address"
    );

    if (!user) throw new AppError("User not found", 404);
    if (user.role === newRole.toLowerCase())
      throw new AppError(`User is already assigned the role of '${user.role}'`);

    user.role = newRole.toLowerCase();
    const updatedUser = await user.save();

    res.status(200).json({
      status: "Success",
      data: {
        user: updatedUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteUser = async (req, res, next) => {
  try {
    res.status(200).json({
      status: "Success",
      data: {},
    });
  } catch (err) {
    next(err);
  }
};
