const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Product name is required"],
  },
  image: {
    type: String,
    required: [true, "Please provide product image"],
  },
  description: {
    type: String,
    required: [true, "Please provide product description"],
  },
  stocks: {
    type: Number,
    min: 0,
    required: [true, "Please list number of stocks for this product"],
  },
  ratingsAverage: {
    type: Number,
    min: 1,
    max: 5,
    default: 4.5,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
