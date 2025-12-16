import mongoose, { Schema } from "mongoose";

const orderSchema = new Schema(
  {
    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      guests: { type: Number, required: true },
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    orderStatus: {
      type: String,
      required: true,
    },
    orderDate: {
      type: Date,
      default: Date.now(),
    },
    bills: {
      total: { type: Number, required: true },
      tax: { type: Number, required: true },
      totalWithTax: { type: Number, required: true },
    },
    items: {
      type: Array,
      require: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "at least one item is required",
      },
    },
  },

  { timestamps: true }
);

export const Order = mongoose.model("Order", orderSchema);
