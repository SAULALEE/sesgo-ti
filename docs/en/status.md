# Project Status

> Spanish source: [`../es/estado.md`](../es/estado.md). The Spanish version is canonical; this file mirrors it.

**Last update:** October 2026

## Verified state

- Astro 7.4.1 project generated from the minimal template, with `@astrojs/cloudflare` 14.4.1 and `wrangler` installed. Package manager: bun.
- `src/pages/index.astro` is still the default template.
- `astro.config.mjs` is empty: the adapter is installed but not configured.
- `wrangler.jsonc` targets Workers with Static Assets (`main` + `assets`).
- There is no form, styling, components, or Supabase/Resend integration.
- Hosting, previews, and environment variables are not configured.

## Current decisions

ADR-001 (updated), ADR-002, and ADR-003. See [decisions.md](decisions.md).

## Pending work

1. Complete [brand-context.md](brand-context.md). It blocks design and content.
2. Technical base: exclude `.dev.vars` and `.wrangler/` in `.gitignore`, configure the adapter, create `.dev.vars.example`, and check `bun run build` and `bun run preview`.
3. Build the landing page in `feature/<topic>` branches: layout and base styles, hero, services, contact form, base SEO.

## Open decisions (require an ADR)

- Form anti-spam protection.
- Mitigation for Supabase's inactivity pause.
- Astro rendering mode: static site with a server endpoint, or full server.
- Site language(s).
- Confirm against official documentation that Workers on the free plan allows commercial use (see ADR-003).

## Detected discrepancies

- `.claude/skills/README.md` is in git but deleted from the working tree. Pending confirmation of whether this was intentional.
