import { test, expect } from "@playwright/test";

test("heading en la página principal", async ({ page }) => {
  await page.goto("/");

  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toBeVisible();

  await expect(heading).toHaveText(/bienvenido profesor/i);
});
