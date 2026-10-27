# Decisiones técnicas vigentes

> Los ADRs se conservan porque explican por qué el proyecto tomó una decisión. Cuando una decisión cambia, se marca como sustituida o actualizada; no se elimina el registro anterior.

## Cómo leer esta página

- **Vigente:** describe el estado que debe usarse actualmente.
- **Actualizado:** conserva una decisión válida, pero con cambios posteriores.
- **Sustituido:** fue correcto en una etapa anterior y ya no debe usarse.
- **Rechazado:** se evaluó y no se adoptó.
- **Propuesto:** redactado para decisión. No está aprobado y no debe tratarse como vigente hasta que el responsable lo apruebe.

Las decisiones actuales se redactan en presente. El contexto de una decisión anterior se redacta en pasado para dejar claro que describe una etapa histórica.

## ADR-001 — Framework, hosting y manejo del formulario de contacto

**Estado:** Actualizado

**Fecha original:** octubre de 2026

**Última actualización:** octubre de 2026

> **Nota:** el hosting (Cloudflare Pages) fue actualizado por [ADR-003](#adr-003--destino-de-despliegue-cloudflare-workers). El texto de este registro se conserva como se escribió.

### Contexto

SESGO TI necesita una landing page de captación de clientes externos que muestre desarrollo de aplicaciones web, automatización e integración de IA. El desarrollo lo realiza una sola persona, sin presupuesto para dominio ni hosting de pago, y el formulario de contacto debe enviar correo y guardar los datos recibidos.

### Opciones consideradas

1. Next.js desplegado en Vercel (plan Hobby).
2. Astro desplegado en Vercel (plan Hobby).
3. Astro desplegado en Netlify, usando Netlify Forms para el formulario.
4. Astro desplegado en Cloudflare Pages, con Cloudflare D1 para guardar los datos y Resend para el correo.

Vercel se descartó para ambas variantes: el plan Hobby prohíbe expresamente el uso comercial, y un sitio de captación de clientes con formulario de contacto cae dentro de esa restricción.

Netlify se consideró por su manejo nativo de formularios, pero se descartó frente a Cloudflare Pages por preferencia de hosting.

### Decisión

El stack vigente es:

- Framework: Astro, usando el adaptador oficial `@astrojs/cloudflare` para habilitar rutas de servidor.
- Hosting: Cloudflare Pages (plan gratuito, uso comercial permitido).
- Almacenamiento del formulario: Supabase (Postgres). El registro original de esta decisión usaba Cloudflare D1; el detalle completo de este cambio, incluyendo un riesgo operativo y su alternativa de contingencia, está en ADR-002.
- Envío de correo: Resend (plan gratuito), usando la dirección de pruebas `onboarding@resend.dev` mientras no exista un dominio propio verificado. Esta dirección solo puede enviar al correo de la cuenta de Resend, lo cual coincide con el caso de uso: notificar al dueño de SESGO TI de un lead nuevo, no a terceros.

### Implicaciones

- El sitio no puede desplegarse en el plan gratuito de Vercel sin incumplir sus términos de servicio.
- Cuando exista un dominio propio, el remitente de Resend se actualiza a ese dominio verificado; el resto de la arquitectura no cambia.
- Los límites gratuitos de Resend (100 correos al día, 3,000 al mes) exceden ampliamente lo que un formulario de contacto de una landing page genera.

## ADR-002 — Capa de datos: Supabase

**Estado:** Vigente

**Fecha:** octubre de 2026

### Contexto

El almacenamiento del formulario de contacto (ADR-001) resolvía solo esa necesidad puntual. SESGO TI tiene una visión de mediano plazo de gestión de clientes y cotizaciones, lo que eventualmente requiere autenticación, control de acceso por registro y lógica de negocio más allá de guardar un formulario. Construir eso desde cero sobre Cloudflare D1 significaría escribir autenticación y control de acceso a mano, sin ningún framework de backend.

### Opciones consideradas

1. Mantener Cloudflare D1: suficiente para guardar el formulario, pero sin autenticación, control de acceso por fila ni camino claro de crecimiento hacia gestión de clientes.
2. Supabase: Postgres administrado, autenticación incluida, Row Level Security, Edge Functions y panel de administración, compatible con el runtime de Cloudflare Workers.
3. NestJS con un gestor de base de datos Postgres dedicado, desplegado como servicio independiente.

### Decisión

El almacenamiento del formulario de contacto, y la base de datos del proyecto en general, usa Supabase (Postgres). Da un camino de crecimiento real hacia autenticación y gestión de clientes sin comprometer al proyecto con un backend dedicado todavía.

El envío de correo (Resend, ver ADR-001) no cambia ni depende de Supabase.

### Implicaciones

- Los proyectos gratuitos de Supabase se pausan automáticamente después de 7 días sin actividad, y requieren reactivación manual desde el panel. Mientras el tráfico del formulario sea bajo, esto debe revisarse periódicamente para que el formulario no falle sin que nadie lo note.
- El plan gratuito de Supabase permite uso comercial.
- Cuando el proyecto necesite gestión de clientes y cotizaciones, Supabase ya provee autenticación y Row Level Security; no haría falta migrar de base de datos para construir esa funcionalidad.

### Alternativa de contingencia

Si el riesgo de pausa por inactividad se vuelve un problema operativo real, o si la lógica de negocio crece más allá de lo que Edge Functions puede manejar con claridad, la siguiente opción es NestJS con un gestor de base de datos Postgres dedicado, desplegado como servicio propio. Usa el mismo lenguaje (TypeScript) que el resto del proyecto, sin necesidad de introducir Java ni Spring Boot. Esta ruta se evaluaría con su propio ADR si llega a activarse.

## ADR-003 — Destino de despliegue: Cloudflare Workers

**Estado:** Vigente (actualiza el hosting de ADR-001)

**Fecha:** octubre de 2026

### Contexto

ADR-001 eligió Cloudflare Pages como hosting. El proyecto generado con Astro 7 usa `@astrojs/cloudflare` v14, cuyo punto de entrada apunta a Cloudflare Workers, y `wrangler.jsonc` define `main` y `assets` (Workers con Static Assets), no un proyecto de Pages. La documentación y la implementación diferían.

### Opciones consideradas

1. Mantener Pages: requeriría fijar una versión anterior del adaptador o reconfigurar el proyecto, y alejarse del camino que el adaptador oficial soporta hoy.
2. Cloudflare Workers con Static Assets: es el destino que soporta el adaptador instalado y el que ya refleja `wrangler.jsonc`.

### Decisión

El destino de despliegue es Cloudflare Workers con Static Assets. El resto del stack de ADR-001 y ADR-002 no cambia.

### Implicaciones

- Las previews por rama las genera la integración de Workers de Cloudflare, no la de Pages. La skill `09-git-workflow` se actualiza en consecuencia.
- Los secretos se definen con `wrangler secret` en producción y con `.dev.vars` en local; este último no se versiona.
- **Pendiente de verificar con documentación oficial:** que el plan gratuito de Workers permite uso comercial y sus límites actuales. Esta afirmación no se da por cierta hasta confirmarla, porque ADR-001 se apoyaba en ella para Pages.
- El proceso de build y despliegue por rama (Workers Builds u otro) está por configurar.

## ADR-004 — Internacionalización: español en la raíz, inglés en `/en`

**Estado:** Vigente

**Fecha:** octubre de 2026

### Contexto

El sitio se publica en español e inglés (contexto de marca). El público inicial son pymes hispanohablantes. El idioma por defecto lo definió el responsable del proyecto: español.

### Opciones consideradas

1. Español en la raíz (`/`) e inglés bajo `/en`.
2. Ambos idiomas con prefijo (`/es` y `/en`) y una redirección desde `/`.

### Decisión

Se usa el enrutamiento de internacionalización de Astro con `defaultLocale: "es"`, `locales: ["es", "en"]` y `routing.prefixDefaultLocale: false`. Las páginas en español viven en la raíz de `src/pages/` y las de inglés en `src/pages/en/`. Configuración tomada de la documentación oficial de Astro (guía de internacionalización).

### Implicaciones

- La opción 1 evita una redirección en `/` y mantiene las URLs en español sin prefijo.
- Cada página nueva debe existir en ambos idiomas; el contenido se duplica y debe mantenerse sincronizado.
- El texto en español usa tratamiento de **usted**.
- Las opciones de rutas personalizadas por idioma exigen `output: "server"` y que no haya páginas prerenderizadas, según la documentación; no se usan aquí.
- Selector de idioma, etiquetas `hreflang` y `lang` del `<html>` por idioma se resuelven al implementar el layout y el SEO base.

## ADR-005 — Protección antispam del formulario: Cloudflare Turnstile

**Estado:** Vigente (aprobado por el responsable)

**Fecha:** octubre de 2026

### Contexto

El formulario de contacto es público, guarda datos en Supabase (ADR-002) y envía un correo con Resend (ADR-001), cuyo plan gratuito admite 100 correos al día. Sin protección, un bot puede llenar la tabla y agotar esa cuota, con lo que los clientes reales dejarían de ser notificados.

### Opciones consideradas

1. Cloudflare Turnstile, con verificación del token en el servidor.
2. Campo señuelo (honeypot) y validación de tiempo de envío, sin servicio externo.
3. Otro CAPTCHA de terceros. No se evaluó en detalle.

### Decisión

Opción 1. El endpoint del formulario rechaza toda solicitud cuyo token de Turnstile no verifique en el servidor. Un campo señuelo puede añadirse después como capa adicional si hiciera falta.

### Evidencia

Página de planes de Turnstile (documentación oficial de Cloudflare):

- El plan gratuito ofrece verificaciones ilimitadas, hasta 20 widgets por cuenta y 10 hostnames por widget. La analítica conserva 7 días y se mantiene la marca de Cloudflare.
- La página lo describe como adecuado para "la mayoría de las aplicaciones en producción" y pymes, y afirma que puede usarse sin otros servicios de Cloudflare.

### Implicaciones

- La clave secreta se define como secreto de Workers (`wrangler secret` y `.dev.vars`, ver ADR-003). La clave de sitio es pública.
- El widget carga un script de Cloudflare en la página del formulario y añade una llamada del servidor por cada envío.
- **No verificado:** los términos de uso comercial del plan gratuito (la página de planes no los incluye), la accesibilidad y privacidad del widget, y si un dominio `*.workers.dev` es válido como hostname de un widget.
- Se reconsidera si los términos impiden el uso comercial o si el widget genera fricción medible en las conversiones.

## ADR-006 — Modo de renderizado: sitio estático con un endpoint de servidor

**Estado:** Vigente (aprobado por el responsable)

**Fecha:** octubre de 2026

### Contexto

Astro prerenderiza todo por defecto. El único elemento que necesita código de servidor es el endpoint del formulario de contacto. El adaptador `@astrojs/cloudflare` ya está instalado y `astro.config.mjs` no define `output`, por lo que el sitio actual ya es estático con adaptador.

### Opciones consideradas

1. Mantener la salida estática por defecto y marcar solo el endpoint del formulario con `export const prerender = false`.
2. `output: "server"`: todas las páginas se renderizan bajo demanda.

### Decisión

Opción 1. Las páginas siguen prerenderizadas y el endpoint `POST /api/contact` (sin prefijo de idioma) es la única ruta bajo demanda.

### Evidencia

- Guía de renderizado bajo demanda de Astro: todo se prerenderiza por defecto, `prerender = false` activa el renderizado bajo demanda por página o endpoint, y un sitio estático con un endpoint de servidor es un caso soportado.
- Documentación del adaptador de Cloudflare: el renderizado bajo demanda requiere el adaptador, ya instalado.
- Precios de Workers: las solicitudes a assets estáticos son gratuitas e ilimitadas. El plan gratuito permite 100,000 solicitudes al día y 10 ms de CPU por invocación.

### Implicaciones

- Con la opción 1 solo el endpoint consume invocaciones de Workers; con la opción 2 lo haría cada visita a una página.
- Es compatible con ADR-004: la internacionalización usada no exige `output: "server"`.
- **No verificado:** que el endpoint (verificación de Turnstile, inserción en Supabase y envío con Resend) cumpla el límite de 10 ms de CPU. Debe medirse al implementarlo.
- Se reconsidera si el proyecto necesita muchas páginas renderizadas por petición, por ejemplo con la gestión de clientes mencionada en ADR-002.

## Regla para nuevos ADRs

Cuando una decisión cambie, agrega una entrada con identificador, fecha, contexto, alternativas, decisión e implicaciones. Si sustituye una decisión previa, conserva la anterior y enlaza ambos registros.
