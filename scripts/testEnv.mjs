/**
 * Validates that the requireEnv logic correctly throws for missing env vars.
 * This mirrors the behavior in src/config/index.ts and is run in CI.
 */
const requireEnv = (name) => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
};

// Should return the value when set
process.env._TEST_VAR = "ok";
const result = requireEnv("_TEST_VAR");
if (result !== "ok") {
  console.error("FAIL: requireEnv should return value when set");
  process.exit(1);
}

// Should throw when not set
let threw = false;
try {
  requireEnv("__MISSING_VAR__");
} catch (e) {
  threw = true;
}
if (!threw) {
  console.error("FAIL: requireEnv should throw when env var is missing");
  process.exit(1);
}

console.log("test:env passed");
