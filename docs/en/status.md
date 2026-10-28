# Project Status

> Spanish source: [`../es/estado.md`](../es/estado.md). The Spanish version is canonical; this file mirrors it.

**Last update:** October 2026

## Verified state

- Astro 7.4.1 project with `@astrojs/cloudflare` 14.4.1 and `wrangler` installed. Package manager: bun.
- `astro.config.mjs` registers the `cloudflare()` adapter, internationalization (ADR-004), the brand fonts, and `site` from the `SITE_URL` build variable.
- Implemented in `feature/landing`: base layout with language switcher (`/` in Spanish and `/en` in English), global styles, hero, services and process section, base SEO (titles, Open Graph, `robots.txt`; `canonical` and `hreflang` only if `SITE_URL` is set), and the contact form (component, `POST /api/contact` endpoint, and schema in `supabase/contact_messages.sql`). See [architecture.md](architecture.md).
- `bun run build` passes with and without `SITE_URL`, and with the form (verified on the `feature/landing` branch).
- The endpoint was tested in `bun run preview` with fake variables: it returns `400 invalid` for invalid data or a body that is not a form, `400 captcha` for a fake token, and `500 unavailable` without environment variables.
- `wrangler.jsonc` targets Workers with Static Assets (`main` + `assets`).
- `.gitignore` excludes `.wrangler/` and `.dev.vars*`; `.dev.vars.example` and `.env.example` list the variables.
- Not verified: the real integration with Turnstile, Supabase, and Resend (credentials are missing); the Supabase REST path and `turnstile.reset()`, not confirmed in the documentation; the endpoint's 10 ms CPU limit; browser appearance; `bun run dev`; and `astro check` (requires installing `@astrojs/check`).
- There is no sitemap, `og:image`, logo, or production domain.
- The actual deployment, per-branch previews, and secrets in Cloudflare are not configured.

## Branches

- Branches are grouped by area, not by task: `feature/landing` (hero, services, base SEO, and contact form) and `feature/docs` (documentation and ADRs).
- `feature/hero-section` on `origin` is an earlier branch, contained in `feature/landing`; whether to delete it is pending.
- None is merged into `staging` or `main`.

## Current decisions

ADR-001 (updated), ADR-002, ADR-003, ADR-004, ADR-005 (anti-spam with Cloudflare Turnstile), and ADR-006 (static site with a single server endpoint). See [decisions.md](decisions.md).

## Pending work

1. Complete [brand-context.md](brand-context.md). Still missing: the one-or-two-sentence description of SESGO TI, the sector and role of the decision maker, how conversion is measured, the logo files, and confirmation of whether real case studies, testimonials, or articles exist.
2. ~~Local technical base~~ (done): adapter, `.gitignore`, `.dev.vars.example`, build, and preview. Cloudflare deployment and per-branch previews are still to be configured.
3. Logo (mark and favicon): to be created by the owner; until then the header uses a text wordmark and the favicon is Astro's.
4. Landing page (`feature/landing`): layout and base styles, hero, services, base SEO, and the contact form are done. The end-to-end test is missing: create the Supabase project and run `supabase/contact_messages.sql`, create the Turnstile widget and the Resend account, and set the variables (see [architecture.md](architecture.md)).
5. Define the production domain. It enables `SITE_URL`, the sitemap, `canonical` and `hreflang`, and the Resend sender.
6. Merge the branches into `staging` after the checks in `04-quality-and-verification`. Requires the owner's consent.

## Open decisions

- Mitigation for Supabase's inactivity pause (requires an ADR). The Supabase billing FAQ page consulted does not document that pause; ADR-002 remains the only source.
- Confirm that Workers on the free plan allows commercial use (see ADR-003). The Workers pricing page does not mention it; Cloudflare's terms of service still need to be reviewed.

## Detected discrepancies

- `.claude/skills/README.md` is in git but deleted from the working tree. Pending confirmation of whether this was intentional.
