import mongoose from "mongoose";

const influencerSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    bio: String,
    profilePhoto: String,
    location: {
      country: String,
      city: String,
      timezone: String,
    },
    languages: [
      {
        language: String,
        proficiency: {
          type: String,
          enum: ["basic", "conversational", "fluent", "native"],
        },
      },
    ],
    niches: [
      {
        type: String,
        enum: [
          "fashion",
          "beauty",
          "fitness",
          "food",
          "travel",
          "tech",
          "gaming",
          "lifestyle",
          "business",
          "education",
        ],
      },
    ],
    socialMedia: [
      {
        platform: {
          type: String,
          enum: [
            "Instagram",
            "Youtube",
            "Tiktok",
            "Twitter",
            "Facebook",
            "Linkedin",
          ],
        },
        handle: String,
        followers: Number,
        engagementRate: Number,
        link: String,
      },
    ],
    portfolio: [
      {
        title: String,
        description: String,
        mediaUrl: String,
        mediaType: {
          type: String,
          enum: ["image", "video", "link"],
        },
        date: Date,
      },
    ],
    rates: {
      postRate: Number,
      storyRate: Number,
      videoRate: Number,
      collaborationRate: Number,
    },
    availability: {
      type: String,
      enum: ["available", "limited", "unavailable"],
      default: "available",
    },
    services: [
      {
        name: {
          type: String,
          required: true,
        },
        fee: {
          type: Number,
          required: true,
        },
      },
    ],
    languages: [
      {
        name: {
          type: String,
          required: true,
        },
        level: {
          type: String,
          required: true,
        },
      },
    ],
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
      },
    },
    badges: [String],
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Get the existing User model if it exists

const Influencer =
  mongoose.models.Influencer || mongoose.model("Influencer", influencerSchema);
export default Influencer;
