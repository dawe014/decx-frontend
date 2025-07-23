import mongoose from "mongoose";

const PlanSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: true,
      required: true,
    },
    price: String,
    description: String,
    features: [String],
    recommended: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

export default mongoose.models.Plan || mongoose.model("Plan", PlanSchema);
