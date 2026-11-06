import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {
  parseContact,
  saveMessage,
  sendNotification,
  verifyTurnstile,
  type ContactConfig,
} from '../../lib/contact';

export const prerender = false;

const json = (body: { ok: boolean; error?: string }, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

function readConfig(): ContactConfig | null {
  const config: ContactConfig = {
    turnstileSecret: env.TURNSTILE_SECRET_KEY,
    supabaseUrl: env.SUPABASE_URL,
    supabaseSecretKey: env.SUPABASE_SECRET_KEY,
    resendApiKey: env.RESEND_API_KEY,
    toEmail: env.CONTACT_TO_EMAIL,
    fromEmail: env.CONTACT_FROM_EMAIL || 'SESGO TI <onboarding@resend.dev>',
  };
  return Object.values(config).every(Boolean) ? config : null;
}

export const POST: APIRoute = async ({ request }) => {
  const config = readConfig();
  if (!config) {
    console.error('contact: missing environment configuration');
    return json({ ok: false, error: 'unavailable' }, 500);
  }

  const form = await request.formData().catch(() => null);
  const input = form && parseContact(form);
  if (!form || !input) return json({ ok: false, error: 'invalid' }, 400);

  const token = form.get('cf-turnstile-response');
  const human = await verifyTurnstile(
    typeof token === 'string' ? token : '',
    request.headers.get('CF-Connecting-IP'),
    config.turnstileSecret,
  );
  if (!human) return json({ ok: false, error: 'captcha' }, 400);

  // Both destinations are attempted so a failure in one (for example a paused
  // Supabase project) does not lose the lead. The request fails only if both fail.
  const [saved, notified] = await Promise.all([
    saveMessage(config, input),
    sendNotification(config, input),
  ]);
  if (!saved) console.error('contact: could not save message to Supabase');
  if (!notified) console.error('contact: could not send notification with Resend');

  return saved || notified ? json({ ok: true }, 200) : json({ ok: false, error: 'unavailable' }, 502);
};
