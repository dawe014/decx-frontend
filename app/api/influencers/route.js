import dbConnect from "@/config/database";
import Influencer from "@/models/Influencer";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;

export async function GET() {
  try {
    await dbConnect();
    const influencers = await Influencer.find()
      .populate({
        path: "user",
        match: { status: "active" }, // only populate users with active status
        select: "-password -__v -resetPasswordToken -resetPasswordExpires",
      })
      .select("-__v");
    const activeInfluencers = influencers.filter(
      (influencer) => influencer.user !== null
    );

    return NextResponse.json(
      { influencers: activeInfluencers },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const token = await getToken({ req, secret });
    const { id, role } = token;
    if (role !== "influencer") {
      NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 400 }
      );
    }
    const user = await User.findById(id);
    if (!user) {
      NextResponse.json(
        { success: false, error: "No user found for this" },
        { status: 400 }
      );
    }
    const data = await req.json();

    const saved = await Influencer.create({
      user: id,
      fullName: data.fullName,
      location: data.location,
      phone: data.phone,
      bio: data.bio,
    });

    return NextResponse.json({ success: true, data: saved });
  } catch (error) {
    console.error("Error saving step one data:", error);
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
