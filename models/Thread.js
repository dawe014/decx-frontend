import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
  {
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    // Last message reference for previews
    lastMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Message",
    },

    // Metadata
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: Date,

    // Customization
    title: String,
    isGroup: {
      type: Boolean,
      default: false,
    },

    // Notification settings
    mutedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    // Status
    archivedBy: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        archivedAt: Date,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes
threadSchema.index({ participants: 1, updatedAt: -1 });
threadSchema.index({ updatedAt: -1 });

const Thread = mongoose.models.Thread || mongoose.model("Thread", threadSchema);

export default Thread;
