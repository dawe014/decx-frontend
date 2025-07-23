import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Invoice from "@/models/Invoice";
import AuthUtils from "@/lib/authUtils";

export async function GET(request) {
  try {
    await connectDB();
    const { userInfo } = await AuthUtils.validateRequest(request);
    const { id: userId } = userInfo;

    const invoices = await Invoice.find({ userId }).sort({ createdAt: -1 });

    return NextResponse.json(invoices, { status: 200 });
  } catch (error) {
    console.error("Invoices error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
