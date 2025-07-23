import { NextResponse } from "next/server";
import dbConnect from "@/config/database"; // Database connection utility
import User from "@/models/User";
import Brand from "@/models/Brand";
import Influencer from "@/models/Influencer";
import Thread from "@/models/Thread";
import Message from "@/models/Message";
import AuthUtils from "@/lib/authUtils";

export async function GET(req) {
  await dbConnect();

  const { userInfo } = await AuthUtils.validateRequest(req);
  const { id } = userInfo;
  if (!id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const threads = await Thread.find({ participants: id })
      .populate("lastMessage")
      .sort({ updatedAt: -1 });

    const userIds = Array.from(
      new Set(threads.flatMap((thread) => thread.participants.map(String)))
    );

    const users = await User.find({ _id: { $in: userIds } });

    const brands = await Brand.find({ user: { $in: userIds } });
    const influencers = await Influencer.find({ user: { $in: userIds } });

    // Build a map of userId => { name, profilePhoto }
    const userMap = {};

    users.forEach((user) => {
      const uid = user._id.toString();
      const role = user.role;

      if (role === "brand") {
        const brand = brands.find((b) => b.user.toString() === uid);
        if (brand) {
          userMap[uid] = {
            name: brand.companyName,
            profilePhoto: brand.logo,
          };
        }
      } else if (role === "influencer") {
        const influencer = influencers.find((i) => i.user.toString() === uid);
        if (influencer) {
          userMap[uid] = {
            name: influencer.fullName,
            profilePhoto: influencer.profilePhoto,
          };
        }
      } else {
        // For admin or other roles with no additional profile
        userMap[uid] = {
          name: "Admin",
          profilePhoto: null,
        };
      }
    });

    // Construct final threads with enriched participant data
    const enrichedThreads = threads.map((thread) => {
      const enrichedParticipants = thread.participants.map((userId) => {
        const idStr = userId.toString();
        return {
          _id: idStr,
          ...userMap[idStr],
        };
      });

      return {
        ...thread.toObject(),
        participants: enrichedParticipants,
      };
    });

    return NextResponse.json(enrichedThreads);
  } catch (error) {
    console.error("Error fetching threads:", error);
    return NextResponse.json(
      { error: "Failed to fetch threads" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  await dbConnect();

  const { userInfo } = await AuthUtils.validateRequest(req);
  const { id } = userInfo;

  if (!id) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { participantIds, title } = await req.json();

    // Ensure the current user is included in participants
    const participants = [...new Set([...participantIds, id])].sort();

    // Check if a thread with the same participants already exists
    const existingThread = await Thread.findOne({
      participants: { $size: participants.length, $all: participants },
    });

    if (existingThread) {
      return NextResponse.json(existingThread, { status: 200 });
    }

    // Create a new thread
    const newThread = new Thread({
      participants,
      title: title || `Chat with ${participants.length} participants`,
      isGroup: participants.length > 2,
    });

    const savedThread = await newThread.save();
    return NextResponse.json(savedThread, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create thread" },
      { status: 500 }
    );
  }
}
