import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import AuthUtils from "@/lib/authUtils";

// Import your Mongoose models
import Notification from "@/models/Notification"; // Adjust path
import Message from "@/models/Message"; // Adjust path

/**
 * GET /api/user-state
 * Fetches the initial real-time state for the currently logged-in user.
 * This includes unread notifications and the count of unread messages.
 */
export async function GET(request) {
  try {
    await connectDB();

    // 1. Authenticate the user
    const { userInfo } = await AuthUtils.validateRequest(request);
    const { id: userId } = userInfo || {};

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Perform database queries in parallel for better performance
    const [notifications, unreadMessageCount] = await Promise.all([
      // Query 1: Get the latest 20 unread notifications for the user
      Notification.find({ user: userId, read: false })
        .sort({ createdAt: -1 }) // Show newest first
        .limit(20) // Prevent sending thousands of notifications at once
        .lean(), // Use .lean() for faster, plain JS objects

      // Query 2: Count unread messages where the user is the recipient
      Message.countDocuments({
        "recipient.user": userId,
        "recipient.read": false,
      }),
    ]);

    // 3. Return the combined state
    return NextResponse.json(
      {
        notifications,
        unreadMessageCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching user state:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
