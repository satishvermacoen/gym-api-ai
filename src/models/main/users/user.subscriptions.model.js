import mongoose, { Schema } from "mongoose";

/**
 * Represents an instance of a user's subscription to a specific plan.
 * This tracks the active, expired, or cancelled subscriptions for each user.
 */
const userOwnerSubscriptionSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "UserOwner",
      required: true,
      index: true,
    },
    planId: {
      type: Schema.Types.ObjectId,
      ref: "Subscription",
      required: true,
    },
    status: {
      type: String,
      enum: ["ACTIVE", "EXPIRED", "CANCELLED", "UPCOMING", "PENDING_PAYMENT"],
      required: true,
      default: "PENDING_PAYMENT",
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    // Details from the payment gateway
    paymentDetails: {
      transactionId: { type: String, index: true },
      paymentGateway: String, // e.g., 'Stripe', 'Razorpay'
      amountPaid: Number,
      paymentDate: Date,
    },
    
    // planHistory: [
    //   {
    //     planId: {
    //       type: Schema.Types.ObjectId,
    //       ref: "Subscription",
    //       required: true,
    //     },
    //     startDate: {
    //       type: Date,
    //       required: true,
    //     },
    //     endDate: {
    //       type: Date,
    //       required: true,
    //     },
    //   },
    // ],
    // A flag to indicate if the subscription will auto-renew
    autoRenew: {
        type: Boolean,
        default: false,
    }
  },
  {
    timestamps: true,
  }
);

export const UserSubscription = mongoose.model("UserOwnerSubscription", userOwnerSubscriptionSchema);
