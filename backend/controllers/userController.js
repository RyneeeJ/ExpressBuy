const Product = require("../models/productModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getMe = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findById(userId).select("-updatedAt -__v");

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

exports.updateProfileDetails = async (req, res, next) => {
  const userId = req.user._id;
  const { newFirstName, newLastName } = req.body;
  try {
    if (!newFirstName || !newLastName)
      throw new AppError("Please provide new profile details", 400);

    const user = await User.findById(userId).select("-updatedAt -__v");

    if (newFirstName) user.firstName = newFirstName;
    if (newLastName) user.lastName = newLastName;

    const updatedUser = await user.save({ validateModifiedOnly: true });
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

exports.changePassword = async (req, res, next) => {
  const userId = req.user._id;
  const { currentPassword, newPassword, newPasswordConfirm } = req.body;
  try {
    const user = await User.findById(userId).select("+password");

    const isPasswordCorrect = await user.isPasswordCorrect(currentPassword);

    if (!isPasswordCorrect)
      throw new AppError("Current password is incorrect", 400);

    if (currentPassword === newPassword)
      throw new AppError(
        "The new password must be different from the current one.",
        400
      );

    user.password = newPassword;
    user.passwordConfirm = newPasswordConfirm;
    await user.save({ validateBeforeSave: true });

    res.status(200).json({
      status: "Success",
      message: "Password successfully changed!",
    });
  } catch (err) {
    next(err);
  }
};

exports.addAddress = async (req, res, next) => {
  const userId = req.user._id;
  const { street, city, barangay } = req.body;
  try {
    const user = await User.findById(userId);

    if (!street || !city || !barangay)
      throw new AppError(
        "Please provide all required fields: street, barangay, and city/province name."
      );

    user.address.push({ street, city, barangay });
    const updatedUser = await user.save({ validateModifiedOnly: true });

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

exports.deleteAddress = async (req, res, next) => {
  const userId = req.user._id;
  const { addressId } = req.params;
  try {
    const user = await User.findById(userId);

    user.address.pull(addressId);
    await user.save({ validateModifiedOnly: true });
    res.status(204).json({
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};

exports.editAddress = async (req, res, next) => {
  const userId = req.user._id;
  const { addressId } = req.params; // Address ID from URL params
  const { street, city, barangay } = req.body; // Fields to update
  try {
    if (!street && !city && !barangay)
      throw new AppError("Could not update address with empty fields", 400);

    let updateFields = {};

    // Conditionally add fields if they exist in the request body
    if (street) updateFields["address.$.street"] = street;
    if (barangay) updateFields["address.$.barangay"] = barangay;
    if (city) updateFields["address.$.city"] = city;

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, "address._id": addressId }, // Find user & specific address
      { $set: updateFields },
      { new: true, runValidators: true } // Return updated document & validate fields
    );

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

exports.addWishlist = async (req, res, next) => {
  const userId = req.user._id;
  const { productId, variantId } = req.params;

  try {
    const productPromise = Product.findById(productId).select("variants");
    const userPromise = User.findById(userId);

    const [product, user] = await Promise.all([productPromise, userPromise]);
    if (!product) throw new AppError("Product not found", 404);

    const variantExists = product.variants.some(
      (v) => v._id.toString() === variantId
    );

    if (!variantExists)
      throw new AppError(
        "The product does not contain this specific variant",
        400
      );

    const exists = user.wishlist.some(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );

    if (exists)
      throw new AppError(
        "This product variant is already in your wishlist",
        400
      );

    user.wishlist.push({ product: productId, variant: variantId });
    await user.save({ validateModifiedOnly: true });

    res.status(201).json({
      status: "Success",
      data: {
        wishlist: user.wishlist,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.removeFromWishlist = async (req, res, next) => {
  const userId = req.user._id;
  const { productId, variantId } = req.params;

  try {
    const user = await User.findById(userId);
    user.wishlist.pull({ product: productId, variant: variantId });

    await user.save({ validateModifiedOnly: true });

    res.status(204).json({
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};

exports.clearWishlist = async (req, res, next) => {
  const userId = req.user._id;
  try {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { wishlist: [] } },
      { new: true }
    );

    res.status(200).json({
      status: "Success",
      data: {
        wishlist: user.wishlist,
      },
    });
  } catch (err) {
    next(err);
  }
};
