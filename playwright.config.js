const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config();

const hasZohoCreds = Boolean(process.env.ZOHO_EMAIL && process.env.ZOHO_PASSWORD);

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 60_000,
  retries: 0,
  use: {
    baseURL: "https://www.zoho.com",
    trace: "on",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    ...(hasZohoCreds
      ? [
          // Run this first to generate .auth/storageState.json.
          // Use: npx playwright test --project=setup --headed
          {
            name: "setup",
            testMatch: /.*\.setup\.js/,
            use: {
              ...devices["Desktop Chrome"],
              storageState: undefined,
            },
          },
          // Authenticated runs (requires setup to have produced .auth/storageState.json).
          {
            name: "chromium-auth",
            dependencies: ["setup"],
            use: {
              ...devices["Desktop Chrome"],
              storageState: ".auth/storageState.json",
            },
          },
        ]
      : []),
  ],
});
