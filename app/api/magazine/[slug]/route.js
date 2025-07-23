import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Article from "@/models/Magazine";

export async function GET(request, { params }) {
  await connectDB();
  const { slug } = await params;

  try {
    const article = await Article.findOne({ _id: slug }).lean();

    if (!article) {
      return NextResponse.json(
        { message: "Article not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(article);
  } catch (error) {
    console.error("Error fetching article:", error);
    return NextResponse.json(
      { message: "Error fetching article" },
      { status: 500 }
    );
  }
}

// PATCH update article
export const PATCH = async (request, { params }) => {
  try {
    await connectDB();

    const { slug: id } = await params;
    const updateData = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      article: updatedArticle,
    });
  } catch (error) {
    console.error("Error updating article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// DELETE article
export const DELETE = async (request, { params }) => {
  try {
    await connectDB();

    const { slug: id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    const deletedArticle = await Article.findByIdAndDelete(id);

    if (!deletedArticle) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Article deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting article:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};
