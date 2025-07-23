import mongoose from "mongoose";

import dbConnect from "@/config/database";
import Brand from "@/models/Brand";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function PATCH(req, { params }) {
  const { id } = await params; // Get the brandId from the URL parameter

  try {
    await dbConnect(); // Ensure DB connection is established

    // Extract the JWT token from Authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header is required" },
        { status: 400 }
      );
    }

    const token = authHeader.split(" ")[1]; // Get the token part after "Bearer"
    if (!token) {
      return NextResponse.json(
        { success: false, message: "You are not logged in, Please login" },
        { status: 400 }
      );
    }
    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
    const { userId, role } = decoded; // Extract userId from decoded token

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }
    const existBrand = await Brand.findById(id);
    if (!existBrand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!existBrand.user.equals(userObjectId) && role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to update this brand",
        },
        { status: 403 }
      );
    }

    // Parse the request body (the data to update)
    const {
      companyName,
      logo,
      industry,
      website,
      companySize,
      description,
      contactPerson,
      subscription,
      paymentMethods,
      campaigns,
    } = await req.json();

    // Create an object to hold the update data
    const updateData = {};

    // Only add fields that are provided in the request body
    if (companyName) updateData.companyName = companyName;
    if (logo) updateData.logo = logo;
    if (industry) updateData.industry = industry;
    if (website) updateData.website = website;
    if (companySize) updateData.companySize = companySize;
    if (description) updateData.description = description;
    if (contactPerson) updateData.contactPerson = contactPerson;
    if (subscription) updateData.subscription = subscription;
    if (paymentMethods) updateData.paymentMethods = paymentMethods;
    if (campaigns) updateData.campaigns = campaigns;

    // If no fields were provided to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { message: "No fields provided for update" },
        { status: 400 }
      );
    }

    // Find the brand by ID and update the fields provided in the request
    const updatedBrand = await Brand.findByIdAndUpdate(
      id, // Brand to be updated
      updateData, // Fields to update
      { new: true, runValidators: true } // To return the updated document and validate before update
    );

    if (!updatedBrand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Brand updated successfully", brand: updatedBrand },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while updating the brand profile" },
      { status: 500 }
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await dbConnect(); // Ensure DB connection is established
    const { id } = await params; // Get the brandId from the URL parameter
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, message: "Authorization header is required" },
        { status: 400 }
      );
    }
    const token = authHeader.split(" ")[1]; // Get the token part after "Bearer"
    if (!token) {
      return NextResponse.json(
        { success: false, message: "You are not logged in, Please login" },
        { status: 400 }
      );
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret here
    const { userId, role } = decoded; // Extract userId from decoded token
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const existBrand = await Brand.findById(id);
    if (!existBrand) {
      return NextResponse.json(
        { success: false, message: "Brand not found" },
        { status: 404 }
      );
    }
    const userObjectId = new mongoose.Types.ObjectId(userId);

    if (!existBrand.user.equals(userObjectId) && role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "You are not authorized to delete this brand",
        },
        { status: 403 }
      );
    }
    const deletedBrand = await Brand.findByIdAndDelete(id);
    if (!deletedBrand) {
      return NextResponse.json({ message: "Brand not found" }, { status: 404 });
    }
    return NextResponse.json(
      { message: "Brand deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "An error occurred while deleting the brand" },
      { status: 500 }
    );
  }
}
