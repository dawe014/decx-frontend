import dbConnect from "@/config/database";
import User from "@/models/User";
import Influencer from "@/models/Influencer";
import Notification from "@/models/Notification";
import { NextResponse } from "next/server";
import AuthUtils from "@/lib/authUtils";

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    // --- 1. Authenticate Admin ---
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: adminId, role: adminRole } = userInfo || {};
    if (!adminId || adminRole !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required." },
        { status: 401 }
      );
    }

    // --- 2. Validate Params ---
    const { userId } = await params;
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required." },
        { status: 400 }
      );
    }

    // --- 3. Get User ---
    const user = await User.findById(userId)
      .select("-password -verificationToken -resetPasswordToken -__v")
      .lean();
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 }
      );
    }

    // --- 4. Parse Request ---
    const { status } = await req.json();
    if (!["active", "suspended", "pending", "isFeatured"].includes(status)) {
      return NextResponse.json(
        { success: false, message: "Invalid status value." },
        { status: 400 }
      );
    }

    const updateData = {};
    let message = "";
    let href = "";

    // --- 5. Status-specific Logic ---
    if (status === "isFeatured") {
      if (user.role !== "influencer") {
        return NextResponse.json(
          { success: false, message: "Only influencers can be featured." },
          { status: 400 }
        );
      }

      await Influencer.findOneAndUpdate(
        { user: user._id },
        { isFeatured: true },
        { new: true }
      );

      updateData.status = "active"; // Automatically activate when featured
      updateData.isFeatured = true;
      message = "🎉 Congratulations! You have been featured by the admin.";
      href = "/dashboard/influencer/profile";
    } else {
      updateData.status = status;

      // --- Notification messages for other statuses ---
      switch (status) {
        case "active":
          message = "✅ Your account has been activated by the admin.";
          break;
        case "suspended":
          message =
            "⚠️ Your account has been suspended. Contact support for details.";
          break;
        case "pending":
          message = "⏳ Your account status is now pending review.";
          break;
      }
    }

    // --- 6. Update User ---
    await User.findByIdAndUpdate(userId, updateData, { new: true });

    // --- 7. Create & Save Notification ---
    const notification = new Notification({
      user: user._id,
      message,
      href,
    });

    await notification.save();

    try {
      const websocketServerUrl =
        process.env.WEBSOCKET_SERVER_URL || "http://localhost:8080";
      const internalApiSecret = process.env.INTERNAL_API_SECRET;

      if (!internalApiSecret) {
        console.warn(
          "INTERNAL_API_SECRET is not set. Skipping real-time notification."
        );
      } else {
        // Event 1: Send the new notification object itself
        await fetch(`${websocketServerUrl}/api/internal/emit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": internalApiSecret,
          },
          body: JSON.stringify({
            target: "user", // <<< --- FIX: ADD THIS LINE
            userId: user._id,
            type: "new_notification",
            payload: notification.toObject(),
          }),
        });

        // Event 2: Update the influencer's unread notification count
        const unreadCount = await Notification.countDocuments({
          user: user._id,
          isRead: false,
        });
        await fetch(`${websocketServerUrl}/api/internal/emit`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-internal-secret": internalApiSecret,
          },
          body: JSON.stringify({
            target: "user", // <<< --- FIX: ADD THIS LINE
            userId: user._id,
            type: "general_unread_count_update",
            payload: { count: unreadCount },
          }),
        });
      }
    } catch (error) {
      console.error("Failed to send real-time notification:", error);
    }

    return NextResponse.json(
      { success: true, message: "User status updated and notification sent." },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error updating user status:", error);
    return NextResponse.json(
      { success: false, message: "Failed to update user status." },
      { status: 500 }
    );
  }
}
