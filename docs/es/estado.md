# Estado del proyecto

**Última actualización:** noviembre de 2026

## Estado verificado

- Proyecto Astro 7.4.1 con `@astrojs/cloudflare` 14.4.1 y `wrangler` instalados. Gestor de paquetes: bun.
- `astro.config.mjs` registra el adaptador `cloudflare()`, la internacionalización (ADR-004), las fuentes de marca y `site` desde la variable de build `SITE_URL`.
- Implementado en `feature/landing`: landing migrada del prototipo de Claude Design a componentes Astro y TypeScript de cliente, sin dependencias nuevas, en español (`/`) e inglés (`/en`). Incluye header con menú y selector de idioma, hero, "¿Te suena?", casos con cuatro demos interactivas, servicios, proceso, contacto y pie, con sus animaciones. También SEO base (títulos, Open Graph, `robots.txt`; `canonical` y `hreflang` solo si se define `SITE_URL`) y formulario de contacto (componente, endpoint `POST /api/contact` y esquema en `supabase/contact_messages.sql`), con la misma lógica y un aspecto nuevo. Además, las secciones «Un proyecto real» (Katedra, con su página real en miniatura mediante un iframe) y «Lo que cuesta», y un cambio de idioma que conserva la posición de lectura con una animación de barrido. Ver [arquitectura.md](arquitectura.md).
- Verificado en navegador con `bun run preview` (`/` y `/en`): hojas apiladas, cinta, revelado de títulos, pasos, tono del header, transiciones de casos, las cuatro demos, hover de servicios, menú y prellenado del formulario. Sin errores de consola. A 375 y 768 px se midió el layout dentro de un iframe, sin desbordes.
- Los estados de éxito y error del formulario se probaron simulando la respuesta del endpoint. `prefers-reduced-motion` se probó solo en la lógica de JavaScript, simulando la consulta de medios.
- `bun run build` pasa con y sin `SITE_URL`, y con el formulario (verificado en la rama `feature/landing`).
- `bun run check` (`wrangler types` y `astro check`, con TypeScript 6) pasa con 0 errores, 0 advertencias y 0 sugerencias (verificado en `feature/landing`). `worker-configuration.d.ts` se genera con ese comando y no se versiona.
- El endpoint se probó en `bun run preview` con variables falsas: responde `400 invalid` ante datos inválidos o un cuerpo que no es un formulario, `400 captcha` ante un token falso y `500 unavailable` sin variables de entorno.
- `wrangler.jsonc` apunta a Workers con Static Assets (`main` + `assets`).
- `.gitignore` excluye `.wrangler/` y `.dev.vars*`; `.dev.vars.example` y `.env.example` listan las variables.
- Formulario de contacto (noviembre de 2026, `bun run preview`): Supabase, Turnstile y la clave secreta están configurados en local; un envío real guardó una fila en `contact_messages` (RLS activo, sin políticas). El campo «¿Cuál es tu problema?» ahora es una lista de temas (inventario, pagos, preguntas repetidas, idea, otro) más un mensaje opcional, obligatorio solo con «Otro»; el formulario valida cada campo en línea y el servidor repite la validación. La lógica de validación se comprobó en el navegador simulando envíos y con `bun test`; el aspecto visual se vio solo en una ventana pequeña.
- Verificado en navegador (noviembre de 2026): `/` y `/en` renderizan todas las secciones sin errores de consola en ventanas de 390, 768, 820 y 1440 px, sin desborde horizontal; el menú de seis enlaces cabe completo y el logotipo no se solapa con los botones del encabezado. Los tamaños se probaron cargando la página en un iframe de ese ancho. `bun run dev` responde 200 en `/` y `/en`.
- Verificado (noviembre de 2026): un envío real con tema «inventario» guardó la fila con `topic` en Supabase (migración aplicada) y el responsable confirmó que llegó el correo de Resend. No verificado: Safari y Firefox (en Firefox la miniatura de Katedra usa `transform` en lugar de `zoom`); `turnstile.reset()` tras un envío, no confirmado en la documentación; el límite de 10 ms de CPU del endpoint; el rendimiento y la apariencia en un móvil real; y la regla CSS de `prefers-reduced-motion`. La miniatura de Katedra depende de que `katedra-client.vercel.app` siga permitiendo ser incrustado.
- Botón de WhatsApp (noviembre de 2026): fijo en el encabezado (solo ícono por debajo de 640 px; el reloj se oculta por debajo de 1181 px y «Escríbeme» por debajo de 641 px) y en el pie, con enlace `wa.me` y el mensaje predeterminado de `contact.whatsappMessage`. Medido sin solapes en 24 combinaciones de ancho e idioma; no se probó abrir WhatsApp desde un móvil.
- No hay sitemap, `og:image`, logo ni dominio de producción.
- El despliegue real, las previews por rama y los secretos en Cloudflare no están configurados.

## Ramas

- Se agrupa por área, no por tarea: `feature/landing` (hero, servicios, SEO base y formulario de contacto) y `feature/docs` (documentación y ADRs).
- `staging` (publicada en `origin`) contiene `feature/docs` y `feature/landing`. `main` no ha recibido cambios desde el andamiaje inicial y solo recibe `staging` después de que el responsable la pruebe.
- La migración de la landing a componentes, con las secciones «Un proyecto real» y «Lo que cuesta», se fusionó a `staging` en noviembre de 2026.
- `feature/hero-section` se eliminó de `origin`; su commit está contenido en `feature/landing`.

## Decisiones vigentes

ADR-001 (actualizado), ADR-002, ADR-003, ADR-004, ADR-005 (antispam con Cloudflare Turnstile), ADR-006 (sitio estático con un solo endpoint de servidor), ADR-007 (voz y posicionamiento de la landing) y ADR-008 (título principal de la landing). Ver [decisiones.md](decisiones.md).

## Pendientes

1. Completar [contexto-marca.md](contexto-marca.md). Faltan la descripción de SESGO TI en una o dos frases, el rol de quien decide, la medición de la conversión, los archivos del logo, confirmar si existen casos, testimonios o artículos reales, y revisar las secciones 4 y 9 frente a ADR-007.
2. ~~Base técnica local~~ (hecho): adaptador, `.gitignore`, `.dev.vars.example`, build y preview. Falta configurar el despliegue en Cloudflare y las previews por rama.
3. Logo (isotipo y favicon): el responsable debe generarlo; hasta entonces el header usa un wordmark de texto y el favicon es el de Astro.
4. Landing (`feature/landing`): la migración está hecha. Faltan revisar la traducción al inglés, llenar correo, ciudad y tiempo de respuesta en `src/lib/site.ts` (vacíos se ocultan) y terminar la prueba de extremo a extremo: ejecutar la migración de `topic` de `supabase/contact_messages.sql`, confirmar que llega el correo de Resend y comprobar `turnstile.reset()` (variables en [arquitectura.md](arquitectura.md)). La migración y el correo ya se confirmaron.
5. Definir el dominio de producción. Habilita `SITE_URL`, el sitemap, `canonical` y `hreflang`, y el remitente de Resend.
6. Probar `staging` (ya incluye `feature/landing`) y fusionarla a `main`. Requiere el consentimiento del responsable. Las previews por rama aún no están configuradas.

## Decisiones abiertas

- Pausa de Supabase por inactividad: ADR-009 propone un flujo programado de GitHub Actions (`.github/workflows/supabase-keepalive.yml`). Falta guardar `SUPABASE_URL` y `SUPABASE_SECRET_KEY` como secretos del repositorio, ejecutarlo una vez y observar durante semanas que el proyecto no se pausa. La FAQ de Supabase confirma la pausa de 7 días.
- Confirmar que Workers en plan gratuito permite uso comercial (ver ADR-003). La página de precios de Workers no lo menciona; falta revisar los términos de servicio de Cloudflare.

## Discrepancias detectadas

- Ninguna pendiente. `.claude/skills/README.md` se eliminó a propósito; cada skill se describe en su `SKILL.md`.
