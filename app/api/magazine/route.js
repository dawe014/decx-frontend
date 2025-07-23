import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Article from "@/models/Magazine";
import AuthUtils from "@/lib/authUtils"; // Utility for authentication

// POST /api/articles - Create a new article
export async function POST(req) {
  try {
    await dbConnect();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id, role } = userInfo || {};
    if (!id || role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { title } = body;
    const art = await Article.findOne({ title });
    if (art) {
      return NextResponse.json(
        {
          success: false,
          message: "Duplicated Article title",
        },
        { status: 201 }
      );
    }

    const newArticle = new Article({
      ...body,
    });

    const savedArticle = await newArticle.save();

    return NextResponse.json(
      {
        success: true,
        message: "Article created successfully",
        article: savedArticle,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create article error:", error);

    // Handle unique title error
    if (error.code === 11000 && error.keyPattern?.title) {
      return NextResponse.json(
        { success: false, message: "Article title must be unique" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to create article" },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await dbConnect();

  const { searchParams } = new URL(request.url);
  const isFeatured = searchParams.get("featured");
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 10;

  try {
    // Handle featured articles separately
    if (isFeatured === "true") {
      const featuredArticles = await Article.find({ featured: true }).sort({
        publishedAt: -1,
      });
      return Response.json({ articles: featuredArticles });
    }

    // Build query
    const query = { status: "published" };

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

    return Response.json({
      articles,
      totalPages,
      currentPage: page,
    });
  } catch (error) {
    console.error("API error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
