import mongoose, { Schema } from "mongoose";

const restaurantSchema = new Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "name is required"],
    },
    nameKey: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      select: false,
      require: [true, "nameKey is required"],
    },

    contact: {
      email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        lowercase: true,
        validate: {
          validator: (v) =>
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(v),
          message: "Invalid email format",
        },
      },
      phone: {
        type: String,
        trim: true,
      },
    },

    ownerId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "owner is required"],
    },

    restaurantLogo: {
      url: {
        type: String,
        required: [true, "restaurantLogo is required"],
      },
      public_id: {
        type: String,
        required: [true, "public_id is required"],
      },
    },

    address: {
      type: String,
      required: [true, "restaurant address is required"],
      trim: true,
    },

    /* =======================
       ✅ NEW FIELDS
    ======================== */

    // Restaurant active / closed status
    status: {
      type: String,
      enum: ["active", "inactive", "closed"],
      default: "active",
    },

    // Opening & closing time
    openingHours: {
      open: {
        type: String, // e.g. "10:00 AM"
        required: true,
        default: "10:00 AM",
      },
      close: {
        type: String, // e.g. "11:00 PM"
        required: true,
        default: "11:00 PM",
      },
    },

    // Currency for billing
    currency: {
      type: String,
      default: "BDT", // change to INR / USD if needed
      uppercase: true,
      trim: true,
    },

    // Tax / VAT percentage
    taxPercent: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  { timestamps: true }
);

export const Restaurant = mongoose.model("Restaurant", restaurantSchema);
