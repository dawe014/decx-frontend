import User from "@/models/User";
import connectDB from "@/config/database";
import { NextResponse } from "next/server";
import Notification from "@/models/Notification";

export async function POST(req) {
  try {
    await connectDB();
    const { email, password, role } = await req.json();
    // Validate required fields
    if (!email || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }
    if (role !== "influencer" && role !== "brand") {
      return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already in use" },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      email,
      password,
      role,
      isVerified: true,
      status: "pending",
    });

    await user.save();

    const notification = new Notification({
      user: user._id,
      message: `Welcome! Your account has been created successfully.`,
      href: "",
    });

    await notification.save();

    const adminUsers = await User.find({ role: "admin" });
    const websocketServerUrl =
      process.env.WEBSOCKET_SERVER_URL || "http://localhost:8080";
    const internalApiSecret = process.env.INTERNAL_API_SECRET;

    try {
      if (!internalApiSecret) {
        console.warn(
          "INTERNAL_API_SECRET is not set. Skipping real-time notification."
        );
      } else {
        for (const admin of adminUsers) {
          // 1. Save notification for each admin
          const adminNotification = new Notification({
            user: admin._id,
            message: `New ${role} registered: ${email}`,
            href: `/dashboard/admin/users/${user._id}`,
          });
          await adminNotification.save();

          // 2. Emit real-time notification to this admin
          await fetch(`${websocketServerUrl}/api/internal/emit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-secret": internalApiSecret,
            },
            body: JSON.stringify({
              target: "admins",

              userId: admin._id,
              type: "new_notification",
              payload: adminNotification.toObject(),
            }),
          });

          // 3. Send updated unread count for this admin
          const unreadCount = await Notification.countDocuments({
            user: admin._id,
            read: false,
          });

          await fetch(`${websocketServerUrl}/api/internal/emit`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "x-internal-secret": internalApiSecret,
            },
            body: JSON.stringify({
              target: "admins",
              userId: admin._id,
              type: "general_unread_count_update",
              payload: { count: unreadCount },
            }),
          });
        }
      }
    } catch (error) {
      console.error("Failed to send real-time notification:", error);
    }

    return NextResponse.json(
      {
        message: "Registered Successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration Error:", error);
    return NextResponse.json(
      { message: "Registration failed", error: error.message },
      { status: 500 }
    );
  }
}
