import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Message from "@/models/Message";

export async function GET(req, { params }) {
  await connectDB();
  try {
    const { id: threadId } = await params;
    const messages = await Message.find({ threadId })
      .sort({ createdAt: 1 })
      .populate("sender"); // Add fields you want to show

    return NextResponse.json({ success: true, messages }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
