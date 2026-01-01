import { Router } from "express";
import express from "express";
import { RestaurantPaymentConfig } from "../model/restaurantPaymentConfig.model.js";
import { apiError } from "../utils/apiError.js";
import Stripe from "stripe";
import { Payment } from "../model/payment.model.js";
import { Order } from "../model/order.model.js";

const router = Router();

router.post(
  "/stripe/:restaurantId",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const { restaurantId } = req.params;
    const sig = req.headers["stripe-signature"];
    const cfg = await RestaurantPaymentConfig.findOne({ restaurantId }).lean();
    if (!cfg) throw new apiError(400, "Unknown restaurant");
    const stripe = await new Stripe(cfg.stripeSecretKey);
    let event;
    // 2) Verify signature
    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        cfg.webhookStripeSecretKey
      );
    } catch (error) {
      return res.status(400).send(`Webhook verify failed: ${err.message}`);
    }

    // handle events
    try {
      if (
        event.type === "payment_intent.succeeded" ||
        event.type === "payment_intent.payment_failed"
      ) {
        const pi = event.data.object;
        const paymentId = pi?.metadata?.paymentId;
        const payment = await Payment.findOne({ _id: paymentId, restaurantId });
        if (!payment) return res.json({ received: true });
        // ✅ Ignore duplicate events
        if (!payment?.processedEventIds?.includes(event.id))
          return res.json({ received: true });
        payment.processedEventIds.push(event?.id);

        if (event?.type === "payment_intent.succeeded") {
          payment.status = "SUCCEEDED";
          payment.providerRef = pi?.id;
          await payment.save();
          // Update Order paidTotal (partial accumulate)
          const order = await Order.findOne({
            _id: payment.orderId,
            restaurantId,
          });
          if (order) {
            order.paidTotal =
              Number(order.paidTotal || 0) + Number(order.paidTotal || 0);
            const deu = Math.max(
              0,
              Number(order.bills.totalWithTax || 0) -
                Number(order.paidTotal || 0)
            );
            if (deu === 0) order.paymentStatus = "PAID";
            else order.paymentStatus = "PENDING";
            await order.save();
          } else {
            payment.status = "FAILD";
            await payment.save();
          }
        }
      }
      res.json({ received: true });
    } catch (error) {
      res.status(500).send(e.message);
    }
  }
);

export default router;
