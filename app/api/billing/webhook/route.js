import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Invoice from "@/models/Invoice";

export async function POST(request) {
  try {
    await connectDB();
    const { tx_ref, status } = await request.json();

    if (!tx_ref || !status) {
      return NextResponse.json(
        { error: "Missing tx_ref or status" },
        { status: 400 }
      );
    }

    const invoice = await Invoice.findOneAndUpdate(
      { invoiceId: tx_ref },
      { status: status.toLowerCase() },
      { new: true }
    );

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Webhook processed" }, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error.message);
    return NextResponse.json(
      { error: "Failed to process webhook" },
      { status: 500 }
    );
  }
}
