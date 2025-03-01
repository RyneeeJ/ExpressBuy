const { v4: uuidv4 } = require("uuid");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const AppError = require("./appError");

const refundPayment = async (paymentIntentId) => {
  try {
    await stripe.refunds.create(
      {
        payment_intent: paymentIntentId,
      },
      {
        idempotencyKey: uuidv4(),
      }
    );
    // eslint-disable-next-line no-unused-vars
  } catch (err) {
    throw new AppError("There was an error refunding your payment", 500);
  }
};

module.exports = refundPayment;
