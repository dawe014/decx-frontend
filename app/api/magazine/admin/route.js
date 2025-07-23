import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Article from "@/models/Magazine";

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const isFeatured = searchParams.get("featured");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;

  try {
    // Featured articles
    if (isFeatured === "true") {
      const featuredArticles = await Article.find({ featured: true }).sort({
        publishedAt: -1,
      });
      return NextResponse.json({ articles: featuredArticles });
    }

    // Build dynamic query
    const query = {};

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    if (category) {
      query.categories = category;
    }

    const totalArticles = await Article.countDocuments(query);
    const totalPages = Math.ceil(totalArticles / limit);

    const articles = await Article.find(query)
      .sort({ publishedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({
      articles,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
