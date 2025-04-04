const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const filterProducts = require("../utils/filterProducts");
const paginateProducts = require("../utils/paginateQuery");

exports.getAllProducts = async (req, res, next) => {
  try {
    // FILTER
    const filter = filterProducts(req.query);
    let query = Product.find(filter);
    // SORT
    if (req.query.sort) query = query.sort(req.query.sort);
    // PAGINATE
    const { page, limit, skip, totalPages, totalFilteredProducts } =
      await paginateProducts({
        reqQuery: req.query,
        filter,
        Model: Product,
        queryLimit: Number(process.env.PRODUCTS_PER_PAGE),
      });

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
    const products = await query.select(
      "primaryImage name price isFeatured isInStock category brand"
    );

    res.status(200).json({
      status: "Success",
      results: products.length,
      data: {
        products,
        category: req.query,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.productId).select(
      "-__v -createdAt -updatedAt"
    );
    res.status(200).json({
      status: "Success",
      data: {
        product,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.getProductCategories = async (req, res, next) => {
  try {
    const categories = await Product.distinct("category");

    const categoriesFinal = categories.map((c) => ({
      label: c,
      path: c.toLowerCase().replaceAll(" ", "-"),
    }));
    res.status(200).json({
      status: "Success",
      data: {
        categories: categoriesFinal,
      },
    });
  } catch (err) {
    next(err);
  }
};
