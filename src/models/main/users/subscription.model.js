import mongoose, { Schema } from "mongoose";


const subscriptionTypeSchema = new Schema(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    planTier: {
      type: String,
      enum: ["FREE", "PREMIUM", "ENTERPRISE"],
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    // Duration of the plan in days
    durationInDays: {
      type: Number,
      enum: [30, 60, 90, 180, 365],
      required: true,
    },
    // List of features or permissions granted by this plan
    features: {
      type: [String],
      required: true,
    },
    // Maximum number of branches allowed under this plan
    maxBranches: {
        type: Number,
        required: true,
    },
    // Maximum number of staff members allowed
    maxStaff: {
        type: Number,
        required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Subscriptions = mongoose.model("Subscriptions", subscriptionTypeSchema);
