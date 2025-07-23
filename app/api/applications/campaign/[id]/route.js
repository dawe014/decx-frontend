import connectDB from "@/config/database";
import Application from "@/models/Application";
import { NextResponse } from "next/server";
import Campaign from "@/models/Campaign";
import AuthUtils from "@/lib/authUtils";
import Influencer from "@/models/Influencer";
import Notification from "@/models/Notification";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id: campaignId } = await params;
    if (!campaignId) {
      return NextResponse.json(
        { success: false, message: "Campaign ID is required" },
        { status: 400 }
      );
    }
    const applications = await Application.find({
      campaign: campaignId,
    }).populate("influencer");
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

export async function PATCH(req, { params }) {
  try {
    await connectDB();

    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: userId, role } = userInfo || {};
    if (!userId || role !== "brand") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { id: campaignId } = await params;
    const { applicationId, status } = await req.json();

    if (!campaignId || !applicationId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // 1. Update the application status
    const application = await Application.findByIdAndUpdate(
      applicationId,
      { status, viewedByBrand: true },
      { new: true }
    );

    if (!application) {
      return NextResponse.json(
        { success: false, message: "Application not found" },
        { status: 404 }
      );
    }
    const user = await Influencer.findById(application.influencer).populate(
      "user"
    );

    // 2. If hired, add to campaign.hiredInfluencers
    if (status === "hired") {
      await Campaign.findByIdAndUpdate(
        campaignId,
        {
          $addToSet: {
            hiredInfluencers: {
              influencer: application.influencer,
              contract: {
                paymentAmount: application.quote,
                paymentStatus: "pending",
              },
              deliverablesStatus: [],
            },
          },
        },
        { new: true }
      );
    }
    const notification = Notification({
      user: user.user._id,
      message: `Your application for the campaign ${application.title} has been  ${status}`,
      href: `/my-proposals/${applicationId}`,
    });
    await notification.save();

    // 4. Trigger the real-time notification to the influencer
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
            userId: user.user._id,
            type: "new_notification",
            payload: notification.toObject(),
          }),
        });

        // Event 2: Update the influencer's unread notification count
        const unreadCount = await Notification.countDocuments({
          user: user.user._id,
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
            userId: user.user._id,
            type: "general_unread_count_update",
            payload: { count: unreadCount },
          }),
        });
      }
    } catch (error) {
      console.error("Failed to send real-time notification:", error);
    }

    return NextResponse.json(
      {
        success: true,
        message: "Application status updated successfully",
        application,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Failed to update application" },
      { status: 500 }
    );
  }
}
