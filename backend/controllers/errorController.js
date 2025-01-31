const AppError = require("../utils/appError");

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: "Something went wrong in the server",
    });
  }
};
const handleDuplicateFieldsErrorDB = (error) => {
  const duplicateArr = Object.entries(error.keyValue).at(0);
  return new AppError(
    `Duplicate ${duplicateArr.at(
      0
    )} detected in the database: ${duplicateArr.at(1)}`,
    400
  );
};

const handleValidationErrorDB = (error) => {
  const errors = Object.values(error.errors)
    .map((el) => el.message)
    .join(". ");

  const message = `Invalid input data: ${errors}`;
  return new AppError(message, 400);
};

const handleExpiredJWTError = () =>
  new AppError(
    "Your authorization token was already expired. Please login again.",
    401
  );

const handleInvalidJWTError = () =>
  new AppError("Invalid authorization token. Please login again.", 401);

// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  err.message = err.message || "Server error";
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 500;

  let error = {
    ...err,
    name: err.name,
    message: err.message,
    stack: err.stack,
  };

  if (err.code === 11000) error = handleDuplicateFieldsErrorDB(error);
  if (err.name === "ValidationError") error = handleValidationErrorDB(error);
  if (err.name === "TokenExpiredError") error = handleExpiredJWTError();
  if (err.name === "JsonWebTokenError") error = handleInvalidJWTError();

  if (process.env.NODE_ENV === "development") sendErrorDev(error, res);
  else if (process.env.NODE_ENV === "production") sendErrorProd(error, res);
};
