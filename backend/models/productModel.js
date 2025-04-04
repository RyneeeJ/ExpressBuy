const mongoose = require("mongoose");

const variantSchema = new mongoose.Schema({
  description: {
    type: String,
    required: [true, "Please provide a specific description of this variant"],
  },
  variantImage: String,
  stock: {
    type: Number,
    min: 0,
    required: [true, "Products must have number of stocks"],
  },
  price: Number,
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
    price: {
      type: Number,
      required: [true, "Please enter product price"],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: async function (val) {
          if (!this.price) {
            const doc = await this.model.findOne(this.getFilter());
            if (!doc) return true;
            return val < doc.price;
          }

          return val < this.price;
        },
        message: "Price discount {VALUE} must be less than the original price",
      },
    },
    primaryImage: {
      type: String,
      required: [true, "Please provide product image"],
    },
    description: {
      type: String,
      required: [true, "Please provide product description"],
    },
    category: {
      type: String,
      required: [true, "Each product must belong to a specific category"],
    },
    brand: {
      type: String,
      required: [true, "Please specify the brand of the product"],
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
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: { type: Number, default: 0 },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    isInStock: Boolean,
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  this.isInStock = this.variants.some((variant) => variant.stock > 0);
  next();
});

productSchema.methods.hasOnlyOneVariant = function () {
  return this.variants.length === 1;
};

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
