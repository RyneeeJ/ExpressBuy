const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const filterProducts = require("../utils/filterProducts");
const paginateProducts = require("../utils/paginateProducts");

exports.getProducts = async (req, res, next) => {
  try {
    // FILTER
    const filter = filterProducts(req.query);
    let query = Product.find(filter);
    // SORT
    if (req.query.sort) query = query.sort(req.query.sort);
    // PAGINATE
    const { page, limit, skip, totalPages, totalFilteredProducts } =
      await paginateProducts(req.query, filter);

    if (page < 1 || isNaN(page))
      throw new AppError("Page number must be a positive whole number", 400);

    if (page > totalPages)
      return res.status(200).json({
        status: "Success",
        results: 0,
        data: {
          products: [],
        },
        pagination: {
          totalPages,
          currentPage: page,
          totalResults: totalFilteredProducts,
        },
      });

    query = query.skip(skip).limit(limit);
    // Fetch query
    const products = await query;

    res.status(200).json({
      status: "Success",
      results: products.length,
      data: {
        products,
      },
    });
  } catch (err) {
    next(err);
  }
};
