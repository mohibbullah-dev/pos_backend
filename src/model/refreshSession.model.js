import mongoose, { Schema } from "mongoose";

const refreshSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    tokenHash: {
      type: String,
      required: true,
      index: true,
    },
    jti: {
      type: String,
      index: true,
    },
    userAgent: {
      type: String,
    },
    ip: { type: String },
    expiredAt: {
      type: Date,
      required: [true, "expiredAt is required"],
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    currentStatus: {
      type: String,
      required: true,
      enum: ["logedIn", "logedOut"],
      default: "logedIn",
    },
  },
  { timestamps: true }
);

export const RefreshSession = mongoose.model(
  "RefreshSession",
  refreshSessionSchema
);
