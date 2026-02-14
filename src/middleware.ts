import { NextRequest, NextResponse } from "next/server";

import { i18nMiddleware } from "./middlewares/i18nMiddleware";
import { loggerMiddleware } from "./middlewares/loggerMiddleware";
import { authMiddleware } from "./middlewares/authMiddleware";

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: [
    // リクエストを受け付ける静的コンテンツの拡張子 動的な変数は受け付けない。
    `/((?!api|_next/static|_next/image|favicon.ico$|.*\\.png|.*\\.jpg|.*\\.mp3|.*\\.mp4).*)`,
  ],
};

type MiddlewareFunction = (
  req: NextRequest,
  res: NextResponse,
) => Promise<NextResponse> | NextResponse;

type CheckMiddlewareFunction = (
  request: NextRequest,
  response: NextResponse,
) => (...middlewares: MiddlewareFunction[]) => Promise<NextResponse<unknown>>;

const checkMiddleware: CheckMiddlewareFunction = (
  request: NextRequest,
  response: NextResponse,
) => {
  return async (...middlewares: MiddlewareFunction[]) => {
    for (const middleware of middlewares) {
      const res = await middleware(request, response);
      if (res?.redirected || res?.status !== 200) return res;
    }
    return response;
  };
};

export const middleware = async (request: NextRequest) => {
  const response = NextResponse.next();
  return await checkMiddleware(request, response)(
    i18nMiddleware,
    loggerMiddleware,
    authMiddleware,
  );
};
