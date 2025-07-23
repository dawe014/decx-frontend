import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Thread from "@/models/Thread";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

export async function POST(req) {
  await connectDB();
  try {
    const { recipientId, title } = await req.json();

    const token = req.headers.get("authorization");
    const { userId } = getUserIdFromToken(token);
    // Validate input
    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required." },
        { status: 401 }
      );
    }
    if (!recipientId) {
      return NextResponse.json(
        { message: "Recipient is required." },
        { status: 400 }
      );
    }
    const userIds = [recipientId, userId];

    // Check for existing thread
    const existing = await Thread.findOne({
      participants: { $all: userIds, $size: userIds.length },
    });

    if (existing)
      return NextResponse.json(
        { message: "Thread already exists." },
        { status: 409 }
      );

    const newThread = new Thread({
      participants: userIds,
      title,
    });

    await newThread.save();
    return NextResponse.json(
      { message: "Thread created successfully.", thread: newThread },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const threads = await Thread.find().populate("participants");
    return NextResponse.json({ success: true, threads });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
