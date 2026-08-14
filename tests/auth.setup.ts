import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/user.json";

setup("authenticate", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Email" }).fill("admin@gmail.com");
  await page.getByRole("textbox", { name: "Contraseña" }).fill("12341234");
  await page.getByRole("button", { name: "Iniciar Sesión" }).click();
  await expect(page).toHaveURL("/dashboard");

  await page.context().storageState({ path: authFile });
});
