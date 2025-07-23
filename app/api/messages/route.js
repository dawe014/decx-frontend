// POST /api/messages
import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import Thread from "@/models/Thread";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

export async function POST(req) {
  await connectDB();
  try {
    const { threadId, content } = await req.json();
    const token = req.headers.get("authorization");
    const { userId: sender } = getUserIdFromToken(token);
    const thread = await Thread.findById(threadId);
    if (!thread)
      return NextResponse.json(
        { message: "Thread not found" },
        { status: 404 }
      );

    if (!thread.participants.includes(sender)) {
      return NextResponse.json(
        { message: "Sender not in thread" },
        { status: 403 }
      );
    }

    const receiver = thread.participants.find((u) => u.toString() !== sender);

    const message = await Message.create({
      threadId,
      sender,
      recipient: { user: receiver },
      content,
    });

    thread.lastMessage = message._id;
    thread.updatedAt = new Date();
    await thread.save();

    return NextResponse.json(
      { message: "Message sent successfully", message },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
