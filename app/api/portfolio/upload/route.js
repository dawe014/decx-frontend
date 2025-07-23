import { NextResponse } from "next/server";
import { handleMediaUpload } from "@/lib/upload";
import AuthUtils from "@/lib/authUtils";
import Influencer from "@/models/Influencer";
import dbConnect from "@/config/database";

export async function PATCH(req) {
  try {
    await dbConnect();

    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id } = userInfo;
    const formData = await req.formData();

    const portfolioItems = [];
    let index = 0;

    while (true) {
      const file = formData.get(`portfolioItem-${index}-file`);
      const description = formData
        .get(`portfolioItem-${index}-description`)
        ?.toString();

      // If all are null/undefined, break (end of entries)
      if (!file && !description) {
        break;
      }

      // If any one field is missing, return a specific error
      if (!file || !description) {
        return NextResponse.json(
          { message: `Missing data at portfolioItem index ${index}` },
          { status: 400 }
        );
      }

      const upload = await handleMediaUpload(file, "uploads");
      if (!upload?.url) {
        return NextResponse.json(
          { message: `File upload failed at index ${index}` },
          { status: 500 }
        );
      }

      portfolioItems.push({
        description,
        mediaUrl: upload.url,
        mediaType: upload.type,
        date: new Date(),
      });

      index++;
    }

    if (portfolioItems.length === 0) {
      return NextResponse.json(
        { message: "No valid portfolio items were found." },
        { status: 400 }
      );
    }

    await Influencer.updateOne(
      { user: id },
      {
        $push: {
          portfolio: { $each: portfolioItems },
        },
      }
    );

    return NextResponse.json({ message: "Upload successful", portfolioItems });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { message: "Upload failed", error: error.message },
      { status: 500 }
    );
  }
}
