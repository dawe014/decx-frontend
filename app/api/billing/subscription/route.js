import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Brand from "@/models/Brand";
import Plan from "@/models/Plan";
import Invoice from "@/models/Invoice";
import SubscriptionHistory from "@/models/SubscriptionHistory";
import AuthUtils from "@/lib/authUtils";

export async function POST(request) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(request);
    const { id: userId } = userInfo;

    const { planId, txRef } = await request.json();

    const plan = await Plan.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const invoice = await Invoice.findOne({ invoiceId: txRef, userId });
    if (!invoice || invoice.status !== "success") {
      return NextResponse.json(
        { error: "Invalid or pending transaction" },
        { status: 400 }
      );
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setMonth(expiresAt.getMonth() + 1);

    const brand = await Brand.findOneAndUpdate(
      { user: userId },
      {
        subscription: {
          planId: plan._id,
          startedAt,
          expiresAt,
          status: "active",
        },
      },
      { new: true }
    ).populate("subscription.planId");

    const latestSubscription = await SubscriptionHistory.findOne({
      user: userId,
    })
      .sort({ changedAt: -1 })
      .lean();

    await SubscriptionHistory.create({
      user: userId,
      oldPlan: latestSubscription ? latestSubscription.newPlan : null,
      newPlan: planId,
      action: latestSubscription ? "upgrade" : "initial",
      changedAt: new Date(),
    });

    return NextResponse.json(
      { success: true, brand, plan: brand.subscription.planId },
      { status: 200 }
    );
  } catch (error) {
    console.error("Subscription update error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
