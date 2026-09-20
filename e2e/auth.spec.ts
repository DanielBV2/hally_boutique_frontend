import { expect, test } from "@playwright/test";

import { E2E_PASSWORD, registerNewUser } from "./helpers/auth";

test("registro y login de extremo a extremo", async ({ page }) => {
  const email = await registerNewUser(page);

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
  await page.getByLabel("Contraseña", { exact: true }).fill(E2E_PASSWORD);
  await page.getByRole("button", { name: "Ingresar" }).click();

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("button", { name: "Mi cuenta" }),
  ).toBeVisible();
});