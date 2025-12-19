export * from "./featureFlags";

type Config = {
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  FIREBASE_ADMIN_CREDENTIALS: string;
  FIREBASE_CLIENT_CREDENTIALS: string;
};

const config: Config = {
  NEXTAUTH_SECRET: String(process.env.AUTH_NEXT),
  NEXTAUTH_URL: String(process.env.NEXTAUTH_URL),
  FIREBASE_ADMIN_CREDENTIALS: String(process.env.FIREBASE_ADMIN_CREDENTIALS),
  FIREBASE_CLIENT_CREDENTIALS: String(process.env.FIREBASE_CLIENT_CREDENTIALS),
};

export default config;
