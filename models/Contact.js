import { Schema, model, models } from "mongoose";

const ContactSchema = new Schema(
  {
    firstName: {
      type: String,
      required: [true, "First name is required."],
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      match: [/.+\@.+\..+/, "Please fill a valid email address"],
    },
    phone: {
      type: String,
    },
    subject: {
      type: String,
      required: [true, "Subject is required."],
      enum: [
        "General Inquiry",
        "Partnership Opportunity",
        "Technical Support",
        "Feedback",
        "Other",
      ],
    },
    message: {
      type: String,
      required: [true, "Message is required."],
    },
    status: {
      type: String,
      enum: ["new", "read", "archived"],
      default: "new",
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

const Contact = models.Contact || model("Contact", ContactSchema);

export default Contact;
