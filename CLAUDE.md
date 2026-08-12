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

## Checkout — Paso 3 (Pago con Wompi) + confirmación COMPLETADO Y VERIFICADO
PaymentStep construye la URL de Wompi con URLSearchParams (sin <form>),
signature:integrity con los dos puntos, redirect-url dinámica vía
window.location.origin. Página /checkout/confirmacion con polling
(máx 10 intentos, 3s) a GET /orders/:id, único vacío de carrito al
confirmar PAID (ref booleana evita duplicados). Verificado end-to-end
con pago real en sandbox: Order → PAID, Payment creado, carrito vacío,
UI de confirmación correcta.

## Lección: pruebas locales con webhooks externos (Wompi) requieren
## DOS túneles públicos simultáneos con dominios DISTINTOS
El plan gratuito de ngrok solo permite UN dominio por cuenta — cualquier
túnel nuevo sin --domain explícito intenta reusar ese mismo dominio,
causando conflicto (ERR_NGROK_334) si ya está en uso. Como el dominio
fijo de ngrok ya está registrado en el panel de Wompi como URL de
webhook, se dejó FIJO apuntando siempre al backend (puerto 3000):
  ngrok http --domain=<dominio-fijo> 3000
Para el frontend (redirect-url, que se genera dinámicamente en runtime
y no está registrado en ningún lado externo) se usó Cloudflare Tunnel
en su modalidad "quick tunnel" (gratis, sin cuenta, sin conflicto de
dominio con ngrok por ser servicios distintos):
  cloudflared tunnel --url http://localhost:3001
Ambos túneles deben correr en paralelo, en terminales separadas.

## Sección /cuenta (Perfil, Direcciones, Pedidos) COMPLETADA
Perfil de solo lectura, Direcciones con editar/eliminar (Dialog +
AlertDialog) reutilizando AddressForm en modo edit, Pedidos con
paginación real (total/page/limit del backend) y detalle en
/cuenta/pedidos/[orderId] con envío/guía si aplica. GET /orders del
backend ahora expone paginación completa.

## Deuda técnica anotada (no bloqueante)
AddressStep.tsx:30 — warning de lint react-hooks/set-state-in-effect,
pre-existente al prompt de /cuenta, no se tocó por estar fuera de
alcance. Pendiente de limpieza en una pasada futura.

## Sección /cuenta COMPLETADA Y VERIFICADA
Batería de 9 pruebas pasando: bloqueo sin sesión, perfil de solo lectura
correcto, editar/eliminar/crear dirección (verificado en pgAdmin, con
AlertDialog de confirmación en delete), pedidos listados con status
correcto, detalle de pedido completo, y — la más importante — ownership
verificado: intentar ver el orderId de otro usuario vía URL falla
correctamente, nunca expone datos ajenos.

## Recuperación de contraseña COMPLETADA Y VERIFICADA
Batería de 9 pruebas pasando: email inexistente/existente con mismo
mensaje genérico, correo real recibido con link correcto (localhost:3001),
enlace sin token bloqueado, validación de contraseña débil rechazada
client-side, cambio exitoso con redirect a login, login falla con
contraseña vieja y funciona con la nueva, reintento de token ya usado
correctamente rechazado. Confirmado: fallo de Resend nunca rompe el
endpoint (try/catch en emailClient.ts + auth.service.ts ignora el error,
siempre responde 200 genérico).

## Fix: categoryId=undefined en query string COMPLETADO Y VERIFICADO
products.ts ahora arma la query con URLSearchParams.set() condicional,
omitiendo undefined/''. Bug pre-existente desde la migración al BFF, no
relacionado a la ronda de diseño. Verificado: /productos sin filtro (200),
con categoryId real (filtra bien), con search (filtra bien).

## Fix: búsqueda por search param COMPLETADO Y VERIFICADO
El SearchBar del header navegaba a /productos?search=... pero la página
solo leía categoryId — el término se descartaba y la búsqueda no filtraba.
Fix: productos/page.tsx ahora lee `search` del query string y lo pasa a
useProducts (que ya lo reenviaba a getProducts/products.ts, eslabones que
ya soportaban el parámetro desde la migración al BFF).
Verificado: /productos?search=oxford filtra a 1 resultado (Camisa Oxford
Azul), search=borrado → 1, search=camisa → 1 (solo el que contiene el
término), término inexistente → 0. BFF /api/products?search= confirmado.
Typecheck y lint limpios (el único error de lint es la deuda pre-existente
de AddressStep.tsx:30, documentada aparte).

## UI de logout COMPLETADA Y VERIFICADA
No existía ninguna forma de cerrar sesión (el endpoint /api/auth/logout
existía pero nada lo invocaba). Se agregó:
- logout() en lib/api/auth.ts (POST /api/auth/logout).
- useLogoutMutation (hooks/useLogout.ts): llama logout, invalida session y
  cart, redirige a /.
- Header: botón de usuario ahora es un DropdownMenu (Mi cuenta / Cerrar
  sesión). El /admin se omitió a propósito hasta implementar el panel
  admin (evita link muerto).
- MobileNav: botón "Cerrar sesión" debajo de "Mi cuenta".
- /cuenta: botón "Cerrar sesión" al pie de la página.
Verificado end-to-end vía BFF: registro → /api/auth/me refleja sesión →
logout (200, limpia access_token y refresh_token con Expires en el pasado)
→ /api/auth/me devuelve null. Páginas /, /login 200; /cuenta 307 sin
sesión (proxy, esperado). Typecheck y lint limpios.

## Fix: H1 del hero vacío COMPLETADO
El hero de la home tenía el <h1> vacío (remanente del pulido visual).
Se escribió el titular: "Verano sin límites" (decisión de contenido,
elegida por el usuario), coherente con el subtítulo tropical existente.
Verificado: / responde 200 y el H1 aparece en el HTML SSR. Typecheck y
lint limpios.

## shippingStatus (guía de envío) COMPLETADO Y VERIFICADO
Adaptación al campo nuevo del backend (OrderDetailDTO.shippingStatus:
PENDING | LABEL_GENERATED | LABEL_FAILED, agregado por el backend para
persistir el estado de la guía de envío). Antes el fallo de generación de
guía era invisible para el cliente.
- types/order.ts: nuevo tipo ShippingStatus + campo `shippingStatus` en
  Order (obligatorio).
- Detalle de pedido: la card "Envío" ahora se muestra cuando hay
  transportadora o shippingStatus != PENDING, y maneja los 3 estados:
  LABEL_GENERATED → transportadora/servicio/guía + descargar PDF;
  LABEL_FAILED → Alert destructivo ("Guía de envío pendiente",
  gestionándolo con la transportadora); PENDING sin guía → "se está
  generando, vuelve a consultar".
Verificado a nivel de contrato: toDetailDTO del backend incluye
shippingStatus y es usado por GET /orders/:id, POST /orders y PATCH
shipping-selection (todos los endpoints que llenan el tipo Order), así
que la condición de render no puede activarse con un valor ausente.
Typecheck y lint limpios.

## Manejo de 429 (rate limiting) COMPLETADO Y VERIFICADO
El backend ahora tiene rate limiting (apiLimiter global 300/15min, login
10/min, registro 10/h, forgot-password 5/h) que responde 429 con
{ success:false, error:{ code:"RATE_LIMITED", message } }.
- lib/api/errors.ts (ahora lib/api/client.ts tras la mejora 6): ApiError
  compartido con status + code + isRateLimited().
  Antes solo orders.ts tenía su propio ApiError y los otros 5 clientes
  lanzaban Error genérico sin status; ahora los 6 clientes (products,
  categories, cart, addresses, auth, orders) lanzan ApiError con el status
  HTTP y el code del backend. ShippingStep.tsx importa ApiError de client.ts.
- olvide-password: antes cualquier error no-red mostraba el éxito falso
  (por diseño de seguridad) — ahora un 429 muestra el mensaje real del
  backend via toast y NO el éxito falso.
- restablecer-password: antes todo error mostraba "enlace inválido/
  expirado" — ahora un 429 muestra el mensaje real.
- login/registro ya mostraban json.error?.message (que incluye el 429) —
  sin cambios necesarios.
Verificado end-to-end vía BFF: 10 intentos fallidos de login → 401,
intento 11 → 429 con body RATE_LIMITED y mensaje en español del backend.
Typecheck y lint limpios.

## Cliente HTTP centralizado en lib/api/client.ts COMPLETADA
Antes ApiResponse<T> + handleResponse() estaban duplicados en los 6 clientes
(products, orders, categories, cart, auth, addresses), había una copia local
en checkout/page.tsx, y fetch crudo con res.json() manual en login, registro,
checkout y useSession. Ahora todo vive en src/lib/api/client.ts:
- ApiError (status + code + isRateLimited()), migrado desde errors.ts (eliminado).
- ApiResponse<T> y handleResponse<T> (exportados, usados internamente por apiFetch).
- apiFetch<T>(path, init): fetch + parse + throw ApiError en un solo helper.
Refactor:
- Los 6 clientes usan apiFetch; desaparece el contrato duplicado.
- auth.ts ganó login() y register() (antes fetch crudo en las páginas) + tipo
  User (renombrado de AuthUser en la mejora 11).
- orders.ts ganó createOrder() (antes fetch crudo en checkout).
- login/registro/checkout/useSession migrados: manejan errores con
  `error instanceof ApiError` (checkout distingue status 409 y 400; login/
  registro muestran error.message que incluye el mensaje real del backend,
  preservando el comportamiento del 429).
- errors.ts eliminado; los 9 imports migrados a @/lib/api/client (incluye
  olvide-password, restablecer-password, ShippingStep).
Verificado: tsc --noEmit limpio; eslint solo reporta la deuda pre-existente
de AddressStep.tsx:30 (documentada aparte). Los únicos fetch que quedan fuera
de client.ts son los server-to-server de lib/auth/serverAuth.ts (BFF, correcto).

## FormatCOP() centralizado en lib/format.ts COMPLETADA
Había 10 construcciones duplicadas de `new Intl.NumberFormat("es-CO", ...)` con
COP a nivel de módulo (CartDrawer, OrdersTab, ProductCard, FeaturedProductCard,
AnnouncementBar, productos/[slug], checkout/confirmacion, ShippingStep,
PaymentStep, cuenta/pedidos/[orderId]). Ahora todo vive en src/lib/format.ts:
- formatCOP(amount): formatter COP compartido a nivel módulo (única instancia).
- formatCurrency(amount, currency): variante con currency dinámico (usada por
  el detalle de producto, que lee product.currency del DTO en vez de COP fijo).
- El resto del proyecto ya no construye ningún Intl.NumberFormat de moneda.
Verificado: tsc --noEmit limpio; eslint solo reporta la deuda pre-existente
de AddressStep.tsx:30 (documentada aparte).

## FREE_SHIPPING_THRESHOLD centralizado COMPLETADA
La constante 150000 estaba duplicada (AnnouncementBar + ShippingStep, ambos
con el comentario "debe coincidir con el backend"). Ahora vive una sola vez
en src/lib/constants/shipping.ts como FREE_SHIPPING_THRESHOLD, consumida por
los dos componentes. El comentario de sincronización con el backend se movió
a la definición única.
Verificado: tsc --noEmit limpio; eslint solo reporta la deuda pre-existente
de AddressStep.tsx:30 (documentada aparte).

## useLoginMutation/useRegisterMutation COMPLETADA
En la mejora 6 el fetch crudo de login/registro ya se había movido a
login()/register() en lib/api/auth.ts (logout() ya existía desde la UI de
logout). Lo que faltaba eran los hooks de mutación:
- hooks/useLogin.ts: useLoginMutation → mutationFn: login, invalida session
  en onSuccess (reusa useInvalidateSession).
- hooks/useRegister.ts: useRegisterMutation → mutationFn: register, invalida
  session en onSuccess.
- login/page.tsx y registro/page.tsx refactorizados: eliminan el estado local
  error/submitting y el try/catch; el error se deriva de mutation.error
  (instanceof ApiError para mostrar el mensaje real del backend, incl. 429),
  el loading viene de mutation.isPending, y el redirect (safeRedirect desde
  searchParams) se hace en el onSuccess por-llamada del mutate (la página
  decide el destino, el hook lo compartido).
Verificado: tsc --noEmit limpio; eslint solo reporta la deuda pre-existente
de AddressStep.tsx:30 (documentada aparte). Los únicos fetch directos de auth
que quedan son forgotPassword/resetPassword (páginas de recuperación, fuera
de alcance de esta mejora).

## Checkout sin ApiResponse local ni fetch crudo COMPLETADA
Ya quedó cubierta por la mejora 6 (cliente HTTP centralizado): checkout/page.tsx
eliminó su copia local de ApiResponse y el fetch("/api/orders") crudo, y ahora
usa createOrder() de lib/api/orders.ts (que pasa por apiFetch de client.ts y
lanza ApiError). Distingue 409 (stock) y 400 (carrito vacío) con
`error instanceof ApiError`. Verificado con grep: sin `fetch(` ni
`interface ApiResponse` en checkout/ ni components/checkout/ (los refetch de
ShippingStep son de TanStack Query). Sin cambios nuevos en esta mejora.

## Mejora 11: tipo User centralizado en types/user.ts COMPLETADA
SessionUser estaba declarado local en hooks/useSession.ts y AuthUser local en
lib/api/auth.ts (dos duplicados del mismo shape, sin phone). Ahora hay un solo
tipo en src/types/user.ts:
- User: id, email, firstName, lastName, phone (string | null), role
  ("CUSTOMER" | "ADMIN") — alineado al UserProfileDTO del backend
  (auth.dto.ts), que sí expone phone desde siempre.
- useSession.ts importa User de types/ (eliminada la interface local).
- lib/api/auth.ts elimina AuthUser e importa User en login()/register().
- En la mejora 6 se documentó "tipo AuthUser"; queda corregido a User.
Verificado: tsc --noEmit limpio; eslint solo reporta la deuda pre-existente
de AddressStep.tsx:30 (documentada aparte). Sin usos de user.role/phone en la
UI por ahora (solo firstName/lastName/email en ProfileTab) — el campo phone
queda tipado para cuando la edición de perfil exista.

## Estado del proyecto
- [x] Proyecto Next.js inicializado, shadcn/ui instalado
- [x] Paleta de diseño temporal (tropical/pastel) aplicada vía CSS variables
- [x] Auth (BFF con cookies httpOnly) — pendiente
- [x] Catálogo (listado, detalle, filtros)
- [x] Carrito
- [x] Checkout (dirección → envío → pago)
- [x] Cuenta (perfil, direcciones, historial de pedidos)
