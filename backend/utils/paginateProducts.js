const Product = require("../models/productModel");

module.exports = async (reqQuery, filter) => {
  const totalFilteredProducts = await Product.countDocuments(filter);

  const page = Number(reqQuery.page || 1);
  const limit = Number(process.env.PRODUCT_PER_PAGE);
  const skip = (page - 1) * limit;
  const totalPages = Math.ceil(totalFilteredProducts / limit);

  return { page, totalPages, skip, limit, totalFilteredProducts };
};
