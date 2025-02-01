const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const User = require("../models/userModel");
const BlacklistedToken = require("../models/blacklistedTokenModel");
const AppError = require("../utils/appError");
const sendEmail = require("../utils/sendEmail");

const signCookieToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  return token;
};

exports.protectRoute = function (isSigningUp = false) {
  return async (req, res, next) => {
    try {
      // retrieve jwt from cookie or auth headers
      const token = req.cookies?.jwt;

      if (isSigningUp && !token) return next();

      if (!isSigningUp && !token)
        throw new AppError(
          "Unauthorized: Please login first to perform this request",
          401
        );

      // If token is blacklisted, throw error
      const isTokenBlacklisted = await BlacklistedToken.findOne({ token });
      if (isTokenBlacklisted) throw new AppError("Token is invalid", 401);

      // validate jwt
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // check if user still exists
      const user = await User.findById(decoded.id).select("role");

      if (!user)
        throw new AppError(
          "The owner of this token does not exist. Please log in again.",
          401
        );
      // check if user has changed his password after issuing the jwt
      if (user.passwordChangedAfterTokenIssued(decoded.iat))
        throw new AppError(
          "The user changed password after this token was issued. Please log in again.",
          401
        );

      // if valid, set user to req.user
      req.user = user;
      next();
    } catch (err) {
      next(err);
    }
  };
};

// NOTE: Can be merged with signup controller depending if this is not needed anymore in other features
exports.checkAdminRole = async (req, res, next) => {
  try {
    if (req.user && req.user.role === "admin") req.role = "admin";
    next();
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  // Get credentials from req.body
  const { firstName, lastName, email, password, passwordConfirm } = req.body;

  const userRequest = {
    firstName,
    lastName,
    email,
    password,
    passwordConfirm,
    role: req.role || "customer",
  };
  // Add address field to userRequest object if it exists (for customers)
  if (req.body.address) userRequest.address = req.body.address;

  try {
    const newUser = await User.create(userRequest);
    newUser.password = undefined;
    // create token and send to client
    const token = signCookieToken(newUser._id, res);
    res.status(201).json({
      status: "Success",
      token,
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    // Fetch user data based on input email
    const user = await User.findOne({ email }).select("password");

    // check if password is correct
    const isPasswordCorrect = await user?.isPasswordCorrect(password);

    // if password incorrect, throw error
    if (!isPasswordCorrect)
      throw new AppError("Incorrect email or password", 401);

    // sign and send token with user data
    const token = signCookieToken(user._id, res);
    res.status(200).json({
      status: "Success",
      token,
      message: "Logged in successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  try {
    // Extract jwt from cookies
    const token = req.cookies?.jwt;

    // Blacklist the token
    await BlacklistedToken.create({ token });

    // Clear cookies
    const clearCookieOptions = {
      httpOnly: true,
    };
    if (process.env.NODE_ENV === "production") clearCookieOptions.secure = true;

    res.clearCookie("jwt", clearCookieOptions);

    res.status(200).json({
      status: "Success",
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    // Fetch user data via email input
    const user = await User.findOne({ email: req.body.email }).select("email");
    // If no user associated with email, throw error
    if (!user)
      throw new AppError("There's no user associated with this email", 404);

    // Generate random reset token
    const resetToken = await user.createPasswordResetToken();

    // configure email options
    const protocol = req.protocol;
    const host = req.get("host");
    const resetUrl = `${protocol}://${host}/resetPassword/${resetToken}`;
    const emailOptions = {
      recipient: req.body.email,
      subject: "ExpressBuy: Password reset link (valid for 10 mins)",
      message: `You requested a password reset. Click the link to proceed resetting your password ${resetUrl}. If you didn't forget your password, please ignore this email.`,
    };

    try {
      // Send email with resetUrl
      await sendEmail(emailOptions);
      res.status(200).json({
        status: "Success",
        message: "Password reset link sent to your email!",
      });
      // eslint-disable-next-line no-unused-vars
    } catch (err) {
      // Clear reset token and expiration from db if there was an error sending the email
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user.save({ validateBeforeSave: false });

      throw new AppError(
        "There was an error sending the email. Try again later!"
      );
    }
  } catch (err) {
    next(err);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    // Hash reset token
    const hashedToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    // get user based on hashed token and check if the token isn't expired yet
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user)
      throw new AppError("Password reset token is invalid or has expired", 400);

    // set password, clear data about reset token
    user.password = req.body.newPassword;
    user.passwordConfirm = req.body.newPasswordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: true });

    // update password changedAt (using middleware bcos it wil lalso be needed later for updating logged in users' password)

    // Automatically log in user
    const token = signCookieToken(user._id, res);
    // send OK response
    res.status(200).json({
      status: "Success",
      token,
      message: "Password reset successfully! You are now logged in.",
    });
  } catch (err) {
    next(err);
  }
};
