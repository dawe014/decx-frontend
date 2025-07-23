// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { getToken } from "next-auth/jwt";
const secret = process.env.NEXTAUTH_SECRET;
export async function middleware(req: NextRequest) {
  try {
    const token = await getToken({ req, secret });

    if (!token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    console.log("Access token from middleware as", !token);

    // You can attach user data to request here if needed
    console.log(token);
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid or expired access token", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Protect these paths
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/create-profile/:path*",
    "/settings/:path*",
    "/profile/:path*",
    "/messages/:path*",
    "/post-need/:path*",
  ],
};
