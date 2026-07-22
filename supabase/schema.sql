create extension if not exists pgcrypto;

create table if not exists public.scans (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  final_url text,
  score numeric(4, 2),
  platform text,
  payment_level text,
  payment_label text,
  result jsonb not null,
  source text,
  locale text default 'en',
  market text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  created_at timestamptz not null default now()
);

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  domain text,
  scan_id uuid references public.scans(id) on delete set null,
  score numeric(4, 2),
  locale text default 'en',
  market text,
  source text default 'scanner_report',
  waitlist_status text not null default 'joined',
  consent_at timestamptz not null default now(),
  report_sent_at timestamptz,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.report_requests (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete cascade,
  scan_id uuid references public.scans(id) on delete set null,
  email text not null,
  domain text,
  status text not null default 'queued',
  error text,
  pdf_url text,
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  domain text,
  locale text default 'en',
  market text,
  session_id text,
  path text,
  referrer text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_content text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create unique index if not exists leads_email_domain_unique
  on public.leads (lower(email), lower(coalesce(domain, '')));

create index if not exists scans_domain_created_at_idx
  on public.scans (lower(domain), created_at desc);

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

create index if not exists report_requests_status_created_at_idx
  on public.report_requests (status, created_at desc);

create index if not exists events_name_created_at_idx
  on public.events (name, created_at desc);

create index if not exists events_utm_campaign_created_at_idx
  on public.events (utm_campaign, created_at desc);

create index if not exists events_domain_created_at_idx
  on public.events (lower(domain), created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists leads_set_updated_at on public.leads;

create trigger leads_set_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.scans enable row level security;
alter table public.leads enable row level security;
alter table public.report_requests enable row level security;
alter table public.events enable row level security;

drop policy if exists "service role can manage scans" on public.scans;
drop policy if exists "service role can manage leads" on public.leads;
drop policy if exists "service role can manage report requests" on public.report_requests;
drop policy if exists "service role can manage events" on public.events;

create policy "service role can manage scans"
on public.scans
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service role can manage leads"
on public.leads
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service role can manage report requests"
on public.report_requests
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');

create policy "service role can manage events"
on public.events
for all
using (auth.role() = 'service_role')
with check (auth.role() = 'service_role');
