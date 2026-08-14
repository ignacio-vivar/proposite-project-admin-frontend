import { test as base, expect, type Page } from "@playwright/test";

export const test = base.extend<{ dashboardPage: Page }>({
  dashboardPage: async ({ page }, use) => {
    await page.goto("/dashboard");
    await use(page);
  },
});

export { expect };
