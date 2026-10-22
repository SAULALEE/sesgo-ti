# Estado del proyecto

**Última actualización:** octubre de 2026

## Estado verificado

- Proyecto Astro 7.4.1 generado con la plantilla mínima, con `@astrojs/cloudflare` 14.4.1 y `wrangler` instalados. Gestor de paquetes: bun.
- `src/pages/index.astro` sigue siendo la plantilla por defecto.
- `astro.config.mjs` registra el adaptador `cloudflare()`. `bun run build` pasa y `bun run preview` sirve `/` (verificado; `bun run dev` no se probó).
- `wrangler.jsonc` apunta a Workers con Static Assets (`main` + `assets`).
- `.gitignore` excluye `.wrangler/` y `.dev.vars*`; `.dev.vars.example` lista las variables (el nombre de la clave de Supabase es provisional).
- No existe formulario, estilos, componentes ni integración con Supabase o Resend.
- El despliegue real, las previews por rama y los secretos en Cloudflare no están configurados.

## Decisiones vigentes

ADR-001 (actualizado), ADR-002, ADR-003 y ADR-004. Ver [decisiones.md](decisiones.md).

## Pendientes

1. Completar [contexto-marca.md](contexto-marca.md). Bloquea el diseño y el contenido.
2. ~~Base técnica local~~ (hecho): adaptador, `.gitignore`, `.dev.vars.example`, build y preview. Falta configurar el despliegue en Cloudflare y las previews por rama.
3. Logo (isotipo y favicon): el responsable debe generarlo; hasta entonces el header usa un wordmark de texto y el favicon es el de Astro.
4. Construir la landing por ramas `feature/<tema>`: layout y estilos base, hero, servicios, formulario de contacto, SEO base.

## Decisiones abiertas (requieren ADR)

- Protección antispam del formulario.
- Mitigación de la pausa de Supabase por inactividad.
- Modo de renderizado de Astro: sitio estático con endpoint de servidor, o servidor completo.
- Confirmar con documentación oficial que Workers en plan gratuito permite uso comercial (ver ADR-003).

## Discrepancias detectadas

- `.claude/skills/README.md` está en git pero eliminado del working tree. Pendiente confirmar si fue intencional.
