import { afterEach, describe, expect, test } from 'bun:test';
import { LIMITS, parseContact, verifyTurnstile } from './contact';

const form = (fields: Record<string, string>) => {
  const data = new FormData();
  for (const [key, value] of Object.entries(fields)) data.set(key, value);
  return data;
};
const valid = {
  name: ' Ana ',
  email: 'ana@example.com',
  topic: 'other',
  message: 'Necesito un sistema',
  locale: 'es',
};

describe('parseContact', () => {
  test('accepts valid input and trims fields', () => {
    expect(parseContact(form(valid))).toEqual({ ...valid, name: 'Ana' });
  });
  test.each([
    ['empty name', { name: '  ' }],
    ['long name', { name: 'a'.repeat(LIMITS.name + 1) }],
    ['long email', { email: `${'a'.repeat(LIMITS.email)}@example.com` }],
    ['bad email', { email: 'ana@' }],
    ['short message with topic other', { message: 'corto' }],
    ['long message', { message: 'a'.repeat(LIMITS.message + 1) }],
    ['unknown locale', { locale: 'fr' }],
    ['missing topic', { topic: '' }],
    ['unknown topic', { topic: 'hack' }],
  ])('rejects %s', (_, override) => {
    expect(parseContact(form({ ...valid, ...override }))).toBeNull();
  });
  test('allows an empty message when a listed topic is chosen', () => {
    expect(parseContact(form({ ...valid, topic: 'inventory', message: '' }))).toMatchObject({
      topic: 'inventory',
      message: '',
    });
  });
  test('still bounds the message of a listed topic', () => {
    const long = 'a'.repeat(LIMITS.message + 1);
    expect(parseContact(form({ ...valid, topic: 'idea', message: long }))).toBeNull();
  });
});

describe('verifyTurnstile', () => {
  const realFetch = globalThis.fetch;
  afterEach(() => {
    globalThis.fetch = realFetch;
  });
  const mock = (res: Response | Error) => {
    globalThis.fetch = (async () => {
      if (res instanceof Error) throw res;
      return res;
    }) as unknown as typeof fetch;
  };

  test('true on success', async () => {
    mock(Response.json({ success: true }));
    expect(await verifyTurnstile('token', null, 'secret')).toBe(true);
  });
  test('false on empty token, failure, network error and non-JSON body', async () => {
    expect(await verifyTurnstile('', null, 'secret')).toBe(false);
    mock(Response.json({ success: false }));
    expect(await verifyTurnstile('token', null, 'secret')).toBe(false);
    mock(new Error('offline'));
    expect(await verifyTurnstile('token', null, 'secret')).toBe(false);
    mock(new Response('<html>', { status: 200 }));
    expect(await verifyTurnstile('token', null, 'secret')).toBe(false);
  });
});
