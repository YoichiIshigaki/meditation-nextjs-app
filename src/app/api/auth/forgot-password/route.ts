import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { sendPasswordResetEmail } from "@/infra/email";
import config from "@/config";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, language = "ja" } = body;

    if (!email) {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 },
      );
    }

    // Firebase Admin SDKでパスワードリセットリンクを生成
    const adminAuth = await getAdminAuth();
    const firebaseResetLink = await adminAuth.generatePasswordResetLink(email);

    // FirebaseのリンクからoobCodeを抽出
    const url = new URL(firebaseResetLink);
    const oobCode = url.searchParams.get("oobCode");

    if (!oobCode) {
      throw new Error("Failed to generate reset code");
    }

    // アプリのパスワード再設定画面のリンクを生成
    const appResetLink = `${config.NEXTAUTH_URL}/${language}/reset-password?oobCode=${oobCode}`;

    // Resendでメール送信
    await sendPasswordResetEmail(email, appResetLink);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Forgot password API error:", error);

    const firebaseError = error as { code?: string };

    // ユーザーが見つからない場合もセキュリティのため成功を返す
    if (firebaseError.code === "auth/user-not-found") {
      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { success: false, error: "Failed to send reset email" },
      { status: 500 },
    );
  }
}
