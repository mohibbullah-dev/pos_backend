import { Schema, mongoose } from "mongoose";
import bcrypt from "bcrypt";
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

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

export const User = mongoose.model("User", userSchema);
