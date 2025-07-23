import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Invoice from "@/models/Invoice";
import Plan from "@/models/Plan";
import Brand from "@/models/Brand";
import PaymentInfo from "@/models/PaymentInfo"; // Adjust path
import AuthUtils from "@/lib/authUtils";
import axios from "axios";

export async function POST(request) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(request);
    const { id: userId, role, email } = userInfo;

    if (role !== "brand") {
      return NextResponse.json(
        { error: "Unauthorized access" },
        { status: 403 }
      );
    }
    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { planId, firstName, lastName, phoneNumber } = await request.json();
    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }
    if (!firstName) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 }
      );
    }
    if (!lastName) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 }
      );
    }
    if (!phoneNumber) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 }
      );
    }

    const brand = await Brand.findOne({ user: userId }).select("subscription");
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    if (planId === brand.subscription?.planId?.toString()) {
      return NextResponse.json(
        { error: "You are already subscribed to this plan" },
        { status: 400 }
      );
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    // Save or update PaymentInfo
    await PaymentInfo.findOneAndUpdate(
      { userId },
      {
        $set: {
          firstName,
          lastName,
          phoneNumber,
        },
      },
      { upsert: true, new: true }
    );

    // Use provided data for payment
    const paymentFirstName = firstName;
    const paymentLastName = lastName;
    const paymentPhoneNumber = phoneNumber;

    const txRef = `tx-${Date.now()}-${userId}`;
    const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/billing/success?tx_ref=${txRef}&plan_id=${planId}`;

    const response = await axios.post(
      "https://api.chapa.co/v1/transaction/initialize",
      {
        amount: plan.price,
        currency: "ETB",
        email: email || "user@example.com",
        first_name: paymentFirstName,
        last_name: paymentLastName,
        phone_number: paymentPhoneNumber,
        tx_ref: txRef,
        callback_url: `${process.env.NEXT_PUBLIC_API_URL}/api/billing/webhook`,
        return_url: redirectUrl,
        customization: {
          title: `${plan.name}`,
          description: `Complete payment for the ${plan.name}.`,
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    await Invoice.create({
      userId,
      invoiceId: txRef,
      firstName: paymentFirstName,
      lastName: paymentLastName,
      email: email || "user@example.com",
      phoneNumber: paymentPhoneNumber,
      amount: plan.price,
      status: "initialized",
    });

    return NextResponse.json(
      { checkoutUrl: response.data.data.checkout_url },
      { status: 200 }
    );
  } catch (error) {
    console.error("Initialize error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to initialize payment" },
      { status: 500 }
    );
  }
}
