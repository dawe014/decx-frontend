import dbConnect from "@/config/database"; // Database connection utility
import Campaign from "@/models/Campaign"; // Campaign model
import Brand from "@/models/Brand"; // Brand model
import { NextResponse } from "next/server";
import AuthUtils from "@/lib/authUtils"; // Utility for authentication

export async function POST(req) {
  try {
    // Connect to the database
    await dbConnect();

    // Get the authorization token from the request headers
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id } = userInfo || {};
    if (!id) {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    // Get the incoming request body (campaign data)
    const body = await req.json();
    // Check if the user is a brand user and has an existing brand profile
    const brand = await Brand.findOne({ user: id });

    if (!brand) {
      return NextResponse.json(
        { message: "Brand not found for this user" },
        { status: 404 }
      );
    }

    // Validate Brand Subscription is active

    if (!brand.subscription) {
      return NextResponse.json(
        { message: "Brand subscription not found" },
        { status: 400 }
      );
    }
    //check if subscription is not expired it expire after 30 days
    if (brand.subscription.startedAt && brand.subscription.expiresAt) {
      const now = new Date();
      if (now > brand.subscription.expiresAt) {
        return NextResponse.json(
          { message: "Your subscription has expired" },
          { status: 400 }
        );
      }
    }

    // Create the new campaign using the provided data and associating it with the brand

    const newCampaign = new Campaign({
      brand: brand._id, // Link the campaign to the user's brand
      ...body, // Use the incoming data for other campaign fields
    });

    // Save the campaign to the database
    const savedCampaign = await newCampaign.save();

    // Respond with a success message and the saved campaign
    return NextResponse.json(
      { message: "Campaign created successfully", campaign: savedCampaign },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating campaign:", error);
    return NextResponse.json(
      { message: "An error occurred while creating the campaign" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    await dbConnect();

    const { searchParams } = new URL(request.url);

    const search = searchParams.get("search") || "";
    const niche = searchParams.get("niche") || "";
    const language = searchParams.get("language") || "";
    const price = parseInt(searchParams.get("price") || "0", 10);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 10;

    const query = { status: "active" };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { niches: { $regex: search, $options: "i" } },
      ];
    }

    if (niche) {
      query.niches = niche;
    }

    if (language) {
      query.targetLanguages = language;
    }

    if (price > 0) {
      query["budget.min"] = { $gte: price };
    }

    const totalCampaigns = await Campaign.countDocuments(query);
    const totalPages = Math.ceil(totalCampaigns / limit);

    const campaigns = await Campaign.find(query)
      .populate("brand", "companyName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json(
      {
        success: true,
        campaigns,
        totalCampaigns,
        currentPage: page,
        totalPages,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    return NextResponse.json(
      { message: "An error occurred while fetching the campaigns" },
      { status: 500 }
    );
  }
}
