import mongoose from "mongoose";

const brandSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    companyName: {
      type: String,
      required: true,
      unique: true,
    },
    logo: String,
    industry: {
      type: String,
      enum: [
        "fashion",
        "beauty",
        "tech",
        "food",
        "health",
        "finance",
        "education",
        "entertainment",
        "other",
      ],
    },
    website: String,
    companySize: {
      type: String,
      enum: ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"],
    },
    description: String,
    contactPerson: {
      name: String,
      position: String,
      phone: String,
    },

    subscription: {
      planId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Plan",
      },
      startedAt: {
        type: Date,
        default: Date.now,
      },
      expiresAt: Date,
      status: {
        type: String,
        enum: ["active", "expired", "canceled"],
        default: "active",
      },
    },
    campaigns: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
      },
    ],
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Brand = mongoose.models.Brand || mongoose.model("Brand", brandSchema);
export default Brand;
