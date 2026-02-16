-- Expanded-but-compatible schema for this app (Supabase Auth)
-- Safe to re-run (idempotent where possible).
-- Apply in Supabase SQL Editor.
--
-- IMPORTANT (compatibility):
-- Older versions of this project used `owner_id`. The current frontend uses `user_id`.
-- This schema ensures BOTH columns exist on key tables and backfills/syncs them.

-- ==============
-- Extensions
-- ==============
create extension if not exists pgcrypto;

-- ==============
-- Helper functions
-- ==============
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.ensure_user_id_and_owner_id()
returns trigger
language plpgsql
as $$
begin
  if new.user_id is null then
    -- When inserting from client with auth, this sets user_id automatically.
    -- When inserting from service role, auth.uid() will be null; in that case you must provide user_id explicitly.
    new.user_id = auth.uid();
  end if;

  if new.owner_id is null then
    new.owner_id = new.user_id;
  end if;

  return new;
end;
$$;

-- ==============
-- Core tables
-- ==============

-- Financial documents
create table if not exists public.financial_documents (
  id text primary key,
  type text not null check (type in ('quotation', 'invoice', 'receipt')),

  customer_name text not null,
  property text not null,

  date date not null,
  due_date date,
  valid_until date,

  payment_method text,
  notes text,

  items jsonb not null default '[]'::jsonb,
  include_vat boolean not null default true,
  vat_rate numeric not null default 7,
  discount numeric not null default 0,
  discount_type text not null default 'percent',

  enable_installments boolean not null default false,
  installments jsonb not null default '[]'::jsonb,

  subtotal numeric,
  after_discount numeric,
  vat numeric,
  total numeric,

  status text not null default 'pending' check (status in ('pending', 'approved', 'unpaid', 'paid')),

  stripe_checkout_session_id text,
  stripe_payment_intent_id text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists financial_documents_type_idx on public.financial_documents (type);
create index if not exists financial_documents_status_idx on public.financial_documents (status);

alter table public.financial_documents enable row level security;

-- ==============
-- Address lookup (postal code -> province/district/subdistrict)
-- ==============

create table if not exists public.postal_code_areas (
  id bigserial primary key,
  postal_code text not null,
  province text not null,
  district text not null,
  subdistrict text not null
);

alter table public.postal_code_areas add column if not exists postal_code text;
alter table public.postal_code_areas add column if not exists province text;
alter table public.postal_code_areas add column if not exists district text;
alter table public.postal_code_areas add column if not exists subdistrict text;

create index if not exists postal_code_areas_postal_code_idx on public.postal_code_areas (postal_code);
create index if not exists postal_code_areas_province_idx on public.postal_code_areas (province);

alter table public.postal_code_areas enable row level security;

-- Customers (1 row per user)
create table if not exists public.customers (
  id uuid primary key default gen_random_uuid(),

  -- Compatibility columns: keep both; app uses user_id.
  user_id uuid references auth.users (id) on delete cascade,
  owner_id uuid references auth.users (id) on delete cascade,

  name text,
  phone text,
  email text,

  member_since timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Ensure columns exist even if table existed already
alter table public.customers add column if not exists user_id uuid;
alter table public.customers add column if not exists owner_id uuid;
alter table public.customers add column if not exists name text;
alter table public.customers add column if not exists phone text;
alter table public.customers add column if not exists email text;
alter table public.customers add column if not exists member_since timestamptz not null default now();
alter table public.customers add column if not exists created_at timestamptz not null default now();
alter table public.customers add column if not exists updated_at timestamptz not null default now();

-- Backfill/sync (safe to rerun)
update public.customers set user_id = owner_id where user_id is null and owner_id is not null;
update public.customers set owner_id = user_id where owner_id is null and user_id is not null;

-- Ensure we have a unique index for upsert(onConflict: 'user_id')
create unique index if not exists customers_user_id_uidx on public.customers (user_id);

-- Add FK constraints if missing (idempotent)
do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'customers_user_id_fkey') then
    alter table public.customers
      add constraint customers_user_id_fkey
      foreign key (user_id)
      references auth.users (id)
      on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'customers_owner_id_fkey') then
    alter table public.customers
      add constraint customers_owner_id_fkey
      foreign key (owner_id)
      references auth.users (id)
      on delete cascade;
  end if;
end $$;

alter table public.customers enable row level security;

-- Properties
create table if not exists public.properties (
  id uuid primary key default gen_random_uuid(),

  -- Compatibility columns
  user_id uuid references auth.users (id) on delete cascade,
  owner_id uuid references auth.users (id) on delete cascade,

  name text not null,
  address text,
  sub_district text,
  district text,
  province text,
  postal_code text,

  contact_name text,
  contact_phone text,

  services text[] not null default '{}'::text[],
  garden_area_m2 numeric,
  garden_width_m numeric,
  garden_length_m numeric,
  need_measurement boolean not null default false,
  soil_type text,
  sunlight text,
  water_source text,
  special_requests text,

  garden_type text,
  thumbnail_url text,
  health_score int,
  next_service_date date,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.properties add column if not exists user_id uuid;
alter table public.properties add column if not exists owner_id uuid;
alter table public.properties add column if not exists name text;
alter table public.properties add column if not exists address text;
alter table public.properties add column if not exists sub_district text;
alter table public.properties add column if not exists district text;
alter table public.properties add column if not exists province text;
alter table public.properties add column if not exists postal_code text;
alter table public.properties add column if not exists contact_name text;
alter table public.properties add column if not exists contact_phone text;
alter table public.properties add column if not exists services text[] not null default '{}'::text[];
alter table public.properties add column if not exists garden_area_m2 numeric;
alter table public.properties add column if not exists garden_width_m numeric;
alter table public.properties add column if not exists garden_length_m numeric;
alter table public.properties add column if not exists need_measurement boolean not null default false;
alter table public.properties add column if not exists soil_type text;
alter table public.properties add column if not exists sunlight text;
alter table public.properties add column if not exists water_source text;
alter table public.properties add column if not exists special_requests text;
alter table public.properties add column if not exists garden_type text;
alter table public.properties add column if not exists thumbnail_url text;
alter table public.properties add column if not exists health_score int;
alter table public.properties add column if not exists next_service_date date;
alter table public.properties add column if not exists created_at timestamptz not null default now();
alter table public.properties add column if not exists updated_at timestamptz not null default now();

update public.properties set user_id = owner_id where user_id is null and owner_id is not null;
update public.properties set owner_id = user_id where owner_id is null and user_id is not null;

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'properties_user_id_fkey') then
    alter table public.properties
      add constraint properties_user_id_fkey
      foreign key (user_id)
      references auth.users (id)
      on delete cascade;
  end if;

  if not exists (select 1 from pg_constraint where conname = 'properties_owner_id_fkey') then
    alter table public.properties
      add constraint properties_owner_id_fkey
      foreign key (owner_id)
      references auth.users (id)
      on delete cascade;
  end if;
end $$;

-- PostgREST may use a stale schema cache right after migrations.
-- This forces a schema cache reload so new columns are visible immediately.
notify pgrst, 'reload schema';

create index if not exists properties_user_id_idx on public.properties (user_id);

alter table public.properties enable row level security;

-- ==============
-- Grants (required for Supabase client to work with RLS)
-- ==============
grant usage on schema public to anon, authenticated;
grant select, insert, update, delete on table public.customers to anon, authenticated;
grant select, insert, update, delete on table public.properties to anon, authenticated;
grant select on table public.postal_code_areas to anon, authenticated;

-- ==============
-- Triggers
-- ==============

drop trigger if exists set_updated_at_customers on public.customers;
create trigger set_updated_at_customers
before update on public.customers
for each row execute function public.set_updated_at();

drop trigger if exists ensure_user_id_and_owner_id_customers on public.customers;
create trigger ensure_user_id_and_owner_id_customers
before insert on public.customers
for each row execute function public.ensure_user_id_and_owner_id();

drop trigger if exists set_updated_at_properties on public.properties;
create trigger set_updated_at_properties
before update on public.properties
for each row execute function public.set_updated_at();

drop trigger if exists ensure_user_id_and_owner_id_properties on public.properties;
create trigger ensure_user_id_and_owner_id_properties
before insert on public.properties
for each row execute function public.ensure_user_id_and_owner_id();

-- ==============
-- Row Level Security (RLS) policies
-- ==============

do $$
begin
  -- CUSTOMERS
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'customers' and policyname = 'Customers can view own profile'
  ) then
    create policy "Customers can view own profile" on public.customers
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'customers' and policyname = 'Customers can upsert own profile'
  ) then
    create policy "Customers can upsert own profile" on public.customers
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'customers' and policyname = 'Customers can update own profile'
  ) then
    create policy "Customers can update own profile" on public.customers
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  -- PROPERTIES
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'properties' and policyname = 'Users can view own properties'
  ) then
    create policy "Users can view own properties" on public.properties
      for select
      using (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'properties' and policyname = 'Users can create own properties'
  ) then
    create policy "Users can create own properties" on public.properties
      for insert
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'properties' and policyname = 'Users can update own properties'
  ) then
    create policy "Users can update own properties" on public.properties
      for update
      using (auth.uid() = user_id)
      with check (auth.uid() = user_id);
  end if;

  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'properties' and policyname = 'Users can delete own properties'
  ) then
    create policy "Users can delete own properties" on public.properties
      for delete
      using (auth.uid() = user_id);
  end if;

  -- POSTAL LOOKUP (public read-only)
  if not exists (
    select 1 from pg_policies where schemaname = 'public' and tablename = 'postal_code_areas' and policyname = 'Anyone can read postal lookup'
  ) then
    create policy "Anyone can read postal lookup" on public.postal_code_areas
      for select
      using (true);
  end if;
end $$;
