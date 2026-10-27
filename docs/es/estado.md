# Estado del proyecto

**Última actualización:** octubre de 2026

## Estado verificado

- Proyecto Astro 7.4.1 con `@astrojs/cloudflare` 14.4.1 y `wrangler` instalados. Gestor de paquetes: bun.
- `astro.config.mjs` registra el adaptador `cloudflare()`, la internacionalización (ADR-004), las fuentes de marca y `site` desde la variable de build `SITE_URL`.
- Implementado: layout base con selector de idioma (`/` en español y `/en` en inglés), estilos globales, hero, sección de servicios y proceso, y SEO base (títulos, Open Graph, `robots.txt`; `canonical` y `hreflang` solo si se define `SITE_URL`).
- `bun run build` pasa con y sin `SITE_URL` (verificado en la rama `feature/seo-base`).
- `wrangler.jsonc` apunta a Workers con Static Assets (`main` + `assets`).
- `.gitignore` excluye `.wrangler/` y `.dev.vars*`; `.dev.vars.example` lista las variables (el nombre de la clave de Supabase es provisional).
- No verificado: la apariencia en navegador, `bun run dev`, `bun run preview` tras los últimos cambios y `astro check` (requiere instalar `@astrojs/check`).
- No existe formulario ni integración con Supabase o Resend. Tampoco hay sitemap, `og:image`, logo ni dominio de producción.
- El despliegue real, las previews por rama y los secretos en Cloudflare no están configurados.

## Ramas

- Las ramas de funcionalidad están encadenadas: `feature/hero-section` → `feature/services-section` → `feature/seo-base` → `feature/docs-adr-005-006`.
- Ninguna está fusionada a `main`. Solo `main` y `feature/hero-section` existen en `origin`.

## Decisiones vigentes

ADR-001 (actualizado), ADR-002, ADR-003, ADR-004, ADR-005 (antispam con Cloudflare Turnstile) y ADR-006 (sitio estático con un solo endpoint de servidor). Ver [decisiones.md](decisiones.md).

## Pendientes

1. Completar [contexto-marca.md](contexto-marca.md). Faltan la descripción de SESGO TI en una o dos frases, el sector y rol de quien decide, la medición de la conversión, los archivos del logo y confirmar si existen casos, testimonios o artículos reales.
2. ~~Base técnica local~~ (hecho): adaptador, `.gitignore`, `.dev.vars.example`, build y preview. Falta configurar el despliegue en Cloudflare y las previews por rama.
3. Logo (isotipo y favicon): el responsable debe generarlo; hasta entonces el header usa un wordmark de texto y el favicon es el de Astro.
4. Landing por ramas `feature/<tema>`: layout y estilos base, hero, servicios y SEO base están hechos; falta el formulario de contacto (endpoint, Supabase y Resend). Se implementa según ADR-005 y ADR-006.
5. Definir el dominio de producción. Habilita `SITE_URL`, el sitemap, `canonical` y `hreflang`, y el remitente de Resend.
6. Fusionar las ramas a `staging` tras las verificaciones de `04-quality-and-verification`. Requiere el consentimiento del responsable.

## Decisiones abiertas

- Mitigación de la pausa de Supabase por inactividad (requiere ADR). La página de preguntas de facturación de Supabase consultada no documenta esa pausa; ADR-002 sigue siendo la única fuente.
- Confirmar que Workers en plan gratuito permite uso comercial (ver ADR-003). La página de precios de Workers no lo menciona; falta revisar los términos de servicio de Cloudflare.

## Discrepancias detectadas

- `.claude/skills/README.md` está en git pero eliminado del working tree. Pendiente confirmar si fue intencional.
