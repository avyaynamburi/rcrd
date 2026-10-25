// CI/local synthetic-only harness. No credentials are printed or written to disk.
import { execFileSync, spawnSync } from "node:child_process";
const status = JSON.parse(
  execFileSync("npx", ["supabase", "status", "-o", "json"], {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "ignore"],
  }),
);
const result = spawnSync(
  "npx",
  ["playwright", "test", "--project=chrome", "--workers=1", "--trace=off"],
  {
    stdio: "inherit",
    env: {
      ...process.env,
      NEXT_PUBLIC_SUPABASE_URL: status.API_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: status.ANON_KEY,
      SUPABASE_SERVICE_ROLE_KEY: status.SERVICE_ROLE_KEY,
      AUTH_SITE_URL: "http://127.0.0.1:3000",
      RCRD_LIVE_AUTH: "1",
    },
  },
);
process.exit(result.status ?? 1);
