import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    // Reference to the conversation/thread
    threadId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },

    // Sender information
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Recipient information (could be multiple for group chats)
    recipient: {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      read: {
        type: Boolean,
        default: false,
      },
      readAt: Date,
    },

    // Message content
    content: {
      text: String,
      attachments: [
        {
          url: String,
          type: {
            type: String,
            enum: ["image", "video", "document", "audio", "other"],
          },
          name: String,
          size: Number,
        },
      ],
    },

    // Message metadata
    type: {
      type: String,
      enum: ["text", "media", "system", "contract", "payment"],
      default: "text",
    },

    // Status flags
    status: {
      type: String,
      enum: ["sent", "delivered", "read", "failed"],
      default: "sent",
    },

    // Timestamps
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,

    // For system messages
    systemEvent: String,

    // Soft delete
    deletedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        deletedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for faster queries
messageSchema.index({ threadId: 1, createdAt: -1 });
messageSchema.index({ sender: 1, createdAt: -1 });
messageSchema.index({ "recipient.user": 1, createdAt: -1 });

const Message =
  mongoose.models.Message || mongoose.model("Message", messageSchema);

export default Message;
