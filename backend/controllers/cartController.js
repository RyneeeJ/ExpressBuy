const Cart = require("../models/cartModel");
// const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const checkCartAndProduct = require("../utils/cart");

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
    let { cart, variant, existingItem } = await checkCartAndProduct(
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

exports.removeFromCart = async (req, res, next) => {
  const userId = req.user._id.toString();
  const { productId } = req.params;
  const { variantId } = req.body;
  try {
    // Check cart and product/variant
    const { cart, existingItem } = await checkCartAndProduct(
      userId,
      productId,
      variantId
    );

    if (!cart) throw new AppError("Cart not found", 404);
    if (!existingItem) throw new AppError("Item not found in cart", 404);

    // remove item from cart
    cart.items.pull({ product: productId, variant: variantId });
    await cart.save();

    res.status(204).json({
      status: "Success",
    });
  } catch (err) {
    next(err);
  }
};
