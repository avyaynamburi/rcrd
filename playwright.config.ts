import { defineConfig, devices } from "@playwright/test";
export default defineConfig({
  testDir: "./tests/e2e",
  testMatch:
    process.env.RCRD_LIVE_AUTH === "1"
      ? "**/auth.live.spec.ts"
      : "**/*.spec.ts",
  testIgnore: process.env.RCRD_LIVE_AUTH === "1" ? [] : ["**/*.live.spec.ts"],
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.RCRD_LIVE_AUTH === "1" ? 0 : process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: "http://127.0.0.1:3000",
    trace: "retain-on-failure",
    viewport: { width: 1366, height: 768 },
  },
  projects: [
    {
      name: "chrome",
      use: {
        ...devices["Desktop Chrome"],
        channel: "chrome",
        viewport: { width: 1366, height: 768 },
      },
    },
    {
      name: "edge",
      use: {
        ...devices["Desktop Edge"],
        channel: "msedge",
        viewport: { width: 1366, height: 768 },
      },
    },
  ],
  webServer: {
    command: "npm run build && npm run start -- --hostname 127.0.0.1",
    url: "http://127.0.0.1:3000",
    reuseExistingServer: false,
    timeout: 180000,
  },
});
