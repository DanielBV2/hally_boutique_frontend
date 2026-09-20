import { expect, test } from "@playwright/test";

import { registerNewUser } from "./helpers/auth";

const SEEDED_PRODUCT_SLUG = "vestido-de-bano-tropical-e2e";

test("checkout completo: carrito → dirección → envío → redirección a Wompi", async ({
  page,
}) => {
  await registerNewUser(page);
  await expect(page).toHaveURL("/");

  // ---- Paso 1: producto + carrito ------------------------------------------
  await page.goto(`/productos/${SEEDED_PRODUCT_SLUG}`);

  // Variante S/Verde (la combinación con más stock en el seed:e2e)
  await page.getByRole("button", { name: "S", exact: true }).click();
  await page.getByRole("button", { name: "Verde", exact: true }).click();

  const addToCart = page.getByRole("button", { name: "Añadir al carrito" });
  await expect(addToCart).toBeEnabled();
  await addToCart.click();

  // useAddToCartMutation.onSuccess abre el drawer automáticamente
  await expect(
    page.getByRole("heading", { name: "Tu carrito" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Ir a pagar" }).click();

  await expect(page).toHaveURL("/checkout");

  // ---- Paso 2: dirección (usuario nuevo, sin direcciones → formulario) ----
  await page.getByLabel("Nombre completo").fill("María Fernanda E2E");
  await page.getByLabel("Teléfono").fill("3001234567");
  await page.getByLabel("Dirección", { exact: true }).fill("Calle 10 # 5-23");
  await page.getByLabel("Ciudad").fill("Bogotá");

  await page.getByRole("combobox").click();
  await page.getByRole("option", { name: "Cundinamarca" }).click();

  await page.getByRole("button", { name: "Guardar dirección" }).click();

  // ---- Paso 3: envío (Envia falla → estimado estático del backend) --------
  const shippingOption = page.getByText(
    "Estimado (tarifas en tiempo real no disponibles)",
  );
  await expect(shippingOption).toBeVisible();

  await shippingOption.click();
  const continueBtn = page.getByRole("button", { name: "Continuar" });
  await expect(continueBtn).toBeEnabled();
  await continueBtn.click();

  // ---- Paso 4: pago — intercepta la redirección a Wompi --------------------
  await expect(
    page.getByRole("button", { name: "Pagar con Wompi" }),
  ).toBeVisible();

  let wompiUrl: string | null = null;
  await page.route("https://checkout.wompi.co/**", async (route) => {
    wompiUrl = route.request().url();
    await route.fulfill({
      status: 200,
      contentType: "text/html",
      body: "<html><body><h1>Wompi sandbox (interceptado)</h1></body></html>",
    });
  });

  await page.getByRole("button", { name: "Pagar con Wompi" }).click();

  await expect.poll(() => wompiUrl).not.toBeNull();

  const url = new URL(wompiUrl!);
  expect(url.origin).toBe("https://checkout.wompi.co");
  expect(url.pathname).toBe("/p/");

  expect(url.searchParams.get("currency")).toBe("COP");

  const amountInCents = Number(url.searchParams.get("amount-in-cents"));
  expect(Number.isInteger(amountInCents)).toBe(true);
  expect(amountInCents).toBeGreaterThan(0);
  expect(amountInCents % 100).toBe(0);

  expect(url.searchParams.get("reference") ?? "").not.toBe("");
  expect(url.searchParams.get("signature:integrity") ?? "").not.toBe("");
  expect(url.searchParams.get("redirect-url")).toContain(
    "/checkout/confirmacion",
  );
});