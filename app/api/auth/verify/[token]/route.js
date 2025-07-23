import dbConnect from "@/config/database";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    // Get the token from the URL (from the dynamic route parameter)
    const token = req.nextUrl.pathname.split("/").pop();

    // Check if the token is valid
    if (!token) {
      return NextResponse.json(
        { message: "Verification token is missing" },
        { status: 400 }
      );
    }

    // Find user with the given verification token
    const user = await User.findOne({ verificationToken: token });

    // If no user found or invalid token, return error
    if (!user) {
      return NextResponse.json(
        { message: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Update user as verified and clear the verification token
    user.isVerified = true;
    user.verificationToken = undefined; // Clear the verification token
    await user.save();

    // Return success message
    return NextResponse.json(
      { message: "Email verified successfully. You can now log in." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Verification Error:", error);
    return NextResponse.json(
      { message: "An error occurred during email verification" },
      { status: 500 }
    );
  }
}
