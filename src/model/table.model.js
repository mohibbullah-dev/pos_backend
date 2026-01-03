import mongoose, { Schema } from "mongoose";

const tableSchema = new Schema(
  {
    tableNo: {
      type: Number,
      required: [true, "Table-No is required"],
    },
    tableStatus: {
      type: String,
      enum: ["Available", "Booked"],
      default: "Available",
    },
    restaurantId: {
      type: Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    seatNo: {
      type: Number,
      require: true,
    },
  },
  { timestamps: true }
);

export const Table = mongoose.model("Table", tableSchema);
