import connectDB from "@/config/database"; // your MongoDB connection util
import Application from "@/models/Application";
import { NextResponse } from "next/server";
import Campaign from "@/models/Campaign";
import Influencer from "@/models/Influencer";
import AuthUtils from "@/lib/authUtils"; // Utility to get user info from request
export async function POST(req) {
  await connectDB();
  try {
    const data = await req.json();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: userId } = userInfo || {};
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 401 }
      );
    }
    const influencer = await Influencer.findOne({ user: userId });
    if (!influencer) {
      return NextResponse.json(
        { error: "Influencer not found." },
        { status: 404 }
      );
    }

    const { campaign, title, proposal, quote } = data;
    if (!campaign || !title || !proposal || quote == null) {
      return NextResponse.json(
        { error: "All fields are required." },
        { status: 400 }
      );
    }
    const existCampaign = await Campaign.findById(campaign);
    if (!existCampaign) {
      return NextResponse.json(
        { error: "Campaign not found." },
        { status: 404 }
      );
    }

    const alreadyApplied = await Application.findOne({
      campaign,
      influencer: influencer._id,
    });
    if (alreadyApplied) {
      return NextResponse.json(
        { error: "You have already applied for this campaign." },
        { status: 400 }
      );
    }

    const newApplication = await Application.create({
      campaign,
      influencer: influencer._id,
      title,
      proposal,
      quote,
    });

    return NextResponse.json(
      { success: true, application: newApplication },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
