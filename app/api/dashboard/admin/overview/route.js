import dbConnect from "@/config/database";
import User from "@/models/User";
import Campaign from "@/models/Campaign";
import Invoice from "@/models/Invoice";
import Brand from "@/models/Brand";
import Article from "@/models/Magazine";
import AuthUtils from "@/lib/authUtils";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    await dbConnect();

    const { userInfo } = await AuthUtils.validateRequest(req);
    const { role } = userInfo || {};

    if (role !== "admin") {
      return NextResponse.json(
        { error: "Access denied: Admins only" },
        { status: 403 }
      );
    }

    // --- Stats ---
    const totalUsers = await User.countDocuments();
    const totalCampaigns = await Campaign.countDocuments();
    const totalMagazine = await Article.countDocuments();
    const totalRevenue = await Invoice.aggregate([
      { $match: { status: "success" } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const stats = [
      {
        title: "Total Users",
        value: totalUsers,
        icon: "FiUsers",
      },
      {
        title: "Total Jobs",
        value: totalCampaigns,
        icon: "FiBriefcase",
      },
      {
        title: "Total Revenue",
        value: "ETB " + (totalRevenue[0]?.total?.toLocaleString() || "0"),
        icon: "FiDollarSign",
      },
      {
        title: "Total Magazine",
        value: totalMagazine,
        icon: "FiFileText",
      },
    ];

    // --- Functional Recent Activities ---
    const recentUsers = await User.find().sort({ createdAt: -1 }).limit(3);
    const recentCampaigns = await Campaign.find()
      .populate("brand")
      .sort({ createdAt: -1 })
      .limit(3);
    const recentInvoices = await Invoice.find({ status: "success" })
      .populate("userId")
      .sort({ createdAt: -1 })
      .limit(3);
    const recentArticles = await Article.find()
      .sort({ createdAt: -1 })
      .limit(3);

    // Merge activities with normalized format
    const activityLog = [
      ...recentUsers.map((user) => ({
        id: user._id,
        user: user.email || "Unknown User",
        action: "signed up.",
        time: user.createdAt.toLocaleString(),
      })),
      ...recentCampaigns.map((c) => ({
        id: c._id,
        user: c.brand?.companyName || "A brand",
        action: `posted a campaign: ${c.title}`,
        time: c.createdAt.toLocaleString(),
      })),
      ...recentInvoices.map((i) => ({
        id: i._id,
        user: i.brand?.companyName || "A brand",
        action: `paid an invoice of ETB ${i.amount}`,
        time: i.createdAt?.toLocaleString(),
      })),
      ...recentArticles.map((a) => ({
        id: a._id,
        user: a.author || "Editor",
        action: `published an article: ${a.title}`,
        time: a.createdAt?.toLocaleString(),
      })),
    ];

    // Sort combined log by time descending
    const sortedActivities = activityLog
      .sort((a, b) => new Date(b.time) - new Date(a.time))
      .slice(0, 6); // Limit to last 6 items

    return NextResponse.json({ stats, recentActivities: sortedActivities });
  } catch (error) {
    console.error("Admin Overview API error:", error);
    return NextResponse.json(
      {
        error: "Failed to load admin dashboard overview",
      },
      { status: 500 }
    );
  }
}
