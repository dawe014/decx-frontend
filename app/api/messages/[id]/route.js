import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Message from "@/models/Message";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

// PATCH /api/messages/:id → Update message
export async function PATCH(req, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const { text } = await req.json();

    const token = req.headers.get("authorization");
    const { userId } = getUserIdFromToken(token);
    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.sender.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    message.content.text = text;
    message.updatedAt = new Date();
    await message.save();

    return NextResponse.json({ message: "Message updated", data: message });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// DELETE /api/messages/:id → Soft delete
export async function DELETE(req, { params }) {
  try {
    await connectDB();
    const { id } = await params;
    const token = req.headers.get("authorization");
    const { userId } = getUserIdFromToken(token);
    const message = await Message.findById(id);
    if (!message) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    if (message.sender.toString() !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const alreadyDeleted = message.deletedBy.find(
      (entry) => entry.user.toString() === userId
    );

    if (!alreadyDeleted) {
      message.deletedBy.push({ user: userId, deletedAt: new Date() });
      await message.save();
    }

    return NextResponse.json({ message: "Message deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
