import mongoose, { Schema } from "mongoose";

const refreshSessionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
    tokeHash: {
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
    replaceByTokenHash: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export const RefreshSession = mongoose.model("RefreshSession", RefreshSession);
