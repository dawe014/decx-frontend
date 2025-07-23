import mongoose from "mongoose";

const SubscriptionHistorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    oldPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    newPlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    action: {
      type: String,
      enum: ["initial", "upgrade", "downgrade", "cancel"],
      required: true,
    },
    changedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.SubscriptionHistory ||
  mongoose.model("SubscriptionHistory", SubscriptionHistorySchema);
