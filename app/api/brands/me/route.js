import connectDB from "@/config/database";
import { NextResponse } from "next/server";
import Brand from "@/models/Brand";
import AuthUtils from "@/lib/authUtils";

// --- GET Handler (Existing) ---
export async function GET(req) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(req);

    if (!userInfo || !userInfo.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = userInfo;

    const brand = await Brand.findOne({ user: id })
      .populate({
        path: "user",
        select: "-password -__v -resetPasswordToken -resetPasswordExpires",
      })
      .select("-__v");

    if (!brand) {
      return NextResponse.json(
        { message: "Brand profile not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, brand }, { status: 200 });
  } catch (error) {
    console.error("GET /api/brands/me Error:", error);
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

// --- PUT Handler (New Controller) ---
export async function PUT(req) {
  try {
    await connectDB();

    // 1. Authenticate the request and get the user's ID
    const { userInfo } = await AuthUtils.validateRequest(req);
    if (!userInfo || !userInfo.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { id } = userInfo;

    // 2. Get the request body containing the updated profile data
    const body = await req.json();

    // 3. **Security**: Explicitly define which fields are updatable by the user.
    // This prevents them from changing protected fields like `rating`, `isFeatured`, etc.
    const allowedUpdates = {};
    const updatableFields = [
      "companyName",
      "industry",
      "website",
      "companySize",
      "description",
      "contactPerson",
    ];

    // Populate the allowedUpdates object only with fields present in the request body
    updatableFields.forEach((field) => {
      if (body[field] !== undefined) {
        allowedUpdates[field] = body[field];
      }
    });

    if (Object.keys(allowedUpdates).length === 0) {
      return NextResponse.json(
        { message: "No updatable fields provided." },
        { status: 400 }
      );
    }

    // 4. Find the influencer by their user ID and update it in one atomic operation
    const updatedInfluencer = await Brand.findOneAndUpdate(
      { user: id }, // The condition to find the document
      { $set: allowedUpdates }, // The update operation using our secure object
      {
        new: true, // Return the document *after* the update has been applied
        runValidators: true, // Ensure the updates adhere to schema rules (e.g., enums)
      }
    ).select("-__v"); // Exclude the version key from the response

    // 5. Handle the case where the profile doesn't exist for the logged-in user
    if (!updatedInfluencer) {
      return NextResponse.json(
        { message: "Influencer profile not found." },
        { status: 404 }
      );
    }

    // 6. Return a success response with the updated data
    return NextResponse.json(
      {
        success: true,
        message: "Profile updated successfully.",
        influencer: updatedInfluencer,
      },
      { status: 200 }
    );
  } catch (error) {
    // Handle potential validation errors from Mongoose
    if (error.name === "ValidationError") {
      return NextResponse.json(
        { message: "Validation Error", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("PUT /api/brands/me Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred." },
      { status: 500 }
    );
  }
}
