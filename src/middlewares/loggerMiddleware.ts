import { type NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const loggerMiddleware = (req: NextRequest, _: NextResponse) => {
  logger.info(`${req.method} ${req.nextUrl.pathname}`);
  return NextResponse.next();
};
