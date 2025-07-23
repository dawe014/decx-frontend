import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import dbConnect from "@/config/database";
import { handleMediaUpload } from "@/lib/upload"; // Import the utility function

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    const { id } = await params;
    const formData = await req.formData();

    const file = formData.get("logo");
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Call utility function to handle file upload
    const { url: fileUrl } = await handleMediaUpload(file, "logo");

    const brandExist = await Brand.findById(id);
    if (!brandExist) {
      return NextResponse.json({ message: "No Brand Found" }, { status: 400 });
    }
    // Update brand with new logo URL
    const brand = await Brand.findByIdAndUpdate(
      id,
      { $set: { logo: fileUrl } },
      { new: true }
    );
    return NextResponse.json({
      url: fileUrl,
      brand,
    });
  } catch (error) {
    console.error("Error uploading logo:", error);
    return NextResponse.json(
      { error: "Failed to upload logo" },
      { status: 500 }
    );
  }
}
