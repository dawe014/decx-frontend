import { NextResponse } from "next/server";
import connectDB from "@/config/database";
import Invoice from "@/models/Invoice";
import axios from "axios";

export async function GET(request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const txRef = searchParams.get("txRef");

    if (!txRef) {
      return NextResponse.json(
        { error: "Transaction reference is required" },
        { status: 400 }
      );
    }

    const response = await axios.get(
      `https://api.chapa.co/v1/transaction/verify/${txRef}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.CHAPA_SECRET_KEY}`,
        },
      }
    );

    const invoice = await Invoice.findOneAndUpdate(
      { invoiceId: txRef },
      { status: response.data.status.toLowerCase() },
      { new: true }
    );

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    console.error("Verify error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: "Failed to verify transaction" },
      { status: 500 }
    );
  }
}
