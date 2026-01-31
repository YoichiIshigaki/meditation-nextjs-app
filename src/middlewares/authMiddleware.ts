// middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// 認証が必要なルートをここで定義
const protectedRoutes = ["/dashboard", "/settings"];

// 認証不要の公開ルート
const publicRoutes = [
  "/login",  // ログイン画面
  "/register", // 登録画面
  "/forgot-password" // パスワード再設定画面
];

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authMiddleware = async (req: NextRequest, _: NextResponse) => {
  const { pathname } = req.nextUrl;

  // 公開ページはスキップ
  if (publicRoutes.some((path) => pathname.includes(path))) {
    return NextResponse.next();
  }

  // 保護対象でなければそのまま通す
  if (!protectedRoutes.some((path) => pathname.includes(path))) {
    return NextResponse.next();
  }

  // 認証トークンを取得（secret は next-auth の設定と一致させる）
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  console.log("token : ", token);

  // 未認証ならログインページへリダイレクト
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname); // 元のページへ戻すため
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
};
