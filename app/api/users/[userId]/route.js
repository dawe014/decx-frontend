import dbConnect from "@/config/database";
import User from "@/models/User";
import Influencer from "@/models/Influencer"; // Import the Influencer model
import Brand from "@/models/Brand"; // Import the Brand model
import { NextResponse } from "next/server";
import AuthUtils from "@/lib/authUtils"; // Your custom utility for authentication

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // --- 1. Authentication and Authorization ---
    // Ensure the request comes from an authenticated admin.
    const { userInfo } = await AuthUtils.validateRequest(req);
    // Use object destructuring for safer access.
    const { id: adminId, role: adminRole } = userInfo || {};

    if (!adminId || adminRole !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized: Admin access required." },
        { status: 401 }
      );
    }

    // --- 2. Get User ID from URL ---
    const { userId } = await params; // The parameter from the URL is `id`
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required in the URL." },
        { status: 400 }
      );
    }

    // --- 3. Fetch Base User Data ---
    // Use .lean() for a performance boost, as we only need to read data.
    const user = await User.findById(userId)
      .select("-password -verificationToken -resetPasswordToken -__v")
      .lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found." },
        { status: 404 } // 404 is more appropriate for "not found"
      );
    }

    // --- 4. Fetch Role-Specific Profile Data ---
    let profile = null;
    if (user.role === "influencer") {
      profile = await Influencer.findOne({ user: user._id })
        .select("-__v")
        .lean();
    } else if (user.role === "brand") {
      profile = await Brand.findOne({ user: user._id })
        .select("-__v")
        .populate("subscription.planId")
        .lean();
    }
    // For 'admin' role, profile will correctly remain null.

    // --- 5. Combine User and Profile Data ---
    // This creates the exact structure your front-end page expects.
    const fullUser = {
      ...user,
      profile: profile,
    };

    return NextResponse.json({ success: true, user: fullUser });
  } catch (error) {
    console.error("Error fetching user details:", error);

    // Handle specific mongoose errors like invalid ObjectId
    if (error.name === "CastError") {
      return NextResponse.json(
        { success: false, message: "Invalid User ID format." },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "An unexpected server error occurred." },
      { status: 500 }
    );
  }
}
