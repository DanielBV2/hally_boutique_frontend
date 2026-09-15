import { expect, test } from "@playwright/test";

const PASSWORD = "Test1234!"; // cumple el registerSchema (min 8, mayúscula, número)

test("registro y login de extremo a extremo", async ({ page }) => {
  const email = `e2e-${Date.now()}@hallytest.co`;

  await page.goto("/registro");

  await page.getByLabel("Nombre").fill("Test");
  await page.getByLabel("Apellido").fill("E2E");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(PASSWORD);
  await page.getByLabel("Confirmar contraseña").fill(PASSWORD);

  await page.getByRole("button", { name: "Crear cuenta" }).click();

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("button", { name: "Mi cuenta" }),
  ).toBeVisible();

  await page.getByRole("button", { name: "Mi cuenta" }).click();
  await page.getByRole("menuitem", { name: "Cerrar sesión" }).click();

  await expect(
    page.locator("header").getByRole("link", { name: "Iniciar sesión" }),
  ).toBeVisible();

  await page.goto("/login");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(PASSWORD);
  await page.getByRole("button", { name: "Ingresar" }).click();

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("button", { name: "Mi cuenta" }),
  ).toBeVisible();
});