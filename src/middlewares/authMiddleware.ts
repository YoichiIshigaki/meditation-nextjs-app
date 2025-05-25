// middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// 認証が必要なルートをここで定義
const protectedRoutes = ['/dashboard', '/settings'];

export const authMiddleware = async (req: NextRequest) => {
  const { pathname } = req.nextUrl;

  // 保護対象でなければそのまま通す
  if (!protectedRoutes.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // 認証トークンを取得（secret は next-auth の設定と一致させる）
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 未認証ならログインページへリダイレクト
  if (!token) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname); // 元のページへ戻すため
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}