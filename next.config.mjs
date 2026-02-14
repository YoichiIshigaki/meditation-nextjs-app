import { config } from "dotenv";
import { resolve } from "path";

// 環境変数を取得
const customEnv = process.env.CUSTOM_ENV; // カスタム環境名（例: staging）
const isDevelopment = process.env.NODE_ENV === "development";

// Next.jsはデフォルトで環境ごとに.envファイルを読み込みますが、
// カスタム環境名（例: staging）を使いたい場合は、手動で読み込む必要があります
// 読み込み順序（優先度: 高い順）:
// 1. .env.{NODE_ENV}.local (例: .env.development.local)
// 2. .env.{NODE_ENV} (例: .env.development)
// 3. .env.{CUSTOM_ENV}.local (例: .env.staging.local) - カスタム環境がある場合
// 4. .env.{CUSTOM_ENV} (例: .env.staging) - カスタム環境がある場合
// 5. .env.local (すべての環境)
// 6. .env (デフォルト)

if (customEnv) {
  // カスタム環境がある場合のみ、手動で読み込む
  const customEnvFiles = [`.env.${customEnv}.local`, `.env.${customEnv}`];

  customEnvFiles.forEach((envFile) => {
    try {
      config({ path: resolve(process.cwd(), envFile), override: false });
    } catch (error) {
      // ファイルが存在しない場合は無視
      if (error.code !== "ENOENT") {
        console.warn(`Failed to load ${envFile}:`, error.message);
      }
    }
  });
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      ...(isDevelopment ? ["i.pinimg.com"] : []),
      "firebasestorage.googleapis.com",
    ],
    remotePatterns: [
      // テスト用のモック画像
      ...(isDevelopment
        ? [
            {
              protocol: "https",
              hostname: "picsum.photos",
              port: "",
              pathname: "/**",
            },
          ]
        : []),
      {
        // GCSのファイル
        // TODO: 将来的はCDN経由で配信したい。
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
