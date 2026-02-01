import { NextRequest, NextResponse } from "next/server";
import { forgetPassword } from "@/lib/auth";
import { getAuth } from "@/lib/firebase";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }
    const auth = await getAuth();
    const result = await forgetPassword(auth, email);

    if (result.success) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json(
        { success: false, error: "Failed to send reset email" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Forgot password API error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
