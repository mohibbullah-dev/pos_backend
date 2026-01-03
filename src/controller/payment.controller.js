import { Order } from "../model/order.model.js";
import { Payment } from "../model/payment.model.js";
import { RestaurantPaymentConfig } from "../model/restaurantPaymentConfig.model.js";
import { apiError } from "../utils/apiError.js";
import asyncHandler from "../utils/asyncHandler.js";
import { remaingDue } from "../utils/payment/srtirperemaningDeu.js";
import Stripe from "stripe";

const createChekOut = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { channel, amount: requestedAmount, idempotencyKey } = req.body;

  if (!["COUNTER", "QR"].includes(channel))
    throw new apiError(400, "invalid channel");
  if (!requestedAmount) throw new apiError(400, "Amount required");
  if (!idempotencyKey) throw new apiError(400, "idempontecyKey is required");
  const restaurantId = req.restaurantId;
  if (!restaurantId)
    throw new apiError(400, "restaurantId missing in token user");

  const order = await Order.findOne({ _id: orderId, restaurantId });
  if (!order) throw new apiError(404, "Order not found for this restaurant");
  const deu = remaingDue(order);
  if (deu <= 0) throw new apiError(400, "Invalid amount");
  const amount = Math.min(Number(requestedAmount || deu), deu);
  if (amount <= 0) throw new apiError(400, "Invalid amount");

  // 4) Idempotency (double click protect)
  const exists = await Payment.findOne({ idempotencyKey });
  if (exists) {
    return res.json({
      paymentId: exists._id,
      clientSecret: exists.clientSecret,
      amount: exists.amount,
      currency: exists.currency,
      payUrl: `${process.env.PUBLIC_APP_URL}/pay/${exists._id}`,
    });
  }

  const cfg = await RestaurantPaymentConfig.findOne({ restaurantId }).lean();
  if (!cfg) throw new apiError(404, "Restaurant payment config missing");
  const stripe = new Stripe(cfg?.stripeSecretKey);

  const payment = await Payment.create({
    restaurantId,
    orderId,
    channel,
    amount,
    currency: cfg?.defaultCurrency || "usd",
    idempotencyKey,
    status: "INITIATED",
  });

  const pi = await stripe.paymentIntents.create({
    amount: payment.amount,
    currency: payment.currency,
    automatic_payment_methods: { enabled: true },
    // metadata

    metadata: {
      restaurantId: String(restaurantId),
      orderId: String(orderId),
      paymentId: String(payment?._id),
      channel,
    },
  });
  payment.providerRef = pi?.id;
  payment.clientSecret = pi?.client_secret;
  payment.status = "REQUIRES_ACTION";
  await payment.save();

  const payUrl = `${process.env.PUBLIC_APP_URL}/pay/${exists._id}`;
  res.json({
    paymentId: payment._id,
    orderId,
    clientSecret: payment.clientSecret,
    amount: payment.amount,
    currency: payment.currency,
    payUrl,
  });
});

//   getPaymentPublic start here
const getPaymentPublic = asyncHandler(async (req, res) => {
  const { paymentId } = req?.params;
  const payment = await Payment.findById(paymentId).lean();
  if (!payment) throw new apiError(404, "payment is not found");
  return res.json({
    _id: payment?._id,
    amount: payment?.amount,
    currency: payment?.currency,
    status: payment?.status,
    clientSecret: payment?.clientSecret,
  });
});

export { createChekOut, getPaymentPublic };
