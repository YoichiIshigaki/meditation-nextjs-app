import { execSync } from "child_process";
import { config } from "dotenv";

config({ path: ".env.local" });

const PORT = process.env.PORT || 3000;

const secret = process.env.CRON_SECRET;
if (!secret) {
  console.error("CRON_SECRET is not set in .env.local");
  process.exit(1);
}

execSync(
  `curl -s -H "Authorization: Bearer ${secret}" http://localhost:${PORT}/api/cron/weekly-paper-digest`,
  { stdio: "inherit" },
);
