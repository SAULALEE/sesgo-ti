# Architecture

> Spanish source: [`../es/arquitectura.md`](../es/arquitectura.md). The Spanish version is canonical; this file mirrors it.

Based on [ADR-001, ADR-002, and ADR-003](decisions.md). Describes the target design; what is implemented today is recorded in [status.md](status.md).

## Components

| Component | Technology | Role |
| --- | --- | --- |
| Site and server routes | Astro with `@astrojs/cloudflare` | Landing page and form endpoint |
| Hosting | Cloudflare Workers with Static Assets | Serves the site and runs the endpoint |
| Database | Supabase (Postgres) | Stores form submissions |
| Email | Resend | Notifies the owner of each new lead |

## Contact form flow

```
Visitor
   │  submits the form
   ▼
Astro endpoint (Worker)
   │  validates the data
   ├──► Supabase: inserts the record
   └──► Resend: sends the notification to the owner
```

The order and failure handling (what happens if one of the two destinations fails) are not decided; they are defined when the form is implemented.

## Environment variables

Values are never versioned. Locally they go in `.dev.vars`; in production, set with `wrangler secret`.

| Variable | Use |
| --- | --- |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_*_KEY` | Access key; the exact type is defined at implementation |
| `RESEND_API_KEY` | Email sending |
| `CONTACT_TO_EMAIL` | Recipient of notifications |

## Known risks

- **Supabase pause on inactivity** (ADR-002): if the free project is paused, the form fails silently. No mitigation decided.
- **Resend test sender** (ADR-001): `onboarding@resend.dev` only sends to the Resend account's email. It must change once a custom domain exists.
- **Form abuse:** no anti-spam protection decided.
