import { locales, type Locale } from '../i18n/ui';

export const LIMITS = { name: 100, email: 254, message: 2000, messageMin: 10 } as const;

export interface ContactInput {
  name: string;
  email: string;
  message: string;
  locale: Locale;
}

export interface ContactConfig {
  turnstileSecret: string;
  supabaseUrl: string;
  supabaseSecretKey: string;
  resendApiKey: string;
  toEmail: string;
  fromEmail: string;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContact(form: FormData): ContactInput | null {
  const field = (key: string) => {
    const value = form.get(key);
    return typeof value === 'string' ? value.trim() : '';
  };
  const name = field('name');
  const email = field('email');
  const message = field('message');
  const locale = locales.find((l) => l === field('locale'));

  if (!name || name.length > LIMITS.name) return null;
  if (!EMAIL_PATTERN.test(email) || email.length > LIMITS.email) return null;
  if (message.length < LIMITS.messageMin || message.length > LIMITS.message) return null;
  if (!locale) return null;

  return { name, email, message, locale };
}

async function call(url: string, init: RequestInit): Promise<Response | null> {
  try {
    return await fetch(url, { ...init, signal: AbortSignal.timeout(8000) });
  } catch {
    return null;
  }
}

export async function verifyTurnstile(
  token: string,
  ip: string | null,
  secret: string,
): Promise<boolean> {
  if (!token || token.length > 2048) return false;
  const body = new URLSearchParams({ secret, response: token });
  if (ip) body.set('remoteip', ip);
  const res = await call('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    body,
  });
  if (!res?.ok) return false;
  const result = (await res.json()) as { success?: boolean };
  return result.success === true;
}

export async function saveMessage(config: ContactConfig, input: ContactInput): Promise<boolean> {
  const res = await call(`${config.supabaseUrl}/rest/v1/contact_messages`, {
    method: 'POST',
    headers: {
      apikey: config.supabaseSecretKey,
      'Content-Type': 'application/json',
      Prefer: 'return=minimal',
    },
    body: JSON.stringify(input),
  });
  return res?.ok === true;
}

export async function sendNotification(
  config: ContactConfig,
  input: ContactInput,
): Promise<boolean> {
  const res = await call('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${config.resendApiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: config.fromEmail,
      to: config.toEmail,
      reply_to: input.email,
      subject: `Nuevo contacto: ${input.name.replace(/[\r\n]+/g, ' ')}`,
      text: `Nombre: ${input.name}\nCorreo: ${input.email}\nIdioma: ${input.locale}\n\n${input.message}`,
    }),
  });
  return res?.ok === true;
}
