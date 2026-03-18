import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: [
    "src/app/**/{page,layout,route,not-found,error,loading,template}.{ts,tsx}",
    "src/middleware.ts",
    "src/app/api/**/*.ts",
  ],
  project: ["src/**/*.{ts,tsx}"],
  ignore: [
    // i18next は動的ロードのため静的解析では検出不可
    "src/i18n/locales/**",
    // スクリプト類
    "scripts/**",
  ],
  ignoreDependencies: [
    // postcss は設定ファイルから動的に使用
    "postcss-load-config",
  ],
};

export default config;
