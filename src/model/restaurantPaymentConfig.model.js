import mongoose, { Schema } from "mongoose";

const schema = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      index: true,
      unique: true,
    },
    provider: {
      type: String,
      enum: ["Stripe"],
      default: "String",
    },
    stripeSecretKey: {
      type: String,
      required: true,
    },
    webhookStrimeSecretKey: {
      type: String,
      required: true,
    },
    defaultCurrency: {
      type: String,
      default: "usd",
    },
  },
  { timestamps: true }
);

export const RestaurantPaymentConfig = mongoose.model(
  "RestaurantPaymentConfig",
  schema
);
