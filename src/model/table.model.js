import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
  {
    tableNo: {
      type: Number,
      required: true,
      unique: true,
    },
    status: { type: String, required: true },
    currentOrder: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
  },
  { timestamps: true }
);

export const Table = mongoose.model("Table", tableSchema);
