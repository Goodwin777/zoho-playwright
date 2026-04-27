class ZohoSignupPage {
  constructor(page) {
    this.page = page;

    this.nameInput = page.getByRole("textbox", { name: "Enter your name" });
    this.emailInput = page.getByRole("textbox", { name: "Enter your email" });
    this.passwordInput = page.getByRole("textbox", { name: /Enter password/i });
    this.phoneInput = page.getByRole("textbox", {
      name: "Enter your phone number",
    });

    this.termsCheckbox = page.getByText("I agree to the Terms of");
    this.getStartedButton = page.getByRole("button", { name: "Get started" });
  }

  async open() {
    await this.page.goto("/crm/signup.html");
  }

  async fillSignupForm({ name, email, password, phone }) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.phoneInput.fill(phone);
  }

  async assertFilled({ name, email, password, phone }) {
    await this.nameInput.waitFor({ state: "visible" });
    await this.emailInput.waitFor({ state: "visible" });
    await this.passwordInput.waitFor({ state: "visible" });
    await this.phoneInput.waitFor({ state: "visible" });

    const [n, e, p, ph] = await Promise.all([
      this.nameInput.inputValue(),
      this.emailInput.inputValue(),
      this.passwordInput.inputValue(),
      this.phoneInput.inputValue(),
    ]);

    if (n !== name || e !== email || p !== password || ph !== phone) {
      throw new Error("Signup form values do not match expected input.");
    }
  }

  async acceptTerms() {
    await this.termsCheckbox.click();
  }

  async submit() {
    await this.getStartedButton.click();

    // "networkidle" is flaky for Zoho due to long-polling/analytics in CI.
    // We instead wait for a meaningful post-submit state.
    const captcha = this.page.locator('input[name="captcha"]');
    const otp = this.page.getByRole("textbox", { name: /Enter OTP/i });

    await Promise.race([
      captcha.first().waitFor({ state: "visible", timeout: 15_000 }).catch(() => null),
      otp.waitFor({ state: "visible", timeout: 15_000 }).catch(() => null),
      this.page
        .waitForURL(/.*(captcha|otp|verify|signin|crm).*/i, { timeout: 15_000 })
        .catch(() => null),
      this.page.waitForLoadState("domcontentloaded", { timeout: 15_000 }).catch(() => null),
    ]);
  }

  async getSecurityValidationState() {
    const captcha = this.page.locator('input[name="captcha"]');
    const otp = this.page.getByRole("textbox", { name: /Enter OTP/i });

    const captchaExists = await captcha.count();
    const captchaVisible =
      captchaExists > 0 && (await captcha.first().isVisible());
    const otpVisible = await otp.isVisible().catch(() => false);

    return {
      captchaExists,
      captchaVisible,
      otpVisible,
      currentUrl: this.page.url(),
    };
  }
}

module.exports = { ZohoSignupPage };