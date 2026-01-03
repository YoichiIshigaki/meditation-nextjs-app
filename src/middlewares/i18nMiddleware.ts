import { type NextRequest, NextResponse } from "next/server";
import Negotiator from "negotiator";
import { defaultLanguage, availableLanguages } from "../i18n/settings";

const getNegotiatedLanguage = (
  headers: Negotiator.Headers,
): string | undefined => {
  return new Negotiator({ headers }).language([...availableLanguages]);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const i18nMiddleware = (request: NextRequest, _: NextResponse) => {
  const headers = {
    "accept-language": request.headers.get("accept-language") ?? "",
  };
  const preferredLanguage = getNegotiatedLanguage(headers) || defaultLanguage;

  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = availableLanguages.every(
    (lang) => !pathname.startsWith(`/${lang}/`) && pathname !== `/${lang}`,
  );

  if (pathnameIsMissingLocale) {
    if (preferredLanguage !== defaultLanguage) {
      return NextResponse.redirect(
        new URL(`/${preferredLanguage}${pathname}`, request.url),
      );
    } else {
      const newPathname = `/${defaultLanguage}${pathname}`;
      return NextResponse.rewrite(new URL(newPathname, request.url));
    }
  }

  return NextResponse.next();
};
