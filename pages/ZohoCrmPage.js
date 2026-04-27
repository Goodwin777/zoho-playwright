class ZohoCrmPage {
  constructor(page) {
    this.page = page;

    this.topNav = page.locator("header, nav").first();
    this.pricingLink = page.getByRole("link", { name: /Pricing/i }).first();

    this.demoLink = page
      .getByRole("link", { name: /Request Demo|Get a demo|Demo/i })
      .first();

    this.customersLink = page
      .getByRole("link", { name: /Customers|Customer Stories/i })
      .first();

    this.featuresLink = page.getByRole("link", { name: /Features/i }).first();

    this.resourcesLink = page
      .getByRole("link", { name: /Resources|Blog/i })
      .first();

    // Trial / signup CTAs are often "Start free trial" or "Get started"
    this.startFreeTrialLink = page
      .getByRole("link", { name: /Start\s+free\s+trial|Free\s+trial|Get\s+started/i })
      .first();
  }

  async open() {
    await this.page.goto("/crm/");
  }

  async openPricing() {
    await this.pricingLink.click();
  }

  async openDemoPage() {
    await this.demoLink.click();
  }

  async openCustomersPage() {
    const link = this.page.getByRole("link", {
      name: /Customers|Customer Stories/i,
    });

    if ((await link.count()) > 0) {
      await link.first().click();
    } else {
      console.log("Customers link not found - skipping");
    }
  }
  async openFeaturesPage() {
    await this.featuresLink.click();
  }

  async openResourcesPage() {
    await this.resourcesLink.click();
  }

  async openTrialSignup() {
    const ctaCount = await this.startFreeTrialLink.count();
    if (ctaCount > 0) {
      await this.startFreeTrialLink.click();
      return true;
    }

    // Fallback: direct CRM signup page (trial entry)
    await this.page.goto("/crm/signup.html");
    return true;
  }

  async getTabBarState() {
    const pricingVisible = await this.pricingLink.isVisible().catch(() => false);
    const featuresVisible = await this.featuresLink
      .isVisible()
      .catch(() => false);
    const resourcesVisible = await this.resourcesLink
      .isVisible()
      .catch(() => false);
    const demoVisible = await this.demoLink.isVisible().catch(() => false);
    const customersVisible = await this.customersLink
      .isVisible()
      .catch(() => false);

    return {
      pricingVisible,
      featuresVisible,
      resourcesVisible,
      demoVisible,
      customersVisible,
    };
  }
}

module.exports = { ZohoCrmPage };
