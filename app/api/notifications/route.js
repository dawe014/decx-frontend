import dbConnect from "@/config/database";
import Notification from "@/models/Notification";
import AuthUtils from "@/lib/authUtils"; // Utility to get user info from request

export async function GET() {
  await dbConnect;
  const { userInfo } = await AuthUtils.validateRequest(req);
  const { id } = userInfo;
  if (!id) return new Response("Unauthorized", { status: 401 });

  await connectMongoDB();
  const notifications = await Notification.find({ user: id })
    .populate("thread")
    .sort({ timestamp: -1 });
  return new Response(JSON.stringify(notifications), { status: 200 });
}
