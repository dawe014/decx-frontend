import dbConnect from "@/config/database"; // Database connection utility
import Plan from "@/models/Plan";

export async function GET() {
  await dbConnect();
  const plans = await Plan.find();
  return Response.json(plans);
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const plan = await Plan.create(body);
  return Response.json(plan);
}
