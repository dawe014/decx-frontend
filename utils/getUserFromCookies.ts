import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function getUserFromCookies() {
  const cookieStore = await cookies(); // ✅ This is synchronous in route handlers
  const token = cookieStore.get("accessToken")?.value;

  if (!token) {
    throw new Error("Access token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded; // { userId, role, iat, exp }
  } catch (error) {
    throw new Error("Invalid or expired access token");
  }
}
