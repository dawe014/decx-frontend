import { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/User";
import dbConnect from "@/config/database";
import { NextResponse } from "next/server";
import Influencer from "@/models/Influencer";
import Brand from "@/models/Brand";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    await dbConnect(); // Ensure database connection

    const { email, password } = await request.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isMatch = await compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: "Please verify your email first" },
        { status: 401 }
      );
    }

    // Generate JWT Tokens
    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: "7d" }
    );

    // Update user last login and refresh token
    user.refreshToken = refreshToken;
    user.lastLogin = Date.now();
    await user.save();
    // Set cookies
    const cookieStore = await cookies();
    cookieStore.set("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });

    cookieStore.set("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    // Determine redirect path
    if (user.role === "admin") {
      return NextResponse.json({
        success: true,
        redirectTo: "/dashboard/admin",
      });
    }

    if (user.role === "influencer") {
      const influencer = await Influencer.findOne({ user: user._id });

      return NextResponse.json({
        success: true,
        redirectTo: influencer
          ? `/influencer/${influencer._id}`
          : "/create-profile/step-1",
      });
    }

    if (user.role === "brand") {
      const brand = await Brand.findOne({ user: user._id });
      return NextResponse.json({
        success: true,
        redirectTo: brand
          ? "/dashboard/brand-owner"
          : "/create-profile/brand/step-1",
      });
    }

    return NextResponse.json(
      {
        success: true,
        message: "Login successful",
        userId: user._id,
        role: user.role,
        tokens: { accessToken, refreshToken },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Login Error:", error);
    return NextResponse.json(
      { success: false, message: "Login failed", error: error.message },
      { status: 500 }
    );
  }
}
