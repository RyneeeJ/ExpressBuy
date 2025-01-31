const jwt = require("jsonwebtoken");

const AppError = require("../utils/appError");
const User = require("../models/userModel");

const signCookieToken = (id, res) => {
  const token = jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  const cookieOptions = {
    expies: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") cookieOptions.secure = true;

  res.cookie("jwt", token, cookieOptions);

  return token;
};

exports.protectRoute = function ({ isSigningUp = false }) {
  return async (req, res, next) => {
    try {
      // retrieve jwt from cookie or auth headers
      const token =
        req.cookies?.jwt || req.headers.authorization?.replace("Bearer ", "");

      if (isSigningUp && !token) return next();

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

exports.logout = (req, res, next) => {
  try {
    res.status(200).json({
      status: "Success",
      message: "Logged out successfully",
    });
  } catch (err) {
    next(err);
  }
};
