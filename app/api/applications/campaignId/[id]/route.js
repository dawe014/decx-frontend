import connectDB from "@/config/database"; // your MongoDB connection util
import Application from "@/models/Application";
import { NextResponse } from "next/server";
import Campaign from "@/models/Campaign";
import Brand from "@/models/Brand";
import AuthUtils from "@/lib/authUtils"; // Utility to get user info from request
export async function GET(req, { params }) {
  try {
    await connectDB();
    const { campaignId, id } = await params;
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

    const campaign = await Campaign.findById(campaignId);
    if (!campaign) {
      return NextResponse.json(
        { success: false, message: "Campaign not found" },
        { status: 404 }
      );
    }
    if (String(campaign.brand) !== String(brand._id)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to view this proposal" },
        { status: 403 }
      );
    }

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { success: false, message: "No applications found for this campaign" },
        { status: 404 }
      );
    }
    if (String(application.campaign) !== campaignId) {
      return NextResponse.json(
        { success: false, message: "Unauthorized to view this proposal" },
        { status: 403 }
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
