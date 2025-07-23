import connectDB from "@/config/database"; // your MongoDB connection util
import Application from "@/models/Application";
import { NextResponse } from "next/server";
import Influencer from "@/models/Influencer";
import AuthUtils from "@/lib/authUtils";

export async function GET(req) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id } = userInfo;

    const influencer = await Influencer.findOne({ user: id });

    if (!influencer) {
      return NextResponse.json(
        { success: false, message: "Influencer not found" },
        { status: 404 }
      );
    }
    const applications = await Application.find({
      influencer: influencer._id,
    });

    if (!applications) {
      return NextResponse.json(
        { success: false, message: "No applications found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        applications,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("�� Error fetching applications:", error);
    return NextResponse.json(
      { success: false, message: error },
      { status: 500 }
    );
  }
}
