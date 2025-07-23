import { NextResponse } from "next/server";
import dbConnect from "@/config/database";
import Influencer from "@/models/Influencer";
import Brand from "@/models/Brand";
import User from "@/models/User";

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = await params;
  if (!id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }
  const user = await User.findById(id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const { role } = user;

  if (role === "admin") {
    return NextResponse.json({ redirect: "/dashboard/admin" });
  }

  if (role === "influencer") {
    const existingInfluencer = await Influencer.findOne({ user: id });
    if (existingInfluencer) {
      return NextResponse.json({
        redirect: `/jobs`,
      });
    } else {
      return NextResponse.json({ redirect: "/create-profile/step-1" });
    }
  }

  if (role === "brand") {
    const existingBrand = await Brand.findOne({ user: id });
    if (existingBrand) {
      return NextResponse.json({ redirect: `/dashboard/brand-owner` });
    } else {
      return NextResponse.json({ redirect: "/brand/profile" });
    }
  }

  return NextResponse.json({ redirect: "/login" });
}
