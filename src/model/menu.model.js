import mongoose, { Schema } from "mongoose";

const itemSchema = new Schema({
  name: {
    type: String,
    required: [true, "dish is required"],
    trim: true,
    unique: true,
  },
  price: {
    type: Number,
    required: [true, "price is required"],
  },
  category: {
    type: String,
    required: [true, "category is required"],
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
      required: [true, "Creator is required"],
    },
    dishes: {
      type: [itemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "at least one item is required",
      },
    },
  },
  { timestamps: true }
);

export const Menu = mongoose.model("Menu", menuSchema);
