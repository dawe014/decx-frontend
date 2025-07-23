import dbConnect from "@/config/database";
import User from "@/models/User";
import Influencer from "@/models/Influencer";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    // Find users where role is 'influencer' or 'brand'
    const users = await User.find({
      role: { $in: ["influencer", "brand", "admin"] },
      isVerified: true,
    })
      .select("-password -__v") // Exclude sensitive fields
      .lean(); // Return plain JS objects for easier modifications

    // Populate additional details for each user
    const populatedUsers = await Promise.all(
      users.map(async (user) => {
        let profileData = null;

        if (user.role === "influencer") {
          profileData = await Influencer.findOne({ user: user._id }).select(
            "-__v -createdAt -updatedAt"
          );
        } else if (user.role === "brand") {
          profileData = await Brand.findOne({ user: user._id }).select(
            "-__v -createdAt -updatedAt"
          );
        }

        return {
          ...user,
          profile: profileData,
        };
      })
    );

    return NextResponse.json(
      { success: true, users: populatedUsers },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Error fetching users:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
