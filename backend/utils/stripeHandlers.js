const AppError = require("./appError");
const createOrder = require("./createOrder");

exports.handlePaymentSuccess = async (paymentIntent) => {
  const { userId, cartId, shippingAddress } = paymentIntent.metadata;

  if (!userId || !cartId)
    throw new AppError("Missing userId or cartId in payment metadata", 400);

  const placedOrder = await createOrder({
    userId,
    cartId,
    paymentIntent,
    shippingAddress,
  });

  return placedOrder;
};
