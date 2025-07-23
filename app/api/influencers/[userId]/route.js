import dbConnect from "@/config/database";
import User from "@/models/User";
import { NextResponse } from "next/server";
import Influencer from "@/models/Influencer";
import AuthUtils from "@/lib/authUtils";
export async function POST(req, { params }) {
  try {
    await dbConnect();
    const { id } = await AuthUtils.getUserInfo(req);
    if (!id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const { userId } = await params;
    const body = await req.json();

    if (!userId) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }
    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }
    const existInfluencer = await Influencer.find({ user: userId });

    if (existInfluencer.length > 0) {
      return NextResponse.json(
        {
          success: false,
          message: "User already has an influencer profile",
        },
        { status: 400 }
      );
    }

    const influencer = new Influencer({
      user: user._id,
      ...body,
    });
    const savedInfluencer = await influencer.save();

    return NextResponse.json(
      {
        message: "Influencer created successfully",
        influencer: savedInfluencer,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while creating the Influencer profile" },
      { status: 500 }
    );
  }
}

export async function GET(req, { params }) {
  await dbConnect();
  try {
    const { userId } = await params;
    const influencer = await Influencer.findById(userId);
    if (!influencer) {
      return NextResponse.json(
        {
          message: "No influencer found",
        },
        { status: 400 }
      );
    }
    return NextResponse.json({ success: true, influencer }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 200 }
    );
  }
}
export async function PATCH(req, { params }) {
  const { userId } = await params; // Get the influencer's userId from the URL parameter
  await dbConnect(); // Ensure DB connection is established

  try {
    // Parse the request body (the data to update)
    const body = await req.json();

    // Prepare the update object
    const updateData = {};

    // Add fields to updateData only if they are provided in the request body
    if (body.fullName) updateData.fullName = body.fullName;
    if (body.bio) updateData.bio = body.bio;
    if (body.profilePhoto) updateData.profilePhoto = body.profilePhoto;
    if (body.coverPhoto) updateData.coverPhoto = body.coverPhoto;
    if (body.location) updateData.location = body.location;
    if (body.languages) updateData.languages = body.languages;
    if (body.services) updateData.services = body.services;
    if (body.niches) updateData.niches = body.niches;
    if (body.socialLinks) updateData.socialMedia = body.socialLinks;
    if (body.portfolio) updateData.portfolio = body.portfolio;
    if (body.rates) updateData.rates = body.rates;
    if (body.availability) updateData.availability = body.availability;
    if (body.rating) updateData.rating = body.rating;
    if (body.badges) updateData.badges = body.badges;
    if (body.isFeatured !== undefined) updateData.isFeatured = body.isFeatured; // Check if isFeatured is provided

    // Find the influencer by userId and update only the fields that are provided
    const updatedInfluencer = await Influencer.findOneAndUpdate(
      { user: userId },
      updateData,
      { new: true, runValidators: true } // Return the updated influencer and validate fields
    );

    if (!updatedInfluencer) {
      return NextResponse.json(
        { message: "Influencer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { influencer: updatedInfluencer },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while updating the influencer profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  const { userId } = await params; // Get the influencer's userId from the URL parameter
  await dbConnect(); // Ensure DB connection is established
  try {
    // Find and delete the influencer by userId
    const influencer = await Influencer.findOneAndDelete({ user: userId });
    if (!influencer) {
      return NextResponse.json(
        { message: "Influencer not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { message: "Influencer deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while deleting the influencer profile" },
      { status: 500 }
    );
  }
}
