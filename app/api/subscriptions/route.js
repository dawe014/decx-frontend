import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Brand from "@/models/Brand";
import Plan from "@/models/Plan";
import AuthUtils from "@/lib/authUtils";

export async function POST(request) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(request);
    const { id: userId } = userInfo;

    const { planId } = await request.json();

    const plan = await Plan.findById(planId);
    if (!plan) {
      return NextResponse.json({ error: "Plan not found" }, { status: 404 });
    }

    const startedAt = new Date();
    const expiresAt = new Date(startedAt);
    expiresAt.setMonth(expiresAt.getMonth() + 1); // Add 1 month

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
    );

    return NextResponse.json({ success: true, brand }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
