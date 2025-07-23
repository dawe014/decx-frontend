import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import path from "path";
import fs from "fs/promises";
import connectDB from "@/config/database";
import Article from "@/models/Magazine";

export const PATCH = async (request, { params }) => {
  try {
    await connectDB();

    const { slug: id } = await params;

    // Check if ID is valid
    if (!id) {
      return NextResponse.json(
        { error: "Article ID is required" },
        { status: 400 }
      );
    }

    // Get the form data
    const formData = await request.formData();
    const featuredImage = formData.get("featuredImage");

    // Validate the file
    if (!featuredImage || typeof featuredImage === "string") {
      return NextResponse.json(
        { error: "No image file provided" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const fileExtension = path.extname(featuredImage.name);
    const fileName = `${uuidv4()}${fileExtension}`;
    const uploadDir = path.join(process.cwd(), "public/uploads/magazine");
    const filePath = path.join(uploadDir, fileName);
    const publicUrl = `/uploads/magazine/${fileName}`;

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Convert file to buffer and save to disk
    const fileBuffer = await featuredImage.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(fileBuffer));

    // Update the article in database with new image URL
    const updatedArticle = await Article.findByIdAndUpdate(
      id,
      { featuredImage: publicUrl, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedArticle) {
      // Clean up the uploaded file if article not found
      await fs.unlink(filePath);
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(
      { success: true, imageUrl: publicUrl, article: updatedArticle },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error uploading image:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
};

// Add this to handle OPTIONS requests for CORS
export const OPTIONS = async () => {
  return NextResponse.json({}, { status: 200 });
};
