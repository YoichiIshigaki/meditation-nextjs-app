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
  GEMINI_API_KEY: string;
  CRON_SECRET: string;
};

const requireEnv = (name: string, defaultValue?: string): string => {
  const value = process.env[name];
  if (!value) {
    if (defaultValue !== undefined) {
      return defaultValue;
    }
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

const config: Config = {
  NEXTAUTH_SECRET: requireEnv("NEXTAUTH_SECRET"),
  NEXTAUTH_URL: requireEnv("NEXTAUTH_URL"),
  FIREBASE_ADMIN_CREDENTIALS: requireEnv("FIREBASE_ADMIN_CREDENTIALS"),
  FIREBASE_CLIENT_CREDENTIALS: requireEnv("FIREBASE_CLIENT_CREDENTIALS"),
  RESEND_API_KEY: requireEnv("RESEND_API_KEY"),
  EMAIL_FROM: requireEnv("EMAIL_FROM", "onboarding@resend.dev"),
  ROOT_USER_EMAIL: requireEnv("ROOT_USER_EMAIL", ""),
  ANTHROPIC_API_KEY: requireEnv("ANTHROPIC_API_KEY", ""),
  GEMINI_API_KEY: requireEnv("GEMINI_API_KEY", ""),
  CRON_SECRET: requireEnv("CRON_SECRET", ""),
};

export default config;
