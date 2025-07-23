import dbConnect from "@/config/database"; // Database connection utility
import Invoice from "@/models/Invoice";

export async function GET(req) {
  await dbConnect();
  const userId = req.nextUrl.searchParams.get("userId");
  const invoices = await Invoice.find({ userId });
  return Response.json(invoices);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const invoice = await Invoice.create(body);
  return Response.json(invoice);
}
