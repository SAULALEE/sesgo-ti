import { locales, type Locale } from '../i18n/ui';

export const LIMITS = { name: 100, email: 100, message: 2000, messageMin: 10 } as const;

// Keys of the "what is your problem" list. The labels live in i18n/ui.ts. With any topic other
// than 'other' the message is optional detail; with 'other' it is the description (min length).
export const TOPICS = ['inventory', 'payments', 'questions', 'idea', 'other'] as const;
export type Topic = (typeof TOPICS)[number];

export interface ContactInput {
  name: string;
  email: string;
  topic: Topic;
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

export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function parseContact(form: FormData): ContactInput | null {
  const field = (key: string) => {
    const value = form.get(key);
    return typeof value === 'string' ? value.trim() : '';
  };
  const name = field('name');
  const email = field('email');
  const message = field('message');
  const topic = TOPICS.find((t) => t === field('topic'));
  const locale = locales.find((l) => l === field('locale'));

  if (!name || name.length > LIMITS.name) return null;
  if (!EMAIL_PATTERN.test(email) || email.length > LIMITS.email) return null;
  if (!topic || !locale) return null;
  if (message.length > LIMITS.message) return null;
  if (topic === 'other' && message.length < LIMITS.messageMin) return null;

  return { name, email, topic, message, locale };
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
  const result = (await res.json().catch(() => null)) as { success?: boolean } | null;
  return result?.success === true;
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
      text: `Nombre: ${input.name}\nCorreo: ${input.email}\nTema: ${input.topic}\nIdioma: ${input.locale}\n\n${input.message || '(sin detalles)'}`,
    }),
  });
  return res?.ok === true;
}
