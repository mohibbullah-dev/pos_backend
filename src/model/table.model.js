import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
  {
    tableNo: {
      type: Number,
      required: true,
      unique: true,
    },
    tableStatus: {
      type: String,
      enum: ["Available", "Booked"],
      default: "Available",
    },
    // currentOrder: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Order",
    // },
    seatNo: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

export const Table = mongoose.model("Table", tableSchema);
