class ZohoTrialSignupPage {
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

  async fill({ name, email, password, phone }) {
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

    // Use inputValue to avoid any masking differences
    const [n, e, p, ph] = await Promise.all([
      this.nameInput.inputValue(),
      this.emailInput.inputValue(),
      this.passwordInput.inputValue(),
      this.phoneInput.inputValue(),
    ]);

    if (n !== name || e !== email || p !== password || ph !== phone) {
      throw new Error("Trial signup form values do not match expected input.");
    }
  }

  async acceptTerms() {
    await this.termsCheckbox.click();
  }

  async submit() {
    await this.getStartedButton.click();
    await this.page.waitForLoadState("networkidle");
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

module.exports = { ZohoTrialSignupPage };

