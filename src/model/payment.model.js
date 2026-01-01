import mongoose, { Schema } from "mongoose";
const schema = new Schema(
  {
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      index: true,
      unique: true,
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      index: true,
      required: true,
    },
    channel: {
      type: String,
      enum: ["COUNTER", "QR"],
      required: true,
    },
    status: {
      type: String,
      enum: ["INITIATED", "REQUIRES_ACTION", "SUCCEEDED", "FAILD"],
      default: "INITIATED",
      inex: true,
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
    },
    providerRef: {
      type: String,
    },
    clientSecret: {
      type: String,
    },
    processedEventIds: { type: [String], default: [] },
  },

  { timestamps: true }
);

export const Payment = mongoose.model("Payment", schema);
