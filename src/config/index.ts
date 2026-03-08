export * from "./featureFlags";

type Config = {
  NEXTAUTH_SECRET: string;
  NEXTAUTH_URL: string;
  FIREBASE_ADMIN_CREDENTIALS: string;
  FIREBASE_CLIENT_CREDENTIALS: string;
  RESEND_API_KEY: string;
  EMAIL_FROM: string;
  ROOT_USER_EMAIL: string;
  ANTHROPIC_API_KEY: string;
  CRON_SECRET: string;
};

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const config: Config = {
  NEXTAUTH_SECRET: String(process.env.NEXTAUTH_SECRET),
  NEXTAUTH_URL: String(process.env.NEXTAUTH_URL),
  FIREBASE_ADMIN_CREDENTIALS: String(process.env.FIREBASE_ADMIN_CREDENTIALS),
  FIREBASE_CLIENT_CREDENTIALS: String(process.env.FIREBASE_CLIENT_CREDENTIALS),
  RESEND_API_KEY: String(process.env.RESEND_API_KEY),
  EMAIL_FROM: String(process.env.EMAIL_FROM || "onboarding@resend.dev"),
  ROOT_USER_EMAIL: String(process.env.ROOT_USER_EMAIL),
  ANTHROPIC_API_KEY: requireEnv("ANTHROPIC_API_KEY"),
  CRON_SECRET: requireEnv("CRON_SECRET"),
};

export default config;
