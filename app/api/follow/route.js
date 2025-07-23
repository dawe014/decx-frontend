import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Notification from "@/models/Notification";
import User from "@/models/User";
import AuthUtils from "@/lib/authUtils";

export async function POST(req) {
  await dbConnect();

  const { userInfo } = await AuthUtils.validateRequest(req);
  const followerId = userInfo?.id;

  if (!followerId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { followedUserId } = await req.json();

    // Validate input
    if (!followedUserId) {
      return NextResponse.json(
        { message: "Missing followedUserId" },
        { status: 400 }
      );
    }

    // Optionally update follower/following relationship in the User model
    const follower = await User.findById(followerId).select("name").lean();
    if (!follower) {
      return NextResponse.json(
        { message: "Follower not found" },
        { status: 404 }
      );
    }

    // Save the notification
    const newNotification = new Notification({
      user: followedUserId,
      message: `${follower.name} started following you.`,
      href: `/profile/${followerId}`,
    });
    await newNotification.save();

    // Trigger real-time event to WebSocket server
    const websocketServerUrl =
      process.env.WEBSOCKET_SERVER_URL || "http://localhost:8080";
    const secret = process.env.INTERNAL_API_SECRET;

    const response = await fetch(`${websocketServerUrl}/api/internal/emit`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-internal-secret": secret,
      },
      body: JSON.stringify({
        userId: followedUserId,
        type: "new_notification",
        payload: newNotification.toObject(),
      }),
    });

    if (!response.ok) {
      console.error("WebSocket emit failed", await response.text());
    }

    return NextResponse.json(
      { message: "Followed and notified successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in follow API:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
