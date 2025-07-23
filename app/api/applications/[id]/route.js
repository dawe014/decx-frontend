import connectDB from "@/config/database";
import Application from "@/models/Application";
import Influencer from "@/models/Influencer";
import { NextResponse } from "next/server";
import AuthUtils from "@/lib/authUtils";

export async function PATCH(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
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

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found." },
        { status: 404 }
      );
    }

    if (String(application.influencer) !== String(influencer._id)) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { proposal, quote, portfolioLinks } = body;

    if (proposal !== undefined) application.proposal = proposal;
    if (quote !== undefined) application.quote = Number(quote);
    if (portfolioLinks !== undefined)
      application.portfolioLinks = portfolioLinks;

    await application.save();

    return NextResponse.json(
      { message: "Application updated successfully", application },
      { status: 200 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Server error: " + err.message },
      { status: 500 }
    );
  }
}
export async function DELETE(req, { params }) {
  await connectDB();
  const { id } = await params;

  try {
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
        { error: "Influencer not found" },
        { status: 404 }
      );
    }

    const application = await Application.findById(id);
    if (!application) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }
    if (String(application.influencer) !== String(influencer._id)) {
      return NextResponse.json(
        { error: "Unauthorized access." },
        { status: 403 }
      );
    }

    const deleted = await Application.findByIdAndDelete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: "Application not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Application withdrawn successfully" },
      { status: 200 }
    );
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req, { params }) {
  try {
    await connectDB();

    const { id } = await params;
    const app = await Application.findById(id);

    const application = await Application.findById(id).populate("influencer");

    if (!application) {
      return NextResponse.json(
        { success: false, message: "No applications found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      {
        success: true,
        application,
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
