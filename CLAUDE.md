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

## Estado del proyecto
- [x] Proyecto Next.js inicializado, shadcn/ui instalado
- [x] Paleta de diseño temporal (tropical/pastel) aplicada vía CSS variables
- [ ] Auth (BFF con cookies httpOnly) — pendiente
- [ ] Catálogo (listado, detalle, filtros)
- [ ] Carrito
- [ ] Checkout (dirección → envío → pago)
- [ ] Cuenta (perfil, direcciones, historial de pedidos)
