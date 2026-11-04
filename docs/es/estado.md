# Estado del proyecto

**Última actualización:** noviembre de 2026

## Estado verificado

- Proyecto Astro 7.4.1 con `@astrojs/cloudflare` 14.4.1 y `wrangler` instalados. Gestor de paquetes: bun.
- `astro.config.mjs` registra el adaptador `cloudflare()`, la internacionalización (ADR-004), las fuentes de marca y `site` desde la variable de build `SITE_URL`.
- Implementado en `feature/landing`: landing migrada del prototipo de Claude Design a componentes Astro y TypeScript de cliente, sin dependencias nuevas, en español (`/`) e inglés (`/en`). Incluye header con menú y selector de idioma, hero, "¿Te suena?", casos con cuatro demos interactivas, servicios, proceso, contacto y pie, con sus animaciones. También SEO base (títulos, Open Graph, `robots.txt`; `canonical` y `hreflang` solo si se define `SITE_URL`) y formulario de contacto (componente, endpoint `POST /api/contact` y esquema en `supabase/contact_messages.sql`), con la misma lógica y un aspecto nuevo. Ver [arquitectura.md](arquitectura.md).
- Verificado en navegador con `bun run preview` (`/` y `/en`): hojas apiladas, cinta, revelado de títulos, pasos, tono del header, transiciones de casos, las cuatro demos, hover de servicios, menú y prellenado del formulario. Sin errores de consola. A 375 y 768 px se midió el layout dentro de un iframe, sin desbordes.
- Los estados de éxito y error del formulario se probaron simulando la respuesta del endpoint. `prefers-reduced-motion` se probó solo en la lógica de JavaScript, simulando la consulta de medios.
- `bun run build` pasa con y sin `SITE_URL`, y con el formulario (verificado en la rama `feature/landing`).
- `bun run check` (`wrangler types` y `astro check`, con TypeScript 6) pasa con 0 errores, 0 advertencias y 0 sugerencias (verificado en `feature/landing`). `worker-configuration.d.ts` se genera con ese comando y no se versiona.
- El endpoint se probó en `bun run preview` con variables falsas: responde `400 invalid` ante datos inválidos o un cuerpo que no es un formulario, `400 captcha` ante un token falso y `500 unavailable` sin variables de entorno.
- `wrangler.jsonc` apunta a Workers con Static Assets (`main` + `assets`).
- `.gitignore` excluye `.wrangler/` y `.dev.vars*`; `.dev.vars.example` y `.env.example` listan las variables.
- `.dev.vars` no define `TURNSTILE_SECRET_KEY`, por lo que el endpoint responde `500 unavailable` en local.
- No verificado: la integración real con Turnstile, Supabase y Resend; la ruta REST de Supabase y `turnstile.reset()`, no confirmadas en la documentación; el límite de 10 ms de CPU del endpoint; el rendimiento y la apariencia en un móvil real; la regla CSS de `prefers-reduced-motion`; y `bun run dev`.
- No hay sitemap, `og:image`, logo ni dominio de producción.
- El despliegue real, las previews por rama y los secretos en Cloudflare no están configurados.

## Ramas

- Se agrupa por área, no por tarea: `feature/landing` (hero, servicios, SEO base y formulario de contacto) y `feature/docs` (documentación y ADRs).
- `staging` (publicada en `origin`) contiene `feature/docs` y la primera versión de `feature/landing`. `main` no ha recibido cambios desde el andamiaje inicial y solo recibe `staging` después de que el responsable la pruebe.
- La migración de la landing a componentes está en `feature/landing`, sin fusionar a `staging`.
- `feature/hero-section` se eliminó de `origin`; su commit está contenido en `feature/landing`.

## Decisiones vigentes

ADR-001 (actualizado), ADR-002, ADR-003, ADR-004, ADR-005 (antispam con Cloudflare Turnstile), ADR-006 (sitio estático con un solo endpoint de servidor) y ADR-007 (voz y posicionamiento de la landing). Ver [decisiones.md](decisiones.md).

## Pendientes

1. Completar [contexto-marca.md](contexto-marca.md). Faltan la descripción de SESGO TI en una o dos frases, el rol de quien decide, la medición de la conversión, los archivos del logo, confirmar si existen casos, testimonios o artículos reales, y revisar las secciones 4 y 9 frente a ADR-007.
2. ~~Base técnica local~~ (hecho): adaptador, `.gitignore`, `.dev.vars.example`, build y preview. Falta configurar el despliegue en Cloudflare y las previews por rama.
3. Logo (isotipo y favicon): el responsable debe generarlo; hasta entonces el header usa un wordmark de texto y el favicon es el de Astro.
4. Landing (`feature/landing`): la migración está hecha. Faltan revisar la traducción al inglés, llenar correo, WhatsApp, ciudad y tiempo de respuesta en `src/lib/site.ts` (vacíos se ocultan) y la prueba de extremo a extremo: crear el proyecto de Supabase y ejecutar `supabase/contact_messages.sql`, crear el widget de Turnstile y la cuenta de Resend, y definir las variables (ver [arquitectura.md](arquitectura.md)).
5. Definir el dominio de producción. Habilita `SITE_URL`, el sitemap, `canonical` y `hreflang`, y el remitente de Resend.
6. Fusionar `feature/landing` a `staging` tras las verificaciones de `04-quality-and-verification`; después probar `staging` y fusionarla a `main`. Requiere el consentimiento del responsable. Las previews por rama aún no están configuradas.

## Decisiones abiertas

- Mitigación de la pausa de Supabase por inactividad (requiere ADR). La página de preguntas de facturación de Supabase consultada no documenta esa pausa; ADR-002 sigue siendo la única fuente.
- Confirmar que Workers en plan gratuito permite uso comercial (ver ADR-003). La página de precios de Workers no lo menciona; falta revisar los términos de servicio de Cloudflare.

## Discrepancias detectadas

- `.claude/skills/README.md` está en git pero eliminado del working tree. Pendiente confirmar si fue intencional.
