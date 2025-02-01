const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  color: String,
  size: String,
  variantImage: String,
  stock: {
    type: Number,
    min: 0,
    required: [true, "Products must have number of stocks"],
  },
  price: {
    type: String,
    required: [true, "Please provide a price for your product/s"],
  },
  SKU: {
    type: String,
    required: [true, "Each product variant must have a unique SKU"],
    unique: true,
  },
});

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
    },
    primaryImage: {
      type: String,
      required: [true, "Please provide product image"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    variants: {
      type: [variantSchema],
      required: [true, "A product must have at least one variant"],
      validate: {
        validator(variants) {
          return variants.length > 0;
        },
        message: "At least one variant is required",
      },
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
  },
  { timestamps: true }
);

// Implement possible variants of the same product
// * Products could or could not have variants
// * Variants of the same products could have the same or different prices
// * Products with only one variant/type have only one price and one 'stock'
// * Products with multiple variants have different number of stocks

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
