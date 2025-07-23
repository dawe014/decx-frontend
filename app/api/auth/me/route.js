import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import User from "@/models/User";
import Influencer from "@/models/Influencer";
import bcrypt from "bcryptjs"; // if you're hashing
import Brand from "@/models/Brand";
import Plan from "@/models/Plan";
import AuthUtils from "@/lib/authUtils"; // Utility to get user info from request

export async function GET(req) {
  try {
    await dbConnect();

    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id } = userInfo || {};

    if (!id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const userDoc = await User.findById(id).select("-password -__v");
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = userDoc.toObject(); // Convert to plain JS object to allow mutation

    // Attach profile picture based on role
    if (user.role === "influencer") {
      const influencer = await Influencer.findOne({ user: id }).select(
        "profilePhoto fullName"
      );
      user.profilePictureUrl = influencer?.profilePhoto || null;
      user.fullName = influencer?.fullName || null;
    } else if (user.role === "brand") {
      const brand = await Brand.findOne({ user: id })
        .select("logo companyName subscription")
        .populate({
          path: "subscription.planId", // this targets the planId inside the embedded object
          model: "Plan", // the referenced model name
          select: "name", // only pull the name
        });

      user.profilePictureUrl = brand?.logo || null;
      user.companyName = brand?.companyName || null;

      // Store the plan name
      user.planName = brand?.subscription?.planId?.name || null;
    }
    return NextResponse.json(user);
  } catch (error) {
    console.error("Error in GET /api/auth/me:", error);
    return NextResponse.json(
      { error: "Failed to fetch user data", details: error.message },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  try {
    await dbConnect();

    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id } = userInfo || {};

    if (!id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { email, password, oldPassword } = body;

    const updateData = {};
    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // If password update is requested, validate the old password first
    if (password || oldPassword) {
      if (!oldPassword) {
        return NextResponse.json(
          { error: "Old password is required to change the password" },
          { status: 400 }
        );
      }

      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return NextResponse.json(
          { error: "Old password is incorrect" },
          { status: 401 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    if (email) updateData.email = email;

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
    }).select("-password -__v");

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error in PATCH /api/auth/me:", error);
    return NextResponse.json(
      { error: "Failed to update user data", details: error.message },
      { status: 500 }
    );
  }
}
