import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Review from "@/models/Review";
import User from "@/models/User"; // Assuming you have a User model
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

export async function POST(request) {
  await connectDB();
  try {
    const body = await request.json();

    const { campaign, reviewee, rating, reviewText } = body;

    const token = request.headers.get("authorization");
    const { userId: reviewer } = await getUserIdFromToken(token);

    // Validate required fields
    if (!campaign || !reviewer || !reviewee || !rating) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if the reviewer and reviewee are valid (Brand vs Influencer)
    const reviewerUser = await User.findById(reviewer);
    const revieweeUser = await User.findById(reviewee);

    if (!reviewerUser || !revieweeUser) {
      return NextResponse.json(
        { success: false, message: "Invalid reviewer or reviewee" },
        { status: 400 }
      );
    }

    // Example: Only allow review between Influencer and Brand
    if (reviewerUser.role === "influencer" && revieweeUser.role === "brand") {
      const newReview = new Review({
        campaign,
        reviewer,
        reviewee,
        rating,
        reviewText,
      });
      await newReview.save();

      return NextResponse.json(
        { success: true, review: newReview },
        { status: 201 }
      );
    }

    if (reviewerUser.role === "brand" && revieweeUser.role === "influencer") {
      const newReview = new Review({
        campaign,
        reviewer,
        reviewee,
        rating,
        reviewText,
      });
      await newReview.save();

      return NextResponse.json(
        { success: true, review: newReview },
        { status: 201 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          "You can only review a different type (brand -> influencer or influencer -> brand)",
      },
      { status: 400 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  await connectDB();
  try {
    const reviews = await Review.find().populate("campaign reviewer reviewee");
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
