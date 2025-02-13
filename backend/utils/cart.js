const Cart = require("../models/cartModel");
const Product = require("../models/productModel");
const AppError = require("./appError");

const checkCartAndProduct = async (userId, productId, variantId) => {
  const cartPromise = Cart.findOne({ user: userId }).select("items");
  const productPromise = Product.findById(productId).select("variants");

  let [cart, product] = await Promise.all([cartPromise, productPromise]);

  if (!product) throw new AppError("Product not found", 404);

  // check productVariant
  const variant = product.variants.find((v) => v._id.toString() === variantId);
  if (!variant) throw new AppError("Product variant not found", 404);

  // check if item is already in the cart
  const existingItem = cart.items.find(
    (item) =>
      item.product.toString() === productId &&
      item.variant.toString() === variantId
  );
  return { cart, variant, existingItem };
};

module.exports = checkCartAndProduct;
