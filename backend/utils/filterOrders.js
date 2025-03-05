const mongoose = require("mongoose");
const User = require("../models/userModel");
const AppError = require("./appError");

const filterOrders = async ({ reqQuery, reqUser }) => {
  const {
    search,
    status,
    startDate: startDateStr,
    endDate: endDateStr,
  } = reqQuery;
  // FILTER
  const queryFilter = {};

  if (reqUser.role === "customer") {
    queryFilter.user = reqUser._id;
  }

  // by search (email or orderId)
  if (search) {
    // If the search term is a valid ObjectId, assume it's an order ID
    if (mongoose.Types.ObjectId.isValid(search)) {
      queryFilter._id = search;
    } else if (reqUser.role === "admin") {
      // If it's not an ObjectId, check if it's an email (admins only)
      const user = await User.findOne({ email: search }).select("_id");
      if (user) {
        queryFilter.user = user._id;
      } else throw new AppError("No user found with this email", 404);
    } else
      throw new AppError("Customers can only search orders by their order id");
  }

  // by status
  status &&
    (queryFilter.status =
      status.at(0).toUpperCase() + status.slice(1).toLowerCase());

  // by date range
  if (startDateStr || endDateStr) {
    queryFilter.createdAt = {};

    const startDate = new Date(startDateStr);
    const endDate = new Date(endDateStr);

    startDateStr && (queryFilter.createdAt.$gte = startDate);
    endDateStr && (queryFilter.createdAt.$lte = endDate);
  }

  return queryFilter;
};

module.exports = filterOrders;
