import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/dashboard");

  await page.goto("/dashboard/register-student");
  await expect(page).toHaveURL("/dashboard/register-student");
});

test("test-exitoso", async ({ page }) => {
  const name = `John ${Date.now()}`;
  const email = `John_${Date.now()}@gmail.com`;
  await page.locator('[name="name"]').fill(name);
  await page.locator('[name="email"]').fill(email);
  await page.locator('[name="password"]').fill("12341234");
  await page.locator('[name="confirmPassword"]').fill("12341234");

  const toggle = page.getByRole("switch");
  await expect(toggle).toHaveAttribute("aria-checked", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");

  await page.getByRole("button", { name: "Registrar" }).click();

  const toast = page.locator("[data-sonner-toast]", {
    hasText: "Registro completado con exito",
  });
  await expect(toast).toBeVisible({ timeout: 10000 });
});

test("test-bad-email-field", async ({ page }) => {
  // no meti check de email tremendo logi

  await page.locator('[name="name"]').fill("John Cena");
  await page.locator('[name="email"]').fill("i'm a bad mail");
  await page.locator('[name="password"]').fill("12341234");
  await page.locator('[name="confirmPassword"]').fill("12341234");

  const toggle = page.getByRole("switch");
  await expect(toggle).toHaveAttribute("aria-checked", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");

  await page.getByRole("button", { name: "Registrar" }).click();

  const toast = page.locator("[data-sonner-toast]", {
    hasText: "Usuario ya registrado",
  });
  await expect(toast).toBeVisible();
});

test("test-no-match-password-field", async ({ page }) => {
  // no meti check de email tremendo logi

  await page.locator('[name="name"]').fill("John Cena");
  await page.locator('[name="email"]').fill("good@gmail.com");
  await page.locator('[name="password"]').fill("1234123");
  await page.locator('[name="confirmPassword"]').fill("12341234");
  await page.getByRole("button", { name: "Registrar" }).click();
  await expect(
    page.getByText("La contraseñas no coinciden").first(),
  ).toBeVisible();
});

test("test-failure", async ({ page }) => {
  const toggle = page.getByRole("switch");
  await expect(toggle).toHaveAttribute("aria-checked", "false");

  await toggle.click();
  await expect(toggle).toHaveAttribute("aria-checked", "true");

  await page.getByRole("button", { name: "Registrar" }).click();

  const errores = page.locator('[data-slot="form-message"]', {
    hasText: "Invalid input",
  });
  await expect(errores).toHaveCount(4);
});
