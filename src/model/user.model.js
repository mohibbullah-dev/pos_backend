import { Schema, mongoose } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_EXPIRES_IN,
  ACCESS_TOKEN_SECRET,
  JWT_TOKEN_EXPIRES_IN,
  JWT_TOKEN_SECRET,
  REFRESH_TOKEN_EXPIRES_IN,
  REFRESH_TOKNE_SECRET,
} from "../constant.js";
const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      validate: (v) => {
        return /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/.test(v);
      },
      message: "Please enter valid email",
    },
    avatar: {
      url: {
        type: String,
        required: [true, "avater url is required"],
      },
      public_id: {
        type: String,
        required: [true, "public_id is required"],
      },
    },
    phone: {
      type: Number,
      required: [true, "Phone is required"],
      validate: {
        validator: (v) => {
          return /\+?[1-9]\d{6,14}$/.test(v);
        },
        message: "Please enter a valid phone number",
      },
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    role: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.pre("save", async function () {
  if (!this.isModified("password") || !this.password) return;
  this.password = await bcrypt.hash(this.password, 10);
});

export const User = mongoose.model("User", userSchema);
