import { chromium, expect } from "@playwright/test";

export default async function globalSetup() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  await page.goto("http://localhost:3000/");
  await page.getByRole("textbox", { name: "Email" }).fill("admin@gmail.com");
  await page.getByRole("textbox", { name: "Contraseña" }).fill("12341234");
  await page.getByRole("button", { name: "Iniciar Sesión" }).click();
  await expect(page).toHaveURL("http://localhost:3000/dashboard");

  await page.context().storageState({ path: "auth.json" });
  await browser.close();
}
