import dbConnect from "@/config/database"; // Database connection utility
import PaymentMethod from "@/models/PaymentMethod";

export async function GET(req) {
  await dbConnect();
  const userId = req.nextUrl.searchParams.get("userId");
  const methods = await PaymentMethod.find({ userId });
  return Response.json(methods);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const method = await PaymentMethod.create(body);
  return Response.json(method);
}
