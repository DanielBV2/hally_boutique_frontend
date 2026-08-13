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
Perfil con edición (ver "Mejora 15" más abajo), Direcciones con
editar/eliminar (Dialog + AlertDialog) reutilizando AddressForm en modo
edit, Pedidos con paginación real (total/page/limit del backend) y detalle
en /cuenta/pedidos/[orderId] con envío/guía si aplica. GET /orders del
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

## tipo User centralizado en types/user.ts COMPLETADA
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

## safeRedirect extraído a helper COMPLETADA
El cálculo de redirect seguro (startsWith("/") && !startsWith("//") → else "/")
estaba duplicado en login/page.tsx y registro/page.tsx. Ahora vive una sola
vez en src/lib/auth/safeRedirect.ts como getSafeRedirect(redirect: string |
null): string, consumido por ambas páginas en el onSuccess del mutate.
Verificado: tsc --noEmit limpio; eslint solo reporta la deuda pre-existente
de AddressStep.tsx:30 (documentada aparte).

## formatAddressLine() COMPLETADA
El join de dirección ([line1, line2, `city, state`, postalCode].filter(Boolean).
join(", ")) estaba duplicado en 3 lugares: AddressesTab.tsx, AddressStep.tsx y
cuenta/pedidos/[orderId]/page.tsx (este último con los campos shipping* del
order). Ahora vive una sola vez en lib/format.ts como formatAddressLine(input),
que recibe line1/line2/city/state/postalCode normalizados. Como Address es un
subtipo estructural, las tarjetas pasan `address` directo; el detalle de pedido
mapea los campos shipping*. El postalCode es opcional, así el output de las
tarjetas no cambió (solo el detalle de pedido lo mostraba).
Verificado: tsc --noEmit limpio; eslint solo reporta la deuda pre-existente
de AddressStep.tsx:30 (documentada aparte).

## limpieza layout/home/VariantSelector COMPLETADA
Tres fixes pequeños:
- layout.tsx: Geist_Mono era cargada y exponía --font-geist-mono pero ninguna
  regla CSS la consumía. Eliminados el import, la declaración y la variable
  del className (quedan Inter --font-sans y Plus_Jakarta_Sans --font-display).
- (tienda)/page.tsx: el .slice(0, 8) en el map de la home era redundante — ya
  se pide useProducts({ limit: 8 }) del backend. Eliminado.
- VariantSelector.tsx: notificaba al padre con onSelect() dentro de un
  useEffect (efecto por derivación, con render extra). Ahora onSelect se llama
  directo en los handlers de click de Talla/Color, calculando el match con el
  estado previo del otro selector. Mismo comportamiento, sin useEffect.
Verificado: tsc --noEmit limpio; eslint solo reporta la deuda pre-existente
de AddressStep.tsx:30 (documentada aparte). El slice(0, 8) que queda es el
truncado del order.id en el detalle de pedido (intencional, no es duplicado).

## Edición de perfil (nombre, email, teléfono) COMPLETADA Y VERIFICADA
El perfil pasó de solo lectura ("próximamente") a formulario editable. Requirió
trabajo en los DOS repos (el backend no tenía endpoint de actualización).

Backend (hallyboutique-backend, commit propio):
- Nuevo PATCH /api/auth/me (authMiddleware + validateSchemaMiddleware), contrato:
  body parcial { firstName, lastName, email, phone } con al menos 1 campo
  (refine de Zod), respuesta 200 con UserProfileDTO actualizado.
  - 409 "El correo ya está registrado" si email pertenece a otro usuario
    (comparación case-insensitive; el email propio con distinto casing pasa).
  - exactOptionalPropertyTypes: el service filtra explícitamente los campos
    undefined antes de pasar a repository.update (phone puede ser null).
  - repository ganó update(userId, data); openapi.ts documenta el PATCH +
    schema UpdateProfileRequest.
  - 6 unit tests nuevos en tests/unit/auth/auth.service.test.ts (total 172).
- Decisión: NO se reemiten tokens al cambiar email. El claim email del JWT
  queda stale pero es inofensivo — verificado que el backend NUNCA consume
  req.user.email, todo pasa por req.user.id/role y /auth/me lee de DB.

Frontend:
- BFF src/app/api/auth/me/route.ts ganó PATCH: proxy de autenticatedFetch con
  body, propaga status y error del backend.
- lib/api/auth.ts: updateProfile(input) → PATCH /api/auth/me, devuelve User.
- hooks/useProfile.ts: useUpdateProfileMutation → onSuccess invalida session
  (reusa useInvalidateSession), el form se re-sincroniza con el estado del server.
- ProfileTab.tsx: formulario react-hook-form + Zod (updateProfileSchema en
  lib/validations/auth.ts) con Nombre/Apellido/Correo/Teléfono, toast de éxito/
  error (ApiError muestra el mensaje real del backend, ej. 409). Teléfono vacío
  se normaliza a null (no se envía ""). El form se monta solo cuando hay user
  (sin setState-en-effect, la deuda de AddressStep no se tocó).
- lib/validations/auth.ts: updateProfileSchema + UpdateProfileFormValues.
Verificado end-to-end vía BFF (register → PATCH → GET /me): cambios de nombre/
apellido/teléfono reflejados, cambio de email reflejado, email de otro usuario
→ 409, PATCH sin sesión → 401. Typecheck y lint limpios en ambos repos (solo la
deuda pre-existente de AddressStep.tsx:30).

## Panel admin — Fase 0 (base + gating por rol) COMPLETADO Y VERIFICADO
El backend ya tenía los 19 endpoints admin; esta fase crea la infraestructura
del panel. Se decidió dividir la Mejora 16 en fases (0=base, 1=dashboard,
2=órdenes, 3=categorías, 4=productos/variantes/imágenes, 5=usuarios), cada
una con su batería de pruebas.

- Ruta real en `src/app/admin/` (carpeta normal). Lección: un route group
  `(admin)` NO aporta segmento a la URL, así que `(admin)/page.tsx` resuelve
  a `/` y choca con `(tienda)/page.tsx` en build ("two parallel pages that
  resolve to the same path"). Los route groups sirven para agrupar layouts
  que comparten URL, no para dar prefijo.
- Chrome de tienda movido del root layout a layouts de grupo:
  `(tienda)/layout.tsx` y `(auth)/layout.tsx` renderizan AnnouncementBar +
  Header + Footer (preservan el look actual de login/registro); el root
  layout queda solo con Providers + children + CartDrawer + Toaster. Así
  /admin tiene su propio shell sin header/footer de tienda.
- Gating por rol server-side: `admin/layout.tsx` usa `getSessionUserServerSide()`
  (nuevo helper read-only en lib/auth/serverAuth.ts: lee access_token, llama
  GET /auth/me, NO refresca ni escribe cookies — `cookieStore.set()` no está
  permitido en Server Components, `authenticatedFetch` ahí lanzaría error si
  el token expiró). Sin sesión → /login; role !== "ADMIN" → /. El layout
  exporta `dynamic = "force-dynamic"`.
- src/proxy.ts: matcher ahora incluye "/admin/:path*" (sin sesión → /login
  con redirect de retorno).
- Header (DropdownMenu) y MobileNav: item "Panel admin" visible solo si
  user.role === "ADMIN" — User.role por fin se consume en la UI.
- Página /admin placeholder con cards de las secciones futuras (sin links
  muertos).
Batería de 5 pruebas pasando: /admin sin sesión → 307 /login?redirect=%2Fadmin;
login CUSTOMER → GET /admin → 307 /; login ADMIN → 200 con shell admin y SIN
AnnouncementBar/Header/Footer de tienda (el único "Hally Boutique" en el HTML
es el <title>); / y /login conservan el chrome (verificado vía aria-label del
botón de carrito). Usuarios de prueba creados en DB: admin.fase0@test.co
(role ADMIN) y customer.fase0@test.co (CUSTOMER), password Test1234!.
Typecheck y lint limpios (solo la deuda pre-existente de AddressStep.tsx:30).

## Panel admin — Fase 1 (Dashboard) COMPLETADO Y VERIFICADO
Consume el único endpoint de métricas (GET /metrics/dashboard del backend).
Nace también el espacio BFF `/api/admin/*` para el resto de fases.

- BFF `src/app/api/admin/metrics/route.ts`: proxy de authenticatedFetch con
  propagación de status y error del backend (401 sin sesión, 403 si rol no
  es ADMIN — el backend lo rechaza, defensa en profundidad).
- types/metrics.ts: DashboardMetrics { totalOrders, totalRevenue,
  ordersByStatus (Record<string, number>, el backend solo incluye statuses
  existentes), totalCustomers, lowStockVariants }.
- lib/api/metrics.ts: getDashboardMetrics() → apiFetch("/api/admin/metrics").
- hooks/useMetrics.ts: useDashboardMetrics (queryKey ["admin","metrics"]).
- admin/page.tsx ahora es el dashboard: 3 cards (Ingresos formatCOP, Pedidos,
  Clientes), lista de Pedidos por estado con OrderStatusBadge reutilizado
  (itera los 7 statuses, 0 si ausente), y tabla "Stock bajo" con
  Table de shadcn (agregada vía CLI) mostrando stock en text-destructive.
  Estados: skeletons de carga, error con Alert destructivo + botón
  Reintentar (refetch), vacío de lowStockVariants con mensaje.
Verificado: BFF devuelve 200 con métricas reales para ADMIN (17 órdenes,
$1.453.603 COP, 9 clientes, ordersByStatus consistente: 8+1+1+7=17); 401 sin
sesión; 403 con sesión CUSTOMER propagando { code: FORBIDDEN } del backend;
/admin 200 SSR con skeleton; build + tsc + lint limpios (solo la deuda
pre-existente de AddressStep.tsx:30). Data de prueba en DB: admin.fase0@test.co.

## Panel admin — Fase 2 (Órdenes) COMPLETADO Y VERIFICADO
Consume los 3 endpoints admin de órdenes del backend: GET /orders/admin/all
(paginado + filtro por status), GET /orders/admin/:id, PATCH
/orders/admin/:id/status (progresión PAID→PROCESSING→SHIPPED→DELIVERED; el
backend permite saltos hacia adelante pero rechaza retrocesos/repetidos con
409).

- BFF (espacio /api/admin/orders): route.ts (GET lista con query page/limit/
  status), [orderId]/route.ts (GET detalle), [orderId]/status/route.ts (PATCH
  { status }), todos proxy de authenticatedFetch con propagación de error.
- types/order.ts: AdminOrderListItem, AdminOrder (extienden Order con
  customerEmail/customerName), PaginatedAdminOrders, AdminOrderStatus
  ("PROCESSING"|"SHIPPED"|"DELIVERED").
- lib/api/orders.ts: getAdminOrders, getAdminOrder, updateAdminOrderStatus.
- hooks/useAdminOrders.ts: useAdminOrders (queryKey ["admin","orders",page,
  limit,status]), useAdminOrder (["admin","order",id], enabled si hay id),
  useUpdateOrderStatusMutation (invalida ["admin","orders"] y
  ["admin","order",id] en onSuccess).
- components/admin/AdminShell.tsx (client): header + nav secundaria con
  estado activo vía usePathname. Por ahora solo incluye Dashboard y Órdenes
  (las demás secciones se agregan en sus fases; sin links muertos). El
  layout admin (server, guard por rol) ahora renderiza AdminShell.
- /admin/ordenes: tabla (Table shadcn) con Pedido/Cliente/Fecha/Estado/Total,
  fila clickeable al detalle, filtro por estado (Select, resetea página),
  paginación, skeletons y estado vacío.
- /admin/ordenes/[orderId]: detalle completo (cliente, productos, resumen,
  dirección, envío con LABEL_FAILED) + card "Estado del pedido" con el badge
  actual y botón del siguiente paso (PAID→"Marcar como en preparación",
  PROCESSING→"Marcar como enviado", SHIPPED→"Marcar como entregado"). En
  onError muestra el mensaje real del backend vía ApiError (ej. 409).
Verificado: lista 200 con 17 órdenes y paginación (limit=3 → 3 items);
filtro status=PAID → 8; detalle con cliente; PATCH PAID→PROCESSING → 200 y
refleja nuevo status; PROCESSING→PROCESSING → 409 con mensaje real del
backend; 401 sin sesión; 403 con sesión CUSTOMER; /admin/ordenes y
/admin/ordenes/[orderId] 200 SSR. La orden usada en el test se revirtió a
PAID por DB (el backend no permite retroceder, correcto). Typecheck y lint
limpios (solo la deuda pre-existente de AddressStep.tsx:30).

## Panel admin — Fase 3 (Categorías) COMPLETADO Y VERIFICADO
Consume los 4 endpoints admin de categorías del backend: GET
/categories/admin/all (paginado + filtro isActive), POST /categories, PATCH
/categories/:id, DELETE /categories/:id (soft delete: isActive=false).

- BFF (espacio /api/admin/categories): route.ts (GET lista con query page/
  limit/isActive + POST create), [id]/route.ts (PATCH update + DELETE),
  ambos proxy de authenticatedFetch con propagación de error (409 nombre
  duplicado, 404 inexistente, 409 categoría con productos activos).
- types/category.ts: PaginatedCategories, CategoryInput.
- lib/validations/category.ts: categorySchema (name 2-100, description ≤1000
  opcional) + CategoryFormValues.
- lib/api/categories.ts: getAdminCategories, createCategory, updateCategory,
  deleteCategory (apiFetch). getCategories público intacto.
- hooks/useAdminCategories.ts: useAdminCategories (queryKey ["admin",
  "categories", page, limit]), useCreate/Update/DeleteCategoryMutation — las
  tres invalidan ["admin","categories"] Y ["categories"] (público) en
  onSuccess, así la navegación de la tienda refleja los cambios al instante.
- components/admin/CategoryForm.tsx: react-hook-form + Zod, modo create/edit
  (patrón de AddressForm); el error del backend (ej. 409) se muestra vía
  toast con ApiError. Agregado Textarea vía `npx shadcn@latest add textarea`.
- /admin/categorias: tabla (Nombre/Slug/Descripción/Acciones) con paginación,
  botón "Nueva categoría", Dialog para create/edit y AlertDialog para delete.
- AdminShell: nav gana "Categorías" (icono Tags).
- Decisión importante: la página consulta SIEMPRE con `isActive: true`. El
  backend sin el filtro devuelve TODAS las categorías (incluye las
  soft-deleted); mostrarlas confunde porque editar/borrar una inactiva
  falla con 404. Con el filtro, eliminar la quita de la lista al instante.
Verificado end-to-end vía BFF: lista 200 (total 3); create 200 con slug
autogenerado; duplicado de nombre → 409 con mensaje real del backend;
categoría visible en GET /categories público; PATCH name → 200 y regenera
el slug; PATCH description → 200; DELETE → 200 y desaparece del público;
DELETE de categoría con 2 productos activos → 409 con mensaje real; DELETE
repetido → 404; 401 sin sesión; 403 con sesión CUSTOMER (GET y PATCH).
Las categorías de prueba se eliminaron en duro por DB (soft-delete no las
borra del admin). Typecheck y lint limpios (solo la deuda pre-existente de
AddressStep.tsx:30).

## Panel admin — Fase 4 (Productos, variantes e imágenes) COMPLETADO Y VERIFICADO
Consume los 10 endpoints admin de productos/variantes/imágenes del backend:
GET /products/admin/all (paginado + isActive + categoryId), POST /products,
PATCH /products/:id, DELETE /products/:id, POST /products/:id/images, DELETE
/products/:id/images/:imageId, GET/POST /products/:productId/variants,
PATCH/DELETE /products/:productId/variants/:variantId.

- BFF (espacio /api/admin/products): route.ts (GET lista + POST create),
  [id]/route.ts (PATCH + DELETE), [id]/images/route.ts (POST), [id]/images/
  [imageId]/route.ts (DELETE), [id]/variants/route.ts (GET lista de TODAS las
  variantes incl. inactivas + POST), [id]/variants/[variantId]/route.ts
  (PATCH + DELETE). Todos proxy de authenticatedFetch con propagación de error
  (404, 409 talla+color duplicado, 409 SKU en uso, 400 precio final ≤ 0).
- types/product.ts: ProductListItem ganó secondaryImageUrl (estaba en el DTO
  del backend pero no tipado); PaginatedProducts, ProductInput, AdminVariant,
  VariantInput, ProductSizes.
- lib/validations/product.ts: productSchema, variantSchema, productImageSchema.
- lib/api/products.ts: getAdminProducts, createProduct, updateProduct,
  deleteProduct, addProductImage, removeProductImage, getAdminVariants,
  createVariant, updateVariant, deleteVariant.
- hooks/useAdminProducts.ts: useAdminProducts (queryKey ["admin","products",
  page,limit,categoryId]), useAdminProductVariants (["admin","product-variants",
  productId], enabled si hay id). Mutations: create/delete invalidan listas
  admin + públicas; update/image/variant invalidan además el detalle
  ["product", slug] (así la tienda refleja el cambio al instante).
- components/admin/ProductForm.tsx (create/edit; campos nombre, descripción,
  precio base, moneda COP/USD, categoría Select, peso opcional — vacío = no
  enviar, no pisar el valor existente) y VariantForm.tsx (create: talla/color/
  sku/stock/recargo con preview de precio final; edit: talla y color SOLO
  lectura porque el backend no las permite cambiar, más toggle "Variante
  activa" vía PATCH isActive).
- Página /admin/productos: tabla (miniatura/Nombre/Categoría/Precio/Acciones),
  filtro por categoría (Select, resetea página), paginación, "Nuevo producto"
  (Dialog con ProductForm → al crear navega al detalle), delete con AlertDialog.
- Página /admin/productos/[slug]: "Información del producto" (ProductForm
  edit), "Imágenes" (grid con hover para eliminar + input URL/altText para
  agregar), "Variantes" (tabla con Estado Activa/Inactiva, editar/eliminar) y
  botón "Eliminar producto" (redirige a la lista).
- AdminShell: nav gana "Productos" (icono Package).
- Decisiones importantes:
  - Lista con isActive=true por defecto (misma razón que categorías: sin
    filtro el backend devuelve también soft-deleted).
  - El backend NO tiene GET admin por id: el detalle usa la ruta
    /admin/productos/[slug] que consulta el endpoint público GET /products/
    :slug (devuelve id, con el que se hacen PATCH/DELETE/images) + el listado
    admin de variantes. Por eso la URL del detalle usa el slug.
  - Lección RHF + zod: NO usar z.coerce con zodResolver — el input del form
    (strings) choca con el output (number) y tsc revienta con errores de
    Resolver/Control. Los campos numéricos se validan como string (refine) y
    se convierten con Number() en handleSubmit.
  - Lección eslint: form.watch dispara "Compilation Skipped: Use of
    incompatible library" con el parser type-aware; usar useWatch({ control,
    name }) que no tiene el problema.
Verificado end-to-end vía BFF: create 200 con slug autogenerado; producto
visible en GET /products (search); PATCH name → 200 y regenera slug; POST
image → 200 y aparece en el detalle público; variantes 0 → create
(M/Azul, priceDelta 10000 → finalPrice 95000 = 85000+10000); misma
talla+color → 409 con mensaje real; SKU duplicado → 409 con mensaje real;
PATCH stock → 200; DELETE variant → 200 (soft, desaparece del detalle
público); DELETE image → 200; DELETE product → 200 y desaparece del
público; variante con precio final ≤ 0 → 400 con mensaje real; 401 sin
sesión; 403 con sesión CUSTOMER (GET y PATCH); /admin/productos y
/admin/productos/[slug] 200 SSR; métricas intactas (17 órdenes). Productos
de prueba limpiados. Typecheck y lint limpios (solo la deuda pre-existente
de AddressStep.tsx:30).

## Panel admin — Fase 5 (Usuarios) COMPLETADO Y VERIFICADO
Consume el único endpoint admin de usuarios del backend: GET /auth/admin/all
(paginado + filtro opcional por role CUSTOMER/ADMIN, limit máx 50, ordenado
por createdAt desc). Es SOLO lectura — el backend no tiene PATCH/DELETE de
usuarios.

- BFF `src/app/api/admin/users/route.ts`: GET proxy de authenticatedFetch con
  propagación de status/error (401 sin sesión, 403 si rol no es ADMIN).
- types/user.ts: AdminUserListItem (id, email, firstName, lastName, role,
  createdAt como string) + PaginatedAdminUsers (items/total/page/limit).
- lib/api/auth.ts: getAdminUsers(params) → apiFetch con query condicional
  (page/limit/role).
- hooks/useAdminUsers.ts: useAdminUsers (queryKey ["admin","users",page,
  limit,role]).
- /admin/usuarios: tabla (Nombre/Correo/Rol/Registrado) con Badge de rol,
  filtro por rol (Select, resetea página), paginación, skeletons y estado
  vacío.
- AdminShell: nav gana "Usuarios" (icono Users).
Verificado end-to-end vía BFF: 200 con total=11 (11 usuarios en DB); primer
item = Customer Fase0 (createdAt desc = el más reciente); role=ADMIN → 2,
role=CUSTOMER → 9; paginación real (limit=3&page=2 → 3 items); NINGÚN item
expone passwordHash; 401 sin sesión; 403 CUSTOMER propagando FORBIDDEN;
/admin/usuarios 200 SSR. Typecheck y lint limpios (solo la deuda
pre-existente de AddressStep.tsx:30).

Con esto la Mejora 16 (Panel admin) queda completa: Fases 0 (base + gating
por rol), 1 (dashboard), 2 (órdenes), 3 (categorías), 4 (productos/
variantes/imágenes) y 5 (usuarios), cada una con su batería de pruebas.

## Lección: shadcn Dialog/AlertDialog SIEMPRE fuera de las ramas condicionales
Si una página con tabla tiene una rama de estado vacío que hace `return` temprano,
los `Dialog`/`AlertDialog` (botones "Nuevo...", "Editar", "Eliminar") NO deben
quedar SOLO en la rama con datos: al vaciarse la tabla, el botón llama
`setOpen(true)` pero el Dialog no está montado → parece que el botón "no
responde" (sin error en consola). Estructura correcta: header con el botón de
crear + body condicional (skeleton / vacío / tabla) + Dialog/AlertDialog SIEMPRE
al final del return principal. Ocurrió en /admin/productos y /admin/categorias
(al quedar el catálogo sin productos ni categorías); verificado que ahora
renderizan 200 en estado vacío y el Dialog queda montado. Typecheck y lint
limpios (solo la deuda pre-existente de AddressStep.tsx:30).

## Estado del proyecto
- [x] Proyecto Next.js inicializado, shadcn/ui instalado
- [x] Paleta de diseño temporal (tropical/pastel) aplicada vía CSS variables
- [x] Auth (BFF con cookies httpOnly) — pendiente
- [x] Catálogo (listado, detalle, filtros)
- [x] Carrito
- [x] Checkout (dirección → envío → pago)
- [x] Cuenta (perfil, direcciones, historial de pedidos)
