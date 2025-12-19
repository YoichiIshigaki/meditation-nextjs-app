import { NextRequest, NextResponse } from "next/server";

import { i18nMiddleware } from "./middlewares/i18nMiddleware";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { authMiddleware } from "./middlewares/authMiddleware";

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    // リクエストを受け付ける静的コンテンツの拡張子 動的な変数は受け付けない。
    `/((?!api/auth|_next/static|_next/image|favicon.ico$|.*\\.png|.*\\.jpg|.*\\.mp3|.*\\.mp4).*)`,
  ],
};

type MiddlewareFunction = (
  req: NextRequest,
  res: NextResponse,
) => Promise<NextResponse> | NextResponse;

const checkMiddleware = async (
  request: NextRequest,
  response: NextResponse,
  ...middlewares: MiddlewareFunction[]
) => {
  for (const middleware of middlewares) {
    const res = await middleware(request, response);
    if (res?.redirected) return res;
  }
  return NextResponse.next();
};

export const middleware = async (
  request: NextRequest,
  response: NextResponse,
) => {
  return checkMiddleware(
    request,
    response,
    i18nMiddleware,
    loggerMiddleware,
    authMiddleware,
  );
};
