import { NextResponse } from "next/server";
import { handleMediaUpload } from "@/lib/upload"; // Import the utility function
import dbConnect from "@/config/database";
import AuthUtils from "@/lib/authUtils"; // Import your authentication utility
import Influencer from "@/models/Influencer";
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function PATCH(req) {
  try {
    await dbConnect();

    // Validate the request and get user info
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id } = userInfo;
    if (!id) {
      return NextResponse.json(
        { message: "Unauthorized access" },
        { status: 401 }
      );
    }
    const formData = await req.formData();

    const file = formData.get("profileImage");
    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    // Call utility function to handle file upload
    const { url: fileUrl } = await handleMediaUpload(file, "profile");

    // Save the URL in the database
    await Influencer.updateOne(
      { user: id },
      { $set: { profilePhoto: fileUrl } }
    );
    return NextResponse.json({
      message: "Profile image uploaded",
      url: fileUrl,
    });
  } catch (err) {
    console.error("Upload Error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
