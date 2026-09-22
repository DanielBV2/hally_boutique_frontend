# Hally Boutique — Frontend

Frontend de e-commerce de vestidos de baño y accesorios. Next.js 16 (App
Router) + React 19 + TypeScript, Tailwind CSS, TanStack Query y Zustand.

El frontend corre en el puerto 3001 y consume la API REST del backend
(`../hallyboutique-backend`, puerto 3000) vía patrón BFF con cookies
httpOnly.

## Setup

```bash
npm install
cp .env.example .env.local   # completar valores
npm run dev                  # http://localhost:3001
```

Requiere el backend corriendo aparte (repo `hallyboutique-backend`). Las
instrucciones de ese repo no se duplican aquí — sigue su README para
levantar la API y la base de datos.

## Scripts

- `npm run dev` — servidor de desarrollo (puerto 3001)
- `npm run build` — build de producción
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`
- `npm run test` — Vitest (unit de lógica y componentes)
- `npm run test:e2e` — Playwright (requiere el backend de pruebas, ver
  la sección "Pruebas E2E (Playwright)")
- `npm run test:e2e:ui` — lo mismo con la UI de Playwright

## Pruebas E2E (Playwright)

Prerrequisito: levanta el backend de pruebas primero (entorno aislado en el
puerto 3010) siguiendo la sección "Entorno E2E (Playwright)" del README del
repo backend (`npm run docker:test:up && npm run seed:e2e && npm run dev:test`).
Playwright levanta únicamente el frontend contra ese backend.

```bash
npm run test:e2e      # smoke de registro + login
npm run test:e2e:ui   # lo mismo con la UI de Playwright
```