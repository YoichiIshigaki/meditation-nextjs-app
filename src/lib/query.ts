import type { NextRequest } from "next/server"
const validNumberParams = ["limit", "offset"] as const;

type NumberKey = typeof validNumberParams[number];

export const parseParams = (req: NextRequest) => {
  const raw = Object.fromEntries(req.nextUrl.searchParams);
  return Object.fromEntries(
    Object.entries(raw).map(([key, value]) =>
      validNumberParams.includes(key as NumberKey)
        ? [key, Number(value)]
        : [key, value]
    )
  ) as { [K in string]: K extends NumberKey ? number : string };
}