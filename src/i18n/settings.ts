export const defaultLanguage = "ja";
// 日本語、英語、スペイン語
export const availableLanguages = [defaultLanguage, "en", "es"];
export const namespaces = ["translation", "home", "meditation"];

export const getOptions = (lng = defaultLanguage) => ({
  lng,
  defaultNS: defaultLanguage,
  fallbackLng: defaultLanguage,
  fallbackNS: namespaces[0],
  ns: namespaces,
  supportedLngs: availableLanguages,
});
