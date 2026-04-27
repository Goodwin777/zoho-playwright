const { test, expect } = require("@playwright/test");
const { ZohoSignupPage } = require("../pages/ZohoSignupPage");
const {
  generateZohoUser,
  resolveZohoUserFromEnv,
} = require("../utils/zohoUserFactory");

test.describe("Zoho CRM signup flow", () => {
  test("should fill signup form and stop on captcha or OTP step", async ({
    page,
  }) => {
    const signupPage = new ZohoSignupPage(page);

    await signupPage.open();

    const generated = generateZohoUser({
      prefix: "rnd.user",
      displayPrefix: "RND User",
    });
    const user = resolveZohoUserFromEnv(generated);

    await signupPage.fillSignupForm(user);
    await signupPage.assertFilled(user);

    await signupPage.acceptTerms();
    await signupPage.submit();

    const securityState = await signupPage.getSecurityValidationState();
    console.log("R&D RESULT:", securityState);

    expect(securityState.captchaExists > 0 || securityState.otpVisible).toBeTruthy();

    test.info().annotations.push({
      type: "R&D result",
      description:
        "Zoho signup automation reached security validation layer. Captcha exists but can be hidden/disabled depending on Zoho anti-bot flow.",
    });

  });
});
