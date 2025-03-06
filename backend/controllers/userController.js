const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getMe = async (req, res, next) => {
  const userId = req.user._id.toString();
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
  const userId = req.user._id.toString();
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
  const userId = req.user._id.toString();
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
