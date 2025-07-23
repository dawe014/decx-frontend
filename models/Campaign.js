import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema(
  {
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    niches: [String],
    targetLocations: [String],
    targetLanguages: [String],
    budget: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: "ETB",
      },
    },
    startDate: Date,
    endDate: Date,
    deliverables: [
      {
        type: {
          type: String,
          enum: ["post", "story", "video", "mention", "review", "other"],
        },
        description: String,
        quantity: Number,
      },
    ],
    contentRequirements: String,
    platforms: [String],
    influencerCriteria: {
      minFollowers: Number,
      minEngagementRate: Number,
      gender: {
        type: String,
        enum: ["male", "female", "any"],
      },
      ageRange: {
        min: Number,
        max: Number,
      },
    },
    status: {
      type: String,
      enum: ["draft", "active", "paused", "completed", "canceled"],
      default: "draft",
    },
    applications: [
      {
        application: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Application",
        },
      },
    ],
    hiredInfluencers: [
      {
        influencer: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Influencer",
        },
        contract: {
          terms: String,
          paymentAmount: Number,
          paymentStatus: {
            type: String,
            enum: ["pending", "partial", "completed"],
          },
        },
        deliverablesStatus: [
          {
            deliverable: String,
            status: {
              type: String,
              enum: ["pending", "submitted", "approved", "rejected", "revised"],
            },
            submittedAt: Date,
            contentUrl: String,
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Campaign =
  mongoose.models.Campaign || mongoose.model("Campaign", campaignSchema);
export default Campaign;
