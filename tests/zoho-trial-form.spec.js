const { test, expect } = require("@playwright/test");
const { ZohoCrmPage } = require("../pages/ZohoCrmPage");
const { ZohoTrialSignupPage } = require("../pages/ZohoTrialSignupPage");
const {
  generateZohoUser,
  resolveZohoUserFromEnv,
} = require("../utils/zohoUserFactory");

test.describe("Zoho CRM trial (public) form", () => {
  test("should open trial form and fill it", async ({ page }) => {
    const crmPage = new ZohoCrmPage(page);
    const trialPage = new ZohoTrialSignupPage(page);

    await crmPage.open();
    await crmPage.openTrialSignup();

    await expect(page).toHaveURL(/.*(signup|trial|crm).*/i);

    const generated = generateZohoUser({
      prefix: "trial.user",
      displayPrefix: "Trial User",
    });
    const user = resolveZohoUserFromEnv(generated);

    await trialPage.fill(user);
    await trialPage.assertFilled(user);

    await trialPage.acceptTerms();
    await trialPage.submit();

    const securityState = await trialPage.getSecurityValidationState();
    console.log("TRIAL RESULT:", securityState);

    expect(
      securityState.captchaExists > 0 || securityState.otpVisible,
    ).toBeTruthy();
  });
});

