import dbConnect from "@/config/database"; // Database connection utility
import Campaign from "@/models/Campaign"; // Campaign model
import Brand from "@/models/Brand"; // Brand model
import { NextResponse } from "next/server";
import AuthUtils from "@/lib/authUtils"; // Utility for authentication

export async function GET(req) {
  try {
    // Connect to the database
    await dbConnect();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id } = userInfo || {};

    if (!id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }
    // Check if the user is a brand user and has an existing brand profile
    const brand = await Brand.findOne({ user: id });

    if (!brand) {
      return NextResponse.json(
        { message: "Brand not found for this user" },
        { status: 404 }
      );
    }

    const campaigns = await Campaign.find({ brand: brand._id })
      .populate("brand") // Populate the brand associated with the campaign
      .sort({ createdAt: -1 }); // Sort the campaigns in descending order of creation
    return NextResponse.json({ success: true, campaigns }, { status: 200 });
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the campaigns" },
      { status: 500 }
    );
  }
}
