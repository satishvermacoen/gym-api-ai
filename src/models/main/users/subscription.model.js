import mongoose, { Schema } from "mongoose";

/**
 * Defines the available subscription plans (e.g., Bronze, Silver, Gold).
 * This model acts as a template for what users can subscribe to.
 */
const subscriptionSchema = new Schema(
  {
    planName: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    planTier: {
      type: String,
      enum: ["FREE", "PRO", "PREMIUM", "ENTERPRISE"],
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

export const subscription = mongoose.model("Subscription", subscriptionSchema);
