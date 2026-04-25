const { test, expect } = require("@playwright/test");

test.describe("Zoho CRM signup flow", () => {
  test("should fill signup form and stop on captcha or OTP step", async ({
    page,
  }) => {
    await page.goto("/crm/signup.html");

    await page
      .getByRole("textbox", { name: "Enter your name" })
      .fill(process.env.ZOHO_NAME || "RND Test User");

    await page
      .getByRole("textbox", { name: "Enter your email" })
      .fill(process.env.ZOHO_EMAIL || "");

    await page
      .getByRole("textbox", { name: /Enter password/i })
      .fill(process.env.ZOHO_PASSWORD || "");

    await page
      .getByRole("textbox", { name: "Enter your phone number" })
      .fill(process.env.ZOHO_PHONE || "");

    await page.getByText("I agree to the Terms of").click();

    await page.getByRole("button", { name: "Get started" }).click();

    await page.waitForLoadState("networkidle");

    const captcha = page.locator('input[name="captcha"]');
    const otp = page.getByRole("textbox", { name: /Enter OTP/i });

    const captchaExists = await captcha.count();
    const captchaVisible =
      captchaExists > 0 && (await captcha.first().isVisible());
    const otpVisible = await otp.isVisible().catch(() => false);

    console.log("R&D RESULT:", {
      captchaExists,
      captchaVisible,
      otpVisible,
      currentUrl: page.url(),
    });

    expect(captchaExists > 0 || otpVisible).toBeTruthy();

    test.info().annotations.push({
      type: "R&D result",
      description:
        "Zoho signup automation reached security validation layer. Captcha exists but can be hidden/disabled depending on Zoho anti-bot flow.",
    });

  });
});
