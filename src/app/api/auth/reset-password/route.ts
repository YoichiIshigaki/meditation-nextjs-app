import { NextRequest, NextResponse } from "next/server";
import { confirmPasswordReset } from "firebase/auth";
import { getAuth } from "@/lib/firebase";
import { resetPasswordSchema } from "@/schema/resetPassword";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // バリデーション
    const validation = resetPasswordSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 },
      );
    }

    const { oobCode, newPassword } = validation.data;

    // Firebase Client SDKでパスワードリセットを確定
    const auth = await getAuth();
    await confirmPasswordReset(auth, oobCode, newPassword);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Reset password API error:", error);

    const firebaseError = error as { code?: string };

    if (firebaseError.code === "auth/invalid-action-code") {
      return NextResponse.json(
        { success: false, error: "Invalid or expired reset link" },
        { status: 400 },
      );
    }

    if (firebaseError.code === "auth/expired-action-code") {
      return NextResponse.json(
        { success: false, error: "Reset link has expired" },
        { status: 400 },
      );
    }

    if (firebaseError.code === "auth/weak-password") {
      return NextResponse.json(
        { success: false, error: "Password is too weak" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to reset password" },
      { status: 500 },
    );
  }
}
