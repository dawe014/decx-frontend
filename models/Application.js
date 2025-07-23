import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    campaign: { type: mongoose.Schema.Types.ObjectId, ref: "Campaign" },
    influencer: { type: mongoose.Schema.Types.ObjectId, ref: "Influencer" },
    title: String,
    proposal: String,
    quote: Number,
    portfolioLinks: [String],
    status: {
      type: String,
      enum: ["pending", "shortlisted", "rejected", "hired", "completed"],
      default: "pending",
    },
    viewedByBrand: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const Application =
  mongoose.models.Application ||
  mongoose.model("Application", applicationSchema);

export default Application;
