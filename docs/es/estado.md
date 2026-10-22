# Estado del proyecto

**Última actualización:** octubre de 2026

## Estado verificado

- Proyecto Astro 7.4.1 generado con la plantilla mínima, con `@astrojs/cloudflare` 14.4.1 y `wrangler` instalados. Gestor de paquetes: bun.
- `src/pages/index.astro` sigue siendo la plantilla por defecto.
- `astro.config.mjs` está vacío: el adaptador está instalado pero no configurado.
- `wrangler.jsonc` apunta a Workers con Static Assets (`main` + `assets`).
- No existe formulario, estilos, componentes ni integración con Supabase o Resend.
- Hosting, previews y variables de entorno no están configurados.

## Decisiones vigentes

ADR-001 (actualizado), ADR-002 y ADR-003. Ver [decisiones.md](decisiones.md).

## Pendientes

1. Completar [contexto-marca.md](contexto-marca.md). Bloquea el diseño y el contenido.
2. Base técnica: excluir `.dev.vars` y `.wrangler/` en `.gitignore`, configurar el adaptador, crear `.dev.vars.example` y comprobar `bun run build` y `bun run preview`.
3. Construir la landing por ramas `feature/<tema>`: layout y estilos base, hero, servicios, formulario de contacto, SEO base.

## Decisiones abiertas (requieren ADR)

- Protección antispam del formulario.
- Mitigación de la pausa de Supabase por inactividad.
- Modo de renderizado de Astro: sitio estático con endpoint de servidor, o servidor completo.
- Idioma(s) del sitio.
- Confirmar con documentación oficial que Workers en plan gratuito permite uso comercial (ver ADR-003).

## Discrepancias detectadas

- `.claude/skills/README.md` está en git pero eliminado del working tree. Pendiente confirmar si fue intencional.
