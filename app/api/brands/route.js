import dbConnect from "@/config/database";
import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import AuthUtils from "@/lib/authUtils";

// Fetch brand data from the database
export async function GET() {
  try {
    // Connect to the database
    await dbConnect();
    // Fetch all brands
    const brands = await Brand.find().populate("user");
    // Return the brands array
    return NextResponse.json({ success: true, brands }, { status: 200 });
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch brands" },
      { status: 500 }
    );
  }
}
export async function POST(req) {
  try {
    // Ensure DB connection is established
    await dbConnect();
    const { userInfo } = await AuthUtils.validateRequest(req);
    if (!userInfo || !userInfo.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }
    const { id: userId, role } = userInfo; // Extract user ID and role from userInfo
    // Extract the JWT token from Authorization header

    // Verify and decode the token
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    if (role !== "brand" && role !== "admin") {
      return NextResponse.json(
        { success: false, message: "User not authorized" },
        { status: 404 }
      );
    }

    // Check if the user already has a brand profile
    const existBrand = await Brand.findOne({ user: userId });

    if (existBrand) {
      return NextResponse.json(
        { success: false, message: "User already has a Brand profile" },
        { status: 400 }
      );
    }

    // Create a new Brand profile
    const body = await req.json();

    const {
      companyName,
      industry,
      website,
      companySize,
      description,
      contactPerson,
    } = body;

    // Create brand logic here (e.g., saving to database)
    const newBrand = {
      companyName,
      industry,
      website,
      companySize,
      description,
      contactPerson,
    };

    const brand = new Brand({
      user: userId,
      ...newBrand,
    });
    const savedBrand = await brand.save();

    return NextResponse.json(
      { message: "Brand created successfully", brand: savedBrand },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while creating the Brand profile" },
      { status: 500 }
    );
  }
}
