const Cart = require("../models/cartModel");
// const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const getCartAndProduct = require("../utils/cart");

exports.getCartItems = async (req, res, next) => {
  try {
    //
  } catch (err) {
    next(err);
  }
};

exports.addToCart = async (req, res, next) => {
  const userId = req.user._id.toString();
  const { productId } = req.params;
  const { variantId, quantity } = req.body;
  try {
    let { cart, variant } = await getCartAndProduct(
      userId,
      productId,
      variantId
    );
    if (!cart) cart = await Cart.create({ user: userId, items: [] });

    if (quantity > variant.stock)
      throw new AppError(`Only ${variant.stock} left for this item`, 400);

    const newItem = {
      product: productId,
      variant: variantId,
      quantity: quantity || 1,
    };
    // check if item is already in the cart
    const existingItem = cart.items.find(
      (item) =>
        item.product.toString() === productId &&
        item.variant.toString() === variantId
    );

    // item already exists, increase quantity
    if (existingItem) existingItem.quantity += quantity || 1;
    else cart.items.push(newItem);

    await cart.save();

    res.status(200).json({
      status: "Success",
      data: {
        item: newItem,
      },
    });
  } catch (err) {
    next(err);
  }
};
