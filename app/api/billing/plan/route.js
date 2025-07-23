import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Brand from "@/models/Brand";
import Plan from "@/models/Plan";
import PaymentInfo from "@/models/PaymentInfo";
import AuthUtils from "@/lib/authUtils";

export async function GET(request) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(request);
    if (!userInfo) {
      return NextResponse.json(
        { error: "You must be logged in to view plans" },
        { status: 401 }
      );
    }
    const { id: userId } = userInfo;
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to view plans" },
        { status: 401 }
      );
    }

    const brand = await Brand.findOne({ user: userId }).populate(
      "subscription.planId"
    );
    const paymentInfo = await PaymentInfo.findOne({ userId }).select(
      "firstName lastName phoneNumber"
    );
    const availablePlans = await Plan.find().lean();

    let currentPlan = null;
    let subscriptionStatus = "none";
    let expiresAt = null;

    if (brand?.subscription?.planId) {
      currentPlan = brand.subscription.planId;
      expiresAt = brand.subscription.expiresAt;
      subscriptionStatus = brand.subscription.status;

      // Check if plan is expired based on expiresAt
      if (
        subscriptionStatus === "active" &&
        expiresAt &&
        new Date(expiresAt) <= new Date()
      ) {
        subscriptionStatus = "expired";
        // Update status in database
        await Brand.updateOne(
          { _id: brand._id },
          { "subscription.status": "expired" }
        );
      }
    }

    return NextResponse.json(
      {
        currentPlan,
        subscriptionStatus, // "active", "expired", "canceled", or "none"
        expiresAt,
        availablePlans,
        paymentInfo: {
          firstName: paymentInfo?.firstName || "",
          lastName: paymentInfo?.lastName || "",
          phoneNumber: paymentInfo?.phoneNumber || "",
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Plan fetch error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(request);
    if (!userInfo) {
      return NextResponse.json(
        { error: "You must be logged in to change plans" },
        { status: 401 }
      );
    }

    const { id: userId, role } = userInfo;
    if (!userId) {
      return NextResponse.json(
        { error: "You must be logged in to change plans" },
        { status: 401 }
      );
    }
    if (role !== "brand") {
      return NextResponse.json(
        { error: "You do not have permission to change plans" },
        { status: 403 }
      );
    }
    const { planId } = await request.json();
    if (!planId) {
      return NextResponse.json(
        { error: "Plan ID is required" },
        { status: 400 }
      );
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const brand = await Brand.findOne({ user: userId });
    if (!brand) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    // Allow plan change if subscription is expired, canceled, or different plan
    if (
      brand.subscription?.planId?.toString() === planId &&
      brand.subscription?.status === "active" &&
      (!brand.subscription.expiresAt ||
        new Date(brand.subscription.expiresAt) > new Date())
    ) {
      return NextResponse.json(
        { error: "Already subscribed to this active plan" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { initiatePayment: true, planId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Plan update error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
