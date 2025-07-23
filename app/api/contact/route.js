import dbConnect from "@/config/database";
import Contact from "@/models/Contact";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    const {
      firstName = "",
      lastName = "",
      email = "",
      phone = "",
      subject = "",
      message = "",
    } = body;

    // --- Server-side Validation ---
    if (
      !firstName.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please fill in all required fields: First Name, Email, Subject, and Message.",
        },
        { status: 400 }
      );
    }

    // Optionally: Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json(
        {
          success: false,
          message: "Please provide a valid email address.",
        },
        { status: 400 }
      );
    }

    // Save to DB
    await Contact.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      subject: subject.trim(),
      message: message.trim(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully! We'll be in touch soon.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Contact Form Error:", error);

    if (error.name === "ValidationError") {
      let errors = {};
      for (const field in error.errors) {
        errors[field] = error.errors[field].message;
      }
      return NextResponse.json(
        {
          success: false,
          message: "Validation failed",
          errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "An unexpected error occurred. Please try again later.",
      },
      { status: 500 }
    );
  }
}
export async function GET(req) {
  try {
    await dbConnect();
    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id, role } = userInfo || {};

    if (!id || role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Unauthorized access" },
        { status: 401 }
      );
    }
    // Fetch all contacts from the database, sorted by creation date
    const contacts = await Contact.find().sort({ createdAt: -1 });

    return NextResponse.json({ success: true, contacts }, { status: 200 });
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch contacts" },
      { status: 500 }
    );
  }
}
