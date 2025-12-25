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
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      default: null,
      index: true,
    },

    seatNo: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

export const Table = mongoose.model("Table", tableSchema);
