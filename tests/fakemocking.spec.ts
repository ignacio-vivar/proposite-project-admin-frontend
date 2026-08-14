import { test, expect } from "../e2e/fixtures";

test("fakemocking", async ({ page }) => {
  await page.route("**/admin/tasks/mindata/4", (route) => {
    route.fulfill({ status: 200, body: JSON.stringify([]) });
  });

  await page.goto("/dashboard/table-tasks");
  await expect(page).toHaveURL("/dashboard/table-tasks");
  await expect(page.getByText("No hay datos disponibles")).toBeVisible({
    timeout: 10000,
  });
});

test("fake error", async ({ page }) => {
  await page.route("**/admin/tasks/mindata/4", (route) => {
    route.fulfill({
      status: 500,
      contentType: "application/json",
      body: JSON.stringify({ error: "Internal Server Error" }),
    });
  });

  await page.goto("/dashboard/table-tasks"); // o la ruta que te esté funcionando

  await expect(page.getByText("No hay datos disponibles")).toBeVisible();
});

test("fake data", async ({ page }) => {
  await page.route("**/admin/tasks/mindata/4", (route) => {
    route.fulfill({
      status: 200,
      contentType: "application/json",
      body: JSON.stringify([
        {
          id: 1,
          description: "Trabajo Práctico N°1",
          deadtime: "2026-06-10",
          type_of_evaluation: "trabajo-practico",
        },
        {
          id: 2,
          description: "Trabajo Práctico N°100",
          deadtime: "2026-09-10",
          type_of_evaluation: "don't give a fuck",
        },
        { id: -1, description: "ID NEGATIVO" },
      ]),
    });
  });

  await page.goto("/dashboard/table-tasks"); // o la ruta que te esté funcionando
  await expect(page).toHaveURL("/dashboard/table-tasks");
});
