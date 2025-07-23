import mongoose from "mongoose";
/**
 * PaymentInfo model to store user payment information.
 * This model is used to store basic payment details like name and phone number.
 * It is linked to the User model via userId.
 */
const paymentInfoSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true, // One payment info per user
    },
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      default: "",
    },
    phoneNumber: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const PaymentInfo =
  mongoose.models.PaymentInfo ||
  mongoose.model("PaymentInfo", paymentInfoSchema);

export default PaymentInfo;
