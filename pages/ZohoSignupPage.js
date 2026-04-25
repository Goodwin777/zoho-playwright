const { test, expect } = require("@playwright/test");
const { ZohoSignupPage } = require("../pages/ZohoSignupPage");

test.describe("Zoho CRM signup flow", () => {
  test("should fill signup form and stop on captcha or OTP step", async ({
    page,
  }) => {
    const signupPage = new ZohoSignupPage(page);

    await signupPage.open();

    await signupPage.fillSignupForm({
      name: process.env.ZOHO_NAME || "RND Test User",
      email: process.env.ZOHO_EMAIL || "",
      password: process.env.ZOHO_PASSWORD || "",
      phone: process.env.ZOHO_PHONE || "",
    });

    await signupPage.acceptTerms();
    await signupPage.submit();

    const securityState = await signupPage.getSecurityValidationState();

    console.log("R&D RESULT:", securityState);

    expect(
      securityState.captchaExists > 0 || securityState.otpVisible,
    ).toBeTruthy();

    test.info().annotations.push({
      type: "R&D result",
      description:
        "Zoho signup automation reached security validation layer. Captcha exists but can be hidden/disabled depending on Zoho anti-bot flow.",
    });
  });
});