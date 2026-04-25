class ZohoCrmPage {
  constructor(page) {
    this.page = page;

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
}

module.exports = { ZohoCrmPage };
