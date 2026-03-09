-- SeyrDijital V1 schema
create extension if not exists "pgcrypto";

create type public.admin_role as enum ('ADMIN', 'EDITOR');
create type public.contact_message_status as enum ('NEW', 'READ', 'ARCHIVED');
create type public.push_channel as enum ('ANNOUNCEMENT', 'LIVE_START');

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique,
  role public.admin_role not null,
  full_name text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.streams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  key text not null unique,
  stream_url text not null,
  cover_image_url text,
  is_live boolean not null default false,
  order_no integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  summary text,
  body text,
  cover_image_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.presenters (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  full_name text not null,
  bio text,
  avatar_url text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.program_presenters (
  id uuid primary key default gen_random_uuid(),
  program_id uuid not null references public.programs(id) on delete cascade,
  presenter_id uuid not null references public.presenters(id) on delete cascade,
  unique(program_id, presenter_id)
);

create table if not exists public.schedule_entries (
  id uuid primary key default gen_random_uuid(),
  day_of_week integer not null check(day_of_week between 0 and 6),
  starts_at text not null,
  ends_at text,
  title text not null,
  presenter_name text,
  program_id uuid references public.programs(id) on delete set null,
  is_replay boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.pages (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  content text,
  seo_description text,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.media_assets (
  id uuid primary key default gen_random_uuid(),
  file_name text not null,
  storage_path text not null,
  mime_type text,
  size_bytes bigint,
  alt_text text,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_settings (
  id uuid primary key default gen_random_uuid(),
  phone text,
  email text,
  address text,
  map_embed_url text,
  whatsapp text,
  instagram text,
  youtube text,
  facebook text,
  updated_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null,
  subject text not null,
  message text not null,
  status public.contact_message_status not null default 'NEW',
  created_at timestamptz not null default now()
);

create table if not exists public.announcements (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text,
  starts_at timestamptz,
  ends_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.push_campaigns (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  channel public.push_channel not null,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  scheduled_at timestamptz,
  sent_at timestamptz
);

create or replace function public.is_admin_or_editor()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users au
    where au.user_id = auth.uid()
      and au.is_active = true
      and au.role in ('ADMIN', 'EDITOR')
  );
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_streams_touch before update on public.streams for each row execute function public.touch_updated_at();
create trigger trg_programs_touch before update on public.programs for each row execute function public.touch_updated_at();
create trigger trg_presenters_touch before update on public.presenters for each row execute function public.touch_updated_at();
create trigger trg_schedule_touch before update on public.schedule_entries for each row execute function public.touch_updated_at();
create trigger trg_pages_touch before update on public.pages for each row execute function public.touch_updated_at();
create trigger trg_admin_users_touch before update on public.admin_users for each row execute function public.touch_updated_at();
create trigger trg_announcements_touch before update on public.announcements for each row execute function public.touch_updated_at();

alter table public.streams enable row level security;
alter table public.programs enable row level security;
alter table public.presenters enable row level security;
alter table public.program_presenters enable row level security;
alter table public.schedule_entries enable row level security;
alter table public.pages enable row level security;
alter table public.contact_settings enable row level security;
alter table public.contact_messages enable row level security;
alter table public.announcements enable row level security;
alter table public.push_campaigns enable row level security;
alter table public.media_assets enable row level security;
alter table public.admin_users enable row level security;

-- Public read policies
create policy streams_public_read on public.streams for select using (true);
create policy programs_public_read on public.programs for select using (is_published = true);
create policy presenters_public_read on public.presenters for select using (is_published = true);
create policy program_presenters_public_read on public.program_presenters for select using (true);
create policy schedule_public_read on public.schedule_entries for select using (true);
create policy pages_public_read on public.pages for select using (is_published = true);
create policy contact_settings_public_read on public.contact_settings for select using (true);
create policy announcements_public_read on public.announcements for select using (true);

-- Contact messages
create policy contact_messages_public_insert on public.contact_messages
for insert
with check (true);

create policy contact_messages_admin_read on public.contact_messages
for select
using (public.is_admin_or_editor());

-- Admin write policies
create policy streams_admin_write on public.streams
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy programs_admin_write on public.programs
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy presenters_admin_write on public.presenters
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy program_presenters_admin_write on public.program_presenters
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy schedule_admin_write on public.schedule_entries
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy pages_admin_write on public.pages
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy contact_settings_admin_write on public.contact_settings
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy announcements_admin_write on public.announcements
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy push_campaigns_admin_write on public.push_campaigns
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy media_assets_admin_write on public.media_assets
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());

create policy admin_users_admin_read on public.admin_users
for select using (public.is_admin_or_editor());

create policy admin_users_admin_write on public.admin_users
for all
using (public.is_admin_or_editor())
with check (public.is_admin_or_editor());