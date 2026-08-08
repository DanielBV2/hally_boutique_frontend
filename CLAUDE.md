# Hally Boutique — Frontend

## Stack
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS + shadcn/ui (New York style)
- TanStack Query (estado de servidor: productos, carrito, órdenes)
- Zustand (solo estado de UI puro, ej. drawer del carrito abierto/cerrado)
- Corre en el puerto 3001 (el backend usa 3000)

## Backend
API REST en `http://localhost:3000/api` (Express + Prisma + PostgreSQL).
Repositorio hermano: `../hallyboutique-backend`. Ver su `CLAUDE.md` para
contratos exactos de cada endpoint, DTOs, y reglas de negocio.

## Diseño — IMPORTANTE, sujeto a cambio
La paleta y tipografía actuales son PLACEHOLDER. El rebranding definitivo
de la marca lo está desarrollando el equipo de diseño (fuera de este
código) y se integrará más adelante.

**Regla no negociable:** NUNCA hardcodear valores de color (hex, rgb) en
componentes. Todo color debe consumirse vía las clases semánticas de
Tailwind/shadcn (`bg-primary`, `text-foreground`, `bg-accent`, etc.), que
leen de las variables CSS en `src/app/globals.css`. Cuando llegue la
paleta definitiva, el cambio debe limitarse a ese único archivo.

Paleta actual (temporal, tropical/pastel — vestidos de baño):
- `--background`: crema/arena
- `--primary`: teal profundo (botones, acentos, headings)
- `--secondary`: amarillo sol
- `--accent`: naranja mango
- `--muted`: azul mar suave

## Arquitectura de autenticación (decisión importante)
Patrón BFF (Backend For Frontend). Las cookies httpOnly viven en el
dominio de este frontend, NUNCA se exponen al backend directamente desde
el navegador.

Flujo: browser → Route Handler de Next.js (server-side, lee cookie
httpOnly) → fetch server-to-server → Express API (Authorization: Bearer
<token>, sin cambios) → respuesta → Next.js actualiza la cookie → responde
al browser.

El backend (Express) NO cambia — sigue esperando Bearer token exactamente
como siempre. El navegador nunca tiene acceso directo vía JavaScript a
accessToken ni refreshToken.

## Reglas de negocio heredadas del backend (recordatorio para UI)
- El carrito SIEMPRE requiere autenticación — no existe carrito de
  invitado. "Añadir al carrito" sin sesión debe redirigir a login/registro,
  nunca fallar silenciosamente.
- El checkout requiere: dirección → cotización de envío (Envia.com, puede
  tardar unos segundos, la UI debe mostrar loading) → selección de método
  de envío → recién ahí se genera el pago con Wompi.
- Wompi Web Checkout es una redirección a un dominio externo
  (checkout.wompi.co) — el usuario sale de la app temporalmente, vuelve
  por medio de un redirect_url. El estado real de la orden SIEMPRE se
  confirma consultando GET /orders/:id, nunca se confía en los parámetros
  de la URL de retorno.
- Los mensajes de error de auth (login incorrecto, etc.) son
  intencionalmente genéricos por seguridad — no intentar diferenciar en
  el frontend "email no existe" vs "password incorrecta".

## Estructura de carpetas (planeada)
```
src/
├── app/
│   ├── (tienda)/              # rutas públicas del cliente
│   │   ├── page.tsx            # home
│   │   ├── productos/
│   │   ├── categorias/
│   │   ├── carrito/
│   │   ├── checkout/
│   │   └── cuenta/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── registro/
│   │   ├── olvide-password/
│   │   └── restablecer-password/
│   └── api/                    # Route Handlers (BFF: auth, proxys autenticados)
├── components/
│   ├── ui/                     # shadcn, no tocar a mano salvo necesario
│   └── [dominio]/              # componentes propios por dominio (ProductCard, CartDrawer, etc.)
├── lib/
│   ├── api/                    # clientes fetch tipados por dominio (products.ts, orders.ts, etc.)
│   └── auth/                   # helpers de sesión/cookies
├── hooks/                       # hooks de TanStack Query por dominio
└── types/                       # tipos compartidos, alineados a los DTOs del backend
```
## Lección: verificar diagnósticos de OpenCode contra evidencia real
Cuando dos sesiones de OpenCode (o una sesión y una suposición) reportan
diagnósticos contradictorios sobre el mismo bug, NUNCA aplicar un fix
basándose en el reporte sin verificar primero contra el comportamiento
real (Thunder Client para el backend, console.log/DevTools para el
frontend). Ya ocurrió con category.name (dato mal cargado, no bug de
código) y con la forma de respuesta de GET /products (el backend estaba
correcto, el diagnóstico de una sesión de OpenCode fue incorrecto).

## Lección: Next.js 16 renombró middleware.ts a proxy.ts
El archivo debe llamarse `src/proxy.ts` (no `middleware.ts`) y exportar una
función `proxy()` (no `middleware()`). Si el archivo tiene el nombre viejo,
Next.js lo ignora completamente y SIN NINGÚN ERROR VISIBLE — el matcher y
la lógica de auth simplemente nunca corren (se manifestó como 404 en vez
de redirect a /login en una ruta protegida). config.matcher no cambió de
sintaxis. Migración: renombrar archivo + renombrar función exportada
(o usar `npx @next/codemod@latest middleware-to-proxy .`).

## Lección: componentes de shadcn SIEMPRE vía CLI, nunca escritos a mano
Si un prompt a OpenCode menciona un componente de shadcn (ej. "Alert de
shadcn") sin incluir el comando `npx shadcn@latest add <componente>`
explícito, OpenCode puede terminar escribiéndolo a mano — y las clases
de Tailwind v4 que usan estos componentes (ej. `calc(var(--spacing)*4)`)
son fáciles de escribir mal, rompiendo el build con "Parsing CSS source
code failed". Regla: todo prompt que mencione un componente de shadcn
debe incluir su comando de instalación explícito, sin excepción.

## Auth (BFF con cookies httpOnly) — COMPLETADO Y VERIFICADO
Batería de 7 pruebas manuales pasando: cookies invisibles desde JS (con y
sin sesión), visibles en DevTools→Application con HttpOnly marcado, login,
GET /api/auth/me refleja sesión, ruta protegida (/checkout) redirige a
/login?redirect=... sin sesión (vía src/proxy.ts), logout limpia sesión.

## Carrito — conexión "Añadir al carrito" COMPLETADA Y VERIFICADA
POST /cart/items conectado vía BFF (Route Handlers /api/cart, /api/cart/items,
/api/cart/items/[itemId], todos proxies delgados sobre authenticatedFetch).
Hooks TanStack Query (useCart, useAddToCartMutation, etc.) con invalidación
simple, sin optimistic update (decisión intencional, el stock se valida
server-side). Toasts con sonner. Batería de 5 pruebas pasando: redirect a
login sin sesión, añadir con toast + badge actualizado, mismo producto
incrementa cantidad (no duplica), stock insuficiente muestra error real del
backend, llamadas confirmadas yendo a /api/cart/* (dominio propio) nunca
directo a localhost:3000.

## Carrito — Drawer lateral COMPLETADO Y VERIFICADO
Sheet de shadcn/ui con Zustand (useCartDrawerStore) para estado UI puro.
Stepper de cantidad con loading independiente por itemId, estados vacío/
carga/no-disponible manejados. Batería de 7 pruebas pasando: estado vacío,
apertura desde header, incrementar/decrementar sin bloquear otros items,
eliminar por cantidad-a-0 y por botón directo, navegación a /checkout
(pendiente, esperado 404 por ahora), cierre por X y por overlay.

## Checkout — Paso 1 (Dirección + creación de Order) COMPLETADO Y VERIFICADO
AddressStep con direcciones existentes (Cards + RadioGroup, default preseleccionada)
o formulario nuevo (react-hook-form + Zod, Select cerrado de 33 departamentos
extraído literal de colombiaDepartmentCodes.ts del backend). POST /api/orders
crea la Order con idempotencyKey generado una vez por sesión de checkout (useRef).
Batería de 7 pruebas pasando: sin direcciones → formulario directo, creación
con state correcto verificado en DB, con direcciones → tarjetas + default,
cancelar formulario sin perder selección, avance a step shipping, carrito
vacío manejado sin crash, sin sesión redirige a login.

## Checkout — Paso 2 (Envío) COMPLETADO Y VERIFICADO
ShippingStep con cotización automática al entrar (POST shipping-quote),
loading con skeletons, botón "Reintentar cotización" en error de red
(probado con Network request blocking en DevTools), banner de envío
gratis cuando order.subtotal >= FREE_SHIPPING_THRESHOLD (verificado con
subtotal real superando el umbral). PATCH shipping-selection confirma
la opción, avanza a step payment con order actualizada (shippingAmount,
total recalculados).

## Estado del proyecto
- [x] Proyecto Next.js inicializado, shadcn/ui instalado
- [x] Paleta de diseño temporal (tropical/pastel) aplicada vía CSS variables
- [x] Auth (BFF con cookies httpOnly) — pendiente
- [ ] Catálogo (listado, detalle, filtros)
- [ ] Carrito
- [ ] Checkout (dirección → envío → pago)
- [ ] Cuenta (perfil, direcciones, historial de pedidos)
