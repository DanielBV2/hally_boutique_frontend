import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  timeout: 60_000,
  expect: {
    timeout: 10_000,
  },
  fullyParallel: false,
  retries: 0,
  // En CI se combinan: el reporter "github" pone anotaciones inline de cada
  // fallo directamente en la vista del job, y el reporter "html" genera
  // playwright-report/ — que el workflow sube como artifact para poder
  // debuggear sin acceso al runner. Con solo "github" no se genera ese
  // directorio y el artifact saldría vacío.
  reporter: process.env.CI
    ? [["github"], ["html", { open: "never" }]]
    : "html",
  use: {
    baseURL: "http://localhost:3001",
    // "retain-on-failure" (y no "on-first-retry") porque retries es 0:
    // con la config anterior nunca se generaba traza. Así, cuando un E2E
    // falla, queda el trace con la navegación completa para debuggear.
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    {
      name: "chromium",
      use: { browserName: "chromium" },
    },
  ],
  webServer: {
    command: "npm run dev",
    url: "http://localhost:3001",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      EXPRESS_API_URL: "http://localhost:3010/api",
    },
  },
});