-- Contact form submissions (docs/es/arquitectura.md). Run in the Supabase SQL editor.
-- RLS is enabled with no policies: the anon and authenticated roles cannot read or write.
-- Only the server, using the secret key (which bypasses RLS), inserts rows.
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null check (char_length(name) between 1 and 100),
  email text not null check (char_length(email) between 3 and 254),
  message text not null check (char_length(message) between 10 and 2000),
  locale text not null check (locale in ('es', 'en'))
);

alter table public.contact_messages enable row level security;
