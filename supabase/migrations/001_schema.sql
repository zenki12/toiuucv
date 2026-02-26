-- ============================================
-- FitYourCV Database Schema v2
-- Run in Supabase SQL Editor (fresh project)
-- ============================================

create extension if not exists "uuid-ossp";

-- ── PROFILES ─────────────────────────────────────────────────────────
create table public.profiles (
  id              uuid references auth.users(id) on delete cascade primary key,
  email           text not null,
  full_name       text,
  avatar_url      text,
  plan            text not null default 'free',   -- 'free' | 'pro'
  pro_expires_at  timestamptz,
  daily_count     int  not null default 0,
  daily_reset_at  date not null default current_date,
  total_analyses  int  not null default 0,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.profiles enable row level security;
create policy "Users can view own profile"   on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on Google signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ── ANALYSES ─────────────────────────────────────────────────────────
create table public.analyses (
  id          uuid primary key default uuid_generate_v4(),
  user_id     uuid references public.profiles(id) on delete cascade not null,

  -- Input
  cv_filename text not null,
  cv_text     text not null,
  jd_text     text not null,
  job_title   text,
  company_name text,

  -- Top-level scores
  overall_score int  not null,
  verdict       text,
  summary       text,

  -- JSON blobs (structure defined in types/index.ts)
  app_recommendation  jsonb not null default '{}',
  layout_analysis     jsonb not null default '{}',
  metrics             jsonb not null default '{}',
  recommendation      jsonb not null default '{}',

  -- Arrays
  strengths       jsonb not null default '[]',
  weaknesses      jsonb not null default '[]',
  matched_skills  jsonb not null default '[]',
  missing_skills  jsonb not null default '[]',
  improvements    jsonb not null default '[]',

  created_at timestamptz not null default now()
);

alter table public.analyses enable row level security;
create policy "Users can view own analyses"   on public.analyses for select using (auth.uid() = user_id);
create policy "Users can insert own analyses" on public.analyses for insert with check (auth.uid() = user_id);
create policy "Users can delete own analyses" on public.analyses for delete using (auth.uid() = user_id);

create index analyses_user_id_idx    on public.analyses(user_id);
create index analyses_created_at_idx on public.analyses(created_at desc);

-- ── PAYMENTS ─────────────────────────────────────────────────────────
create table public.payments (
  id                    uuid primary key default uuid_generate_v4(),
  user_id               uuid references public.profiles(id) on delete set null,
  order_code            bigint unique not null,
  payos_payment_link_id text,
  amount                int  not null,
  currency              text default 'VND',
  description           text,
  status                text not null default 'pending', -- pending|paid|cancelled|expired
  plan                  text not null default 'pro',
  plan_duration_days    int  not null default 30,
  paid_at               timestamptz,
  expires_at            timestamptz,
  created_at            timestamptz not null default now(),
  webhook_data          jsonb
);

alter table public.payments enable row level security;
create policy "Users can view own payments" on public.payments for select using (auth.uid() = user_id);

-- ── HELPERS ──────────────────────────────────────────────────────────

-- Called before every analysis to reset daily_count at midnight
create or replace function public.reset_daily_count_if_needed(p_user_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.profiles
  set daily_count = 0, daily_reset_at = current_date
  where id = p_user_id and daily_reset_at < current_date;
end;
$$;

-- Admin stats (service role only — safe because app never calls this from client)
create or replace function public.get_admin_stats()
returns json language plpgsql security definer as $$
declare result json;
begin
  select json_build_object(
    'total_users',        (select count(*) from public.profiles),
    'pro_users',          (select count(*) from public.profiles where plan = 'pro'),
    'total_analyses',     (select count(*) from public.analyses),
    'analyses_today',     (select count(*) from public.analyses where created_at >= current_date),
    'revenue_total',      (select coalesce(sum(amount), 0) from public.payments where status = 'paid'),
    'revenue_this_month', (select coalesce(sum(amount), 0) from public.payments
                           where status = 'paid' and created_at >= date_trunc('month', now()))
  ) into result;
  return result;
end;
$$;
