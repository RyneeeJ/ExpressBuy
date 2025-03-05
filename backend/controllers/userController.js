const User = require("../models/userModel");

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
