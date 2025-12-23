import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
  name: {
    type: String,
    required: {
      type: String,
      required: [true, "dish is required"],
    },
    price: {
      type: Number,
      require: [true, "price is required"],
    },
    category: {
      type: String,
      required: [true, "category is required"],
    },
  },
});
const menuSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    icon: { type: String },
    color: { type: String },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    dishes: [itemSchema],
  },
  { timestamps: true }
);

export const Menu = mongoose.model("Menu", menuSchema);
