import { NextResponse } from "next/server";
import connectDB from "@/config/database"; // Adjust path to your DB connection function
import AuthUtils from "@/lib/authUtils";
import Notification from "@/models/Notification"; // Adjust path to your Notification model;

/**
 * POST /api/notifications/read-all
 * Marks all unread notifications for the currently logged-in user as read.
 */
export async function POST(request) {
  try {
    await connectDB();

    // 1. Authenticate the user to get their ID
    const { userInfo } = await AuthUtils.validateRequest(request);
    const { id: userId } = userInfo || {};

    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // 2. Perform the database update
    // updateMany is an efficient way to update multiple documents at once.
    // - The first argument is the filter: find all notifications for this user that are not read.
    // - The second argument is the update: set the isRead field to true.
    const result = await Notification.updateMany(
      {
        user: userId,
        read: false,
      },
      {
        $set: { read: true },
      }
    );

    // 3. Respond with a success message
    // The 'result' object contains details like 'modifiedCount'.
    return NextResponse.json(
      {
        message: "All notifications marked as read.",
        modifiedCount: result.modifiedCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error marking notifications as read:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
