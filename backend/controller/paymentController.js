const catchAsyncErrors = require("../middlewares/catchAsyncErrors");

const getStripeSecretKey = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;

  if (!secretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }

  if (!String(secretKey).startsWith("sk_")) {
    throw new Error(
      "Invalid STRIPE_SECRET_KEY. It must be a Stripe secret key that starts with sk_."
    );
  }

  return secretKey;
};

const getStripePublishableKey = () => {
  const publishableKey =
    process.env.STRIPE_PUBLISHABLE_KEY || process.env.STRIPE_API_KEY;

  if (!publishableKey) {
    throw new Error(
      "STRIPE_PUBLISHABLE_KEY is not configured. (Fallback STRIPE_API_KEY is also missing.)"
    );
  }

  if (!String(publishableKey).startsWith("pk_")) {
    throw new Error(
      "Invalid Stripe publishable key. Use a key that starts with pk_."
    );
  }

  return publishableKey;
};

const getStripeClient = () => {
  return require("stripe")(getStripeSecretKey());
};

//Process stripe payments => /api/v1/payment/process
exports.processPayment = catchAsyncErrors(async (req, res, next) => {
  const stripe = getStripeClient();
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount,
    currency: "usd",
    metadata: { integration_check: "accept_a_payment" },
  });

  res.status(200).json({
    success: true,
    client_secret: paymentIntent.client_secret,
  });
});

//Send API key => /api/v1/apikey
exports.sendApiKey = catchAsyncErrors(async (req, res, next) => {
  res.status(200).json({
    apiKey: getStripePublishableKey(),
  });
});
