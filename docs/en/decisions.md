# Current Technical Decisions

> Spanish source: [`../es/decisiones.md`](../es/decisiones.md). The Spanish version is canonical; this file mirrors it.

> ADRs are kept because they explain why the project made a decision. When a decision changes, it is marked as superseded or updated; the earlier record is not deleted.

## How to read this page

- **Current:** describes the state that must be used now.
- **Updated:** keeps a valid decision, with later changes.
- **Superseded:** was correct at an earlier stage and must no longer be used.
- **Rejected:** was evaluated and not adopted.

Current decisions are written in the present tense. The context of an earlier decision is written in the past tense to make clear that it describes a historical stage.

## ADR-001 — Framework, hosting, and contact form handling

**Status:** Updated

**Original date:** October 2026

**Last update:** October 2026

> **Note:** the hosting (Cloudflare Pages) was updated by [ADR-003](#adr-003--deployment-target-cloudflare-workers). The text of this record is kept as originally written.

### Context

SESGO TI needs a landing page to attract external clients that showcases web application development, automation, and AI integration. Development is done by a single person, with no budget for a domain or paid hosting, and the contact form must send an email and store the data received.

### Options considered

1. Next.js deployed on Vercel (Hobby plan).
2. Astro deployed on Vercel (Hobby plan).
3. Astro deployed on Netlify, using Netlify Forms for the form.
4. Astro deployed on Cloudflare Pages, with Cloudflare D1 to store the data and Resend for email.

Vercel was ruled out for both variants: the Hobby plan expressly prohibits commercial use, and a client-acquisition site with a contact form falls within that restriction.

Netlify was considered for its native form handling, but was ruled out in favor of Cloudflare Pages based on hosting preference.

### Decision

The current stack is:

- Framework: Astro, using the official `@astrojs/cloudflare` adapter to enable server routes.
- Hosting: Cloudflare Pages (free plan, commercial use allowed).
- Form storage: Supabase (Postgres). The original record of this decision used Cloudflare D1; the full detail of this change, including an operational risk and its contingency alternative, is in ADR-002.
- Email sending: Resend (free plan), using the test address `onboarding@resend.dev` while no verified domain of our own exists. This address can only send to the Resend account's email, which matches the use case: notifying the owner of SESGO TI of a new lead, not third parties.

### Implications

- The site cannot be deployed on Vercel's free plan without violating its terms of service.
- Once a custom domain exists, the Resend sender is updated to that verified domain; the rest of the architecture does not change.
- Resend's free limits (100 emails per day, 3,000 per month) far exceed what a landing page contact form generates.

## ADR-002 — Data layer: Supabase

**Status:** Current

**Date:** October 2026

### Context

Storing the contact form (ADR-001) solved only that specific need. SESGO TI has a medium-term vision of client and quote management, which eventually requires authentication, record-level access control, and business logic beyond saving a form. Building that from scratch on Cloudflare D1 would mean writing authentication and access control by hand, with no backend framework.

### Options considered

1. Keep Cloudflare D1: enough to store the form, but with no authentication, row-level access control, or clear growth path toward client management.
2. Supabase: managed Postgres with built-in authentication, Row Level Security, Edge Functions, and an admin dashboard, compatible with the Cloudflare Workers runtime.
3. NestJS with a dedicated Postgres database manager, deployed as a standalone service.

### Decision

Contact form storage, and the project's database in general, uses Supabase (Postgres). It gives a real growth path toward authentication and client management without committing the project to a dedicated backend yet.

Email sending (Resend, see ADR-001) does not change and does not depend on Supabase.

### Implications

- Free Supabase projects are automatically paused after 7 days of inactivity and require manual reactivation from the dashboard. While form traffic is low, this must be checked periodically so the form does not fail without anyone noticing.
- Supabase's free plan allows commercial use.
- When the project needs client and quote management, Supabase already provides authentication and Row Level Security; there would be no need to migrate databases to build that functionality.

### Contingency alternative

If the inactivity pause risk becomes a real operational problem, or if the business logic grows beyond what Edge Functions can handle clearly, the next option is NestJS with a dedicated Postgres database manager, deployed as its own service. It uses the same language (TypeScript) as the rest of the project, with no need to introduce Java or Spring Boot. This route would be evaluated in its own ADR if it is ever activated.

## ADR-003 — Deployment target: Cloudflare Workers

**Status:** Current (updates the hosting of ADR-001)

**Date:** October 2026

### Context

ADR-001 chose Cloudflare Pages as hosting. The project generated with Astro 7 uses `@astrojs/cloudflare` v14, whose entry point targets Cloudflare Workers, and `wrangler.jsonc` defines `main` and `assets` (Workers with Static Assets), not a Pages project. The documentation and the implementation differed.

### Options considered

1. Keep Pages: would require pinning an older adapter version or reconfiguring the project, moving away from the path the official adapter supports today.
2. Cloudflare Workers with Static Assets: the target supported by the installed adapter and the one `wrangler.jsonc` already reflects.

### Decision

The deployment target is Cloudflare Workers with Static Assets. The rest of the stack in ADR-001 and ADR-002 does not change.

### Implications

- Per-branch previews are generated by Cloudflare's Workers integration, not Pages'. The `09-git-workflow` skill is updated accordingly.
- Secrets are set with `wrangler secret` in production and with `.dev.vars` locally; the latter is not versioned.
- **Pending verification against official documentation:** that Workers' free plan allows commercial use, and its current limits. This is not taken as true until confirmed, because ADR-001 relied on it for Pages.
- The per-branch build and deploy process (Workers Builds or other) is yet to be configured.

## ADR-004 — Internationalization: Spanish at the root, English under `/en`

**Status:** Current

**Date:** October 2026

### Context

The site is published in Spanish and English (brand context). The initial audience is Spanish-speaking SMBs. The default language was set by the project owner: Spanish.

### Options considered

1. Spanish at the root (`/`) and English under `/en`.
2. Both languages prefixed (`/es` and `/en`) with a redirect from `/`.

### Decision

Astro's internationalization routing is used with `defaultLocale: "es"`, `locales: ["es", "en"]`, and `routing.prefixDefaultLocale: false`. Spanish pages live at the root of `src/pages/` and English pages in `src/pages/en/`. Configuration taken from Astro's official internationalization guide.

### Implications

- Option 1 avoids a redirect at `/` and keeps Spanish URLs unprefixed.
- Every new page must exist in both languages; content is duplicated and must be kept in sync.
- Spanish copy uses the formal **usted** form of address.
- Custom per-locale paths require `output: "server"` and no prerendered pages, according to the documentation; they are not used here.
- Language switcher, `hreflang` tags, and per-language `<html lang>` are handled when implementing the layout and base SEO.

## Rule for new ADRs

When a decision changes, add an entry with identifier, date, context, alternatives, decision, and implications. If it supersedes a previous decision, keep the earlier one and link both records.
