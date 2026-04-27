const { defineConfig, devices } = require("@playwright/test");
require("dotenv").config();

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
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
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
  ],
});
