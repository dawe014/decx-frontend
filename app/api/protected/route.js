import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Brand from "@/models/Brand";
import { isSubscriptionActive } from "@/utils/checkSubscription";
import AuthUtils from "@/lib/authUtils";

export async function GET(req) {
  try {
    await connectDB();

    const { userInfo } = await AuthUtils.validateRequest(req);
    const { id: userId } = userInfo;

    const brand = await Brand.findOne({ user: userId }).populate(
      "subscription.planId"
    );

    if (!brand || !isSubscriptionActive(brand.subscription)) {
      return NextResponse.json(
        { error: "Subscription expired or not found." },
        { status: 403 }
      );
    }

    // ✅ Access allowed
    return NextResponse.json({ message: "Access granted." });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
