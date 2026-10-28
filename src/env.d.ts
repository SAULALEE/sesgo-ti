/// <reference types="astro/client" />

declare namespace Cloudflare {
  interface Env {
    SUPABASE_URL: string;
    SUPABASE_SECRET_KEY: string;
    RESEND_API_KEY: string;
    CONTACT_TO_EMAIL: string;
    CONTACT_FROM_EMAIL?: string;
    TURNSTILE_SECRET_KEY: string;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_TURNSTILE_SITE_KEY?: string;
}
