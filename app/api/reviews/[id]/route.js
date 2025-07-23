import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Review from "@/models/Review";
import { getUserIdFromToken } from "@/utils/auth"; // Optional if you need the author from token

export async function PATCH(request, { params }) {
  await connectDB();
  const { id } = await params;
  const updates = await request.json();

  try {
    const token = request.headers.get("authorization");
    const { userId } = getUserIdFromToken(token);
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }
    if (String(review.reviewer) !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to update this Review",
        },
        { status: 403 }
      );
    }

    const updatedReview = await Review.findByIdAndUpdate(id, updates, {
      new: true,
    });
    if (!updatedReview) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, review: updatedReview });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  await connectDB();
  const { id } = await params;

  try {
    const token = request.headers.get("authorization");
    const { userId } = getUserIdFromToken(token);
    const review = await Review.findById(id);

    if (!review) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }
    if (String(review.reviewer) !== userId) {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this Review",
        },
        { status: 403 }
      );
    }

    const deletedReview = await Review.findByIdAndDelete(id);

    if (!deletedReview) {
      return NextResponse.json(
        { success: false, message: "Review not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Review deleted" });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 }
    );
  }
}
