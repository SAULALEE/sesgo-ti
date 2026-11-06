-- Contact form submissions (docs/es/arquitectura.md). Run in the Supabase SQL editor.
-- RLS is enabled with no policies: the anon and authenticated roles cannot read or write.
-- Only the server, using the secret key (which bypasses RLS), inserts rows.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 100),
  topic text not null default 'other'
    check (topic in ('inventory', 'payments', 'questions', 'idea', 'other')),
  message text not null,
  locale text not null check (locale in ('es', 'en')),
  constraint contact_messages_message_check check (
    char_length(message) <= 2000 and (topic <> 'other' or char_length(message) >= 10)
  )
);

alter table public.contact_messages enable row level security;

-- Migration for a table created before the topic list existed (safe to run more than once).
-- The message is now optional detail unless the topic is 'other'.
alter table public.contact_messages
  add column if not exists topic text not null default 'other'
    check (topic in ('inventory', 'payments', 'questions', 'idea', 'other'));

-- Name and email are limited to 100 characters (replaces any earlier limit).
alter table public.contact_messages drop constraint if exists contact_messages_name_check;
alter table public.contact_messages drop constraint if exists contact_messages_email_check;
alter table public.contact_messages
  add constraint contact_messages_name_check check (char_length(name) between 1 and 100);
alter table public.contact_messages
  add constraint contact_messages_email_check check (char_length(email) between 3 and 100);

alter table public.contact_messages drop constraint if exists contact_messages_message_check;
alter table public.contact_messages add constraint contact_messages_message_check check (
  char_length(message) <= 2000 and (topic <> 'other' or char_length(message) >= 10)
);
