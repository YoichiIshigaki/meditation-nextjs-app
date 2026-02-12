import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";

/**
 * サーバーサイドでセッションを削除するAPI
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "セッションが見つかりません" },
        { status: 404 },
      );
    }

    // セッションを削除するためのレスポンスを作成
    const response = NextResponse.json(
      { success: true, message: "セッションが削除されました" },
      { status: 200 },
    );

    // セッションクッキーを削除
    response.cookies.delete("next-auth.session-token");
    response.cookies.delete("__Secure-next-auth.session-token");
    response.cookies.delete("next-auth.csrf-token");
    response.cookies.delete("__Host-next-auth.csrf-token");
    response.cookies.delete("next-auth.callback-url");
    response.cookies.delete("__Secure-next-auth.callback-url");

    return response;
  } catch (error) {
    console.error("サーバーサイドセッション削除エラー:", error);
    return NextResponse.json(
      { success: false, message: "セッション削除に失敗しました" },
      { status: 500 },
    );
  }
}

/**
 * セッション情報を取得するAPI
 */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    return NextResponse.json({
      success: true,
      session: session
        ? {
          user: session.user,
          expires: session.expires,
        }
        : null,
    });
  } catch (error) {
    console.error("セッション取得エラー:", error);
    return NextResponse.json(
      { success: false, message: "セッション取得に失敗しました" },
      { status: 500 },
    );
  }
}
