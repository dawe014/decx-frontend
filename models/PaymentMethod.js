import mongoose from "mongoose";

const PaymentMethodSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    brand: String,
    last4: String,
    exp: String,
    isDefault: Boolean,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.PaymentMethod ||
  mongoose.model("PaymentMethod", PaymentMethodSchema);
