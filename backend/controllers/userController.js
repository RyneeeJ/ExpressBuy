const User = require("../models/userModel");
const AppError = require("../utils/appError");

exports.getMe = async (req, res, next) => {
  const userId = req.user._id.toString();
  try {
    const user = await User.findById(userId).select(
      "-password -updatedAt -__v"
    );

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

    const user = await User.findById(userId).select(
      "-password -updatedAt -__v"
    );

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
