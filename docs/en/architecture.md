# Architecture

> Spanish source: [`../es/arquitectura.md`](../es/arquitectura.md). The Spanish version is canonical; this file mirrors it.

Based on [ADR-001 to ADR-006](decisions.md). Describes the design; what is implemented and verified today is recorded in [status.md](status.md).

## Components

| Component | Technology | Role |
| --- | --- | --- |
| Site and server routes | Astro with `@astrojs/cloudflare` | Static landing pages and a single server endpoint, `POST /api/contact` (ADR-006) |
| Hosting | Cloudflare Workers with Static Assets | Serves the site and runs the endpoint |
| Anti-spam | Cloudflare Turnstile | Verifies that the submission comes from a person (ADR-005) |
| Database | Supabase (Postgres) | Stores form submissions |
| Email | Resend | Notifies the owner of each new lead |

## Contact form flow

```
Visitor
   │  fills in the form and the Turnstile widget
   ▼
POST /api/contact (Worker)
   │  1. validates the fields
   │  2. verifies the Turnstile token on the server
   ├──► 3a. Supabase: inserts the record   ┐ in parallel
   └──► 3b. Resend: notifies the owner      ┘
```

**Endpoint responses** (JSON `{ ok, error? }`):

| Code | `error` | Cause |
| --- | --- | --- |
| 200 | — | At least one of the two destinations (Supabase or Resend) succeeded |
| 400 | `invalid` | Missing fields, fields outside the limits, or a body that is not a form |
| 400 | `captcha` | Turnstile token missing, expired, or invalid |
| 502 | `unavailable` | Both Supabase and Resend failed |
| 500 | `unavailable` | An environment variable is missing |

**Partial failure handling.** Supabase and Resend are attempted at the same time. If one fails and the other works, the visitor gets success and the failure is logged in the Worker logs. This way a paused Supabase project (ADR-002) does not lose the contact while email keeps working. The request fails only if both fail.

**Validation limits:** name up to 100 characters, email up to 254, message 10 to 2000, locale `es` or `en`.

## Data schema

Defined in `supabase/contact_messages.sql`: table `contact_messages` with `id`, `created_at`, `name`, `email`, `message`, and `locale`, with the same length constraints as the endpoint. Row Level Security is enabled with no policies, so the `anon` and `authenticated` roles can neither read nor write. Only the server inserts rows, using the Supabase secret key, which bypasses RLS.

## Environment variables

Values are never versioned. Server variables go in `.dev.vars` locally and are set with `wrangler secret` in production; the public build variable goes in `.env`.

| Variable | Where | Use |
| --- | --- | --- |
| `SUPABASE_URL` | Server | Supabase project URL |
| `SUPABASE_SECRET_KEY` | Server | Secret key (`sb_secret_...`), sent in the `apikey` header |
| `RESEND_API_KEY` | Server | Email sending |
| `CONTACT_TO_EMAIL` | Server | Recipient of notifications |
| `CONTACT_FROM_EMAIL` | Server, optional | Sender; defaults to `SESGO TI <onboarding@resend.dev>` |
| `TURNSTILE_SECRET_KEY` | Server | Turnstile token verification |
| `PUBLIC_TURNSTILE_SITE_KEY` | Build (`.env`) | Public widget key; without it the form renders without the widget and the endpoint rejects submissions |
| `SITE_URL` | Build, optional | Production domain; enables `canonical` and `hreflang` |

## Known risks

- **Supabase pause on inactivity** (ADR-002): if the free project is paused, contacts arrive only by email and the failure appears only in the logs. There is no alert and no mitigation decided.
- **Resend test sender** (ADR-001): `onboarding@resend.dev` only sends to the Resend account's email. It must change once a custom domain exists.
- **JavaScript dependency:** the form submits with JavaScript; without it the browser would receive the endpoint's JSON response.
- **Not verified end to end:** the real integration with Turnstile, Supabase, and Resend has not been tested (credentials are missing). The Supabase REST path (`/rest/v1/contact_messages`) and resetting the widget with `turnstile.reset()` were not confirmed in the documentation.
- **Free Workers CPU limit** (ADR-006): 10 ms per invocation; the endpoint has not been measured.
