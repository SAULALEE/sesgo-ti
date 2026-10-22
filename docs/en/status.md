# Project Status

> Spanish source: [`../es/estado.md`](../es/estado.md). The Spanish version is canonical; this file mirrors it.

**Last update:** October 2026

## Verified state

- Astro 7.4.1 project generated from the minimal template, with `@astrojs/cloudflare` 14.4.1 and `wrangler` installed. Package manager: bun.
- `src/pages/index.astro` is still the default template.
- `astro.config.mjs` registers the `cloudflare()` adapter. `bun run build` passes and `bun run preview` serves `/` (verified; `bun run dev` was not tested).
- `wrangler.jsonc` targets Workers with Static Assets (`main` + `assets`).
- `.gitignore` excludes `.wrangler/` and `.dev.vars*`; `.dev.vars.example` lists the variables (the Supabase key name is provisional).
- There is no form, styling, components, or Supabase/Resend integration.
- The actual deployment, per-branch previews, and secrets in Cloudflare are not configured.

## Current decisions

ADR-001 (updated), ADR-002, ADR-003, and ADR-004. See [decisions.md](decisions.md).

## Pending work

1. Complete [brand-context.md](brand-context.md). It blocks design and content.
2. ~~Local technical base~~ (done): adapter, `.gitignore`, `.dev.vars.example`, build, and preview. Cloudflare deployment and per-branch previews are still to be configured.
3. Logo (mark and favicon): to be created by the owner; until then the header uses a text wordmark and the favicon is Astro's.
4. Build the landing page in `feature/<topic>` branches: layout and base styles, hero, services, contact form, base SEO.

## Open decisions (require an ADR)

- Form anti-spam protection.
- Mitigation for Supabase's inactivity pause.
- Astro rendering mode: static site with a server endpoint, or full server.
- Confirm against official documentation that Workers on the free plan allows commercial use (see ADR-003).

## Detected discrepancies

- `.claude/skills/README.md` is in git but deleted from the working tree. Pending confirmation of whether this was intentional.
