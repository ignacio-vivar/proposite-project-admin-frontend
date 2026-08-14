import { test, expect } from "../e2e/fixtures";

test("test", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL("/dashboard");
  const titulos = page.locator('[data-slot="card-title"]');
  await expect(titulos).toHaveCount(4);
  await expect(titulos).toHaveText([
    "Administración de Usuarios",
    "Creación de Usuarios",
    "Administración de Tareas",
    "Administración de Calificaciones",
  ]);
});
