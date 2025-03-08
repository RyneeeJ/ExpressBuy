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
  const { street, city, country } = req.body;
  try {
    const user = await User.findById(userId);

    if (!street || !city || !country)
      throw new AppError(
        "Please provide all required fields: street, city, and country."
      );

    user.address.push({ street, city, country });
    const updatedUser = await user.save({ validateModifiedOnly: true });

    res.status(200).json({
      status: "Success",
      data: {
        address: updatedUser.address,
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
