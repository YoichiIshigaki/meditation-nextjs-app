import { NextRequest, NextResponse } from "next/server";

import { i18nMiddleware } from './middlewares/i18nMiddleware';
import { loggerMiddleware } from './middlewares/loggerMiddleware';
import { authMiddleware } from './middlewares/authMiddleware' 

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    // リクエストを受け付ける静的コンテンツの拡張子 動的な変数は受け付けない。
    `/((?!api|_next/static|_next/image|favicon.ico$|.*\\.png|.*\\.jpg|.*\\.mp3|.*\\.mp4).*)`,
  ],
};

type MiddlewareFunction = (req: NextRequest) => Promise<NextResponse> | NextResponse;

const checkMiddleware = async (request: NextRequest, ...middlewares: MiddlewareFunction[] ) => {
  for (const middleware of middlewares) {
    const res = await middleware(request);
    if (res?.redirected) return res;
  }
  return NextResponse.next();
}

export const middleware = async (request: NextRequest) => {
  return checkMiddleware(
    request,
    i18nMiddleware,
    loggerMiddleware
  );
}
