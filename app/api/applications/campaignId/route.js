import connectDB from "@/config/database"; // your MongoDB connection util
import Application from "@/models/Application";
import { NextResponse } from "next/server";
import Campaign from "@/models/Campaign";
import AuthUtils from "@/lib/authUtils";
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { campaignId } = await params;
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: userId } = userInfo || {};
    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not logged in, Please login and try again",
        },
        { status: 401 }
      );
    }
    const brand = await Brand.findOne({ user: userId });
    if (!brand) {
      return NextResponse.json(
        { message: "Brand not found for this user" },
        { status: 404 }
      );
    }

    const campaign = await Campaign.findId(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }
    // Authorization: only brand owner can update the campaign
    if (String(brand._id) !== String(campaign.brand)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "You are not authorized to view applications for this campaign",
        },
        { status: 403 }
      );
    }
    // Fetch all applications for the given campaignId
    const applications = await Application.find({ campaign: campaignId });
    if (!applications) {
      return NextResponse.json(
        { success: false, message: "No applications found for this campaign" },
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
      { success: false, message: "Failed to fetch applications" },
      { status: 500 }
    );
  }
}
