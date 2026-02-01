import type { InitOptions } from "i18next";

export const defaultLanguage = "ja";
// 日本語、英語、スペイン語
export const availableLanguages = [defaultLanguage, "en", "es"] as const;
export const namespaces = [
  "translation",
  "home",
  "meditation",
  "login",
  "validation",
  "forgot_password",
  "signup",
] as const;

export type Language = (typeof availableLanguages)[number];

export const getOptions = (lng = defaultLanguage): InitOptions => ({
  lng,
  fallbackLng: defaultLanguage,
  supportedLngs: availableLanguages,
  ns: namespaces,
  fallbackNS: namespaces[0],
  defaultNS: namespaces[0],
  nsSeparator: ":",
  keySeparator: ".",
});
