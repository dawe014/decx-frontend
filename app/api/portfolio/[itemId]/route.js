import { NextResponse } from "next/server";
import Influencer from "@/models/Influencer";
import dbConnect from "@/config/database";
import AuthUtils from "@/lib/authUtils";

export async function DELETE(req, { params }) {
  try {
    await dbConnect();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: userId } = userInfo;
    const { itemId } = params;

    if (!itemId) {
      return NextResponse.json(
        { message: "Item ID is required." },
        { status: 400 }
      );
    }

    const result = await Influencer.updateOne(
      { user: userId },
      { $pull: { portfolio: { _id: itemId } } }
    );

    // Check if a document was found and modified.
    if (result.modifiedCount === 0) {
      return NextResponse.json(
        {
          message:
            "Portfolio item not found or you do not have permission to delete it.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Portfolio item deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("Delete Portfolio Item Error:", error);
    return NextResponse.json(
      { message: "Failed to delete portfolio item." },
      { status: 500 }
    );
  }
}
