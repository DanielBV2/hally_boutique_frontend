import type { Page } from "@playwright/test";

export const E2E_PASSWORD = "Test1234!"; // cumple el registerSchema (min 8, mayúscula, número)

/**
 * Registra un usuario nuevo con email único y deja la sesión iniciada.
 * Devuelve el email usado (los callers pueden loguearse de nuevo con él).
 */
export async function registerNewUser(page: Page): Promise<string> {
  const email = `e2e-${Date.now()}@hallytest.co`;

  await page.goto("/registro");

  await page.getByLabel("Nombre").fill("Test");
  await page.getByLabel("Apellido").fill("E2E");
  await page.getByLabel("Correo electrónico").fill(email);
  await page.getByLabel("Contraseña", { exact: true }).fill(E2E_PASSWORD);
  await page.getByLabel("Confirmar contraseña").fill(E2E_PASSWORD);

  await page.getByRole("button", { name: "Crear cuenta" }).click();

  return email;
}