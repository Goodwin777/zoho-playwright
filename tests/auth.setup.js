const { test, expect } = require("@playwright/test");
const fs = require("node:fs");
const path = require("node:path");

const STORAGE_STATE_PATH = path.join(
  __dirname,
  "..",
  ".auth",
  "storageState.json",
);

test.describe("Auth setup (Zoho)", () => {
  test("login and save storageState", async ({ page, context }) => {
    test.skip(
      !process.env.ZOHO_EMAIL || !process.env.ZOHO_PASSWORD,
      "Set ZOHO_EMAIL and ZOHO_PASSWORD in .env",
    );

    // Zoho sign-in is on accounts.zoho.com (different from baseURL).
    await page.goto("https://accounts.zoho.com/signin", {
      waitUntil: "domcontentloaded",
    });

    // Step 1: email / phone / login id
    const loginId = page.locator("#login_id, input[name='login_id']");
    await expect(loginId.first()).toBeVisible({ timeout: 30_000 });
    await loginId.first().fill(process.env.ZOHO_EMAIL);

    const nextBtn = page.locator("#nextbtn, button#nextbtn, input#nextbtn");
    await nextBtn.first().click();

    // Step 2: password (may appear after "Next")
    const password = page.locator("#password, input[name='password']");
    await expect(password.first()).toBeVisible({ timeout: 30_000 });
    await password.first().fill(process.env.ZOHO_PASSWORD);

    const signinBtn = page.locator("#nextbtn, button#nextbtn, input#nextbtn");
    await signinBtn.first().click();

    // If Zoho triggers MFA / captcha, we can't complete automatically.
    // We wait a bit for redirect; if still on auth domain, fail with a clear message.
    await page.waitForTimeout(5_000);

    // Try to land in CRM after login.
    await page.goto("https://crm.zoho.com/", { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(5_000);

    const url = page.url();
    const stillAuth =
      url.includes("accounts.zoho.com") ||
      url.includes("signin") ||
      url.includes("mfa") ||
      url.includes("otp") ||
      url.includes("captcha");

    if (stillAuth) {
      await page.screenshot({ path: "test-results/auth-setup-blocked.png" });
      throw new Error(
        `Login not completed (MFA/Captcha likely). Finish login manually in a headed run and re-run setup.\nCurrent URL: ${url}`,
      );
    }

    await fs.promises.mkdir(path.dirname(STORAGE_STATE_PATH), {
      recursive: true,
    });
    await context.storageState({ path: STORAGE_STATE_PATH });
  });
});

