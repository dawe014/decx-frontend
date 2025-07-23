// /api/auth/logout/route.js
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const cookieStore = await cookies();

    // Clear the access and refresh tokens
    cookieStore.set("accessToken", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    cookieStore.set("refreshToken", "", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 0,
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout Error:", error);
    return new NextResponse(
      JSON.stringify({
        success: false,
        message: "An error occurred during logout",
      }),
      { status: 500 }
    );
  }
}
