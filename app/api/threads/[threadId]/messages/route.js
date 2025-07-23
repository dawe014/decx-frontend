import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Thread from "@/models/Thread";
import Message from "@/models/Message";
import Notification from "@/models/Notification";
import { Types } from "mongoose";
import AuthUtils from "@/lib/authUtils"; // Utility to get user info from request

export async function GET(req, { params }) {
  await dbConnect();
  const { threadId } = await params; // Destructure threadId from params
  const { userInfo } = await AuthUtils.validateRequest(req);
  const { id } = userInfo;
  if (!id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    // Cast threadId to ObjectId
    const objectId = new Types.ObjectId(threadId);

    // Verify user has access to this thread
    const threadExists = await Thread.exists({
      _id: objectId,
      participants: id,
    });

    if (!threadExists) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }
    await Message.updateMany(
      {
        threadId,
        "recipient.user": id,
        "recipient.read": false,
      },
      {
        $set: {
          "recipient.read": true,
          "recipient.readAt": new Date(),
          status: "read",
        },
      }
    );
    const messages = await Message.find({
      threadId: objectId,
    })
      .sort({ createdAt: 1 })
      .populate("sender", "name email image");

    return NextResponse.json(messages);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch messages", details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req, { params }) {
  await dbConnect();
  const { threadId } = await params; // Destructure threadId from params
  const { userInfo } = await AuthUtils.validateRequest(req);
  const { id } = userInfo;
  if (!id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { content, attachments = [], type = "text" } = await req.json();

    const thread = await Thread.findOne({
      _id: threadId,
      participants: id,
    }).populate("participants", "_id name email image");

    if (!thread) {
      return NextResponse.json({ error: "Thread not found" }, { status: 404 });
    }

    const newMessage = new Message({
      threadId: threadId,
      sender: id,
      recipient: {
        user:
          thread.participants.find((p) => p._id.toString() !== id)?._id || null,
        read: false,
      },
      content: {
        text: content,
        attachments: attachments.map((att) => ({
          url: att.url,
          type: att.type,
          name: att.name,
          size: att.size,
        })),
      },
      type,
      status: "sent",
    });

    const savedMessage = await newMessage.save();

    // Populate the sender information before returning
    const populatedMessage = await Message.findById(savedMessage._id)
      .populate("sender", "name email image")
      .exec();

    await Thread.findByIdAndUpdate(threadId, {
      lastMessage: populatedMessage._id,
      updatedAt: new Date(),
    });
    // Create notifications

    const recipients = thread.participants.filter(
      (p) => p._id.toString() !== id
    );
    for (const recipient of recipients) {
      const notification = new Notification({
        user: recipient._id,
        message: `New message from ${id} in conversation`,
        thread: threadId,
        timestamp: new Date(),
      });
      await notification.save();
    }

    return NextResponse.json(populatedMessage, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to send message" },
      { status: 500 }
    );
  }
}
