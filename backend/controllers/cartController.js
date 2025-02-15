const Cart = require("../models/cartModel");
// const Product = require("../models/productModel");
const AppError = require("../utils/appError");
const checkCartAndProduct = require("../utils/cart");

exports.getCartItems = async (req, res, next) => {
  const userId = req.user._id.toString();
  try {
    const cart = await Cart.findOne({ user: userId })
      .populate({
        path: "items.product",
        select: "name variants price",
      })
      .populate({
        path: "user",
        select: "firstName",
      })
      .lean();

    let totalPrice = 0;
    cart.items = cart.items.map((item) => {
      const variant = item.product.variants.find(
        (v) => v._id.toString() === item.variant.toString()
      );

      const price = item.quantity * (item.variant.price || item.product.price);

      if (item.selected) totalPrice += price;
      return { ...item, variant, price };
    });

    cart.totalPrice = totalPrice;
    if (!cart)
      return res.status(200).json({
        user: userId,
        items: [],
      });

    res.status(200).json({
      status: "Success",
      data: {
        cart,
      },
    });
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

exports.removeItemFromCart = async (req, res, next) => {
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

exports.toggleSelectItem = async (req, res, next) => {
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

    existingItem.selected = !existingItem.selected;

    await cart.save();
    res.status(200).json({
      status: "Success",
      data: {
        cart,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.updateQuantity = async (req, res, next) => {
  const userId = req.user._id.toString();
  const { productId } = req.params;
  const { variantId, action } = req.body;
  try {
    const { cart, existingItem, variant } = await checkCartAndProduct(
      userId,
      productId,
      variantId
    );

    if (!cart) throw new AppError("Cart not found", 404);
    if (!existingItem) throw new AppError("Item not found in cart", 404);

    if (action === "increase" && existingItem.quantity === variant.stock)
      throw new AppError("Maximum number of stock limit reached", 400);
    else if (action === "increase" && existingItem.quantity < variant.stock)
      existingItem.quantity++;
    else if (action === "decrease" && existingItem.quantity > 1)
      existingItem.quantity--;
    else if (action === "decrease" && existingItem.quantity === 1) {
      cart.items.pull({ product: productId, variant: variantId });
      // Manually update the cart to be returned because pull doesnt update the cart in memory immediately after saving
      cart.items = cart.items.filter(
        (item) =>
          item.product.toString() !== productId &&
          item.variant.toString() !== variantId
      );
    } else throw new AppError("Invalid action in request body", 400);

    await cart.save();

    res.status(200).json({
      status: "Success",
      cart,
    });
  } catch (err) {
    next(err);
  }
};

exports.clearCart = async (req, res, next) => {
  const userId = req.user._id.toString();

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError("Cart not found", 404);

    cart.items = [];
    await cart.save();

    res.status(200).json({
      status: "Success",
      cart,
    });
  } catch (err) {
    next(err);
  }
};
