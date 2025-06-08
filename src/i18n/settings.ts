export const defaultLanguage = "ja";
// 日本語、英語、スペイン語
export const availableLanguages = [defaultLanguage, "en", "es"] as const;
export const namespaces = [
  "translation",
  "home",
  "meditation",
  "login",
  "validation"
] as const;

export type Language = typeof availableLanguages[number]

export const getOptions = (lng = defaultLanguage) => ({
  lng,
  defaultNS: defaultLanguage,
  fallbackLng: defaultLanguage,
  fallbackNS: namespaces[0],
  ns: namespaces,
  supportedLngs: availableLanguages,
});
