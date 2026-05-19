-- Merchants (business owners)
create table if not exists merchants (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  business_name text not null,
  plan text not null default 'free' check (plan in ('free', 'starter', 'pro')),
  created_at timestamptz not null default now()
);

-- Venues (restaurants, cafes, hotels, etc.)
create table if not exists venues (
  id uuid primary key default gen_random_uuid(),
  merchant_id uuid references merchants(id) on delete cascade,
  name text not null,
  category text not null default 'other' check (category in ('restaurant', 'cafe', 'hotel', 'shop', 'service', 'other')),
  address text,
  city text,
  google_place_id text,
  google_review_url text,
  qr_slug text unique,
  created_at timestamptz not null default now()
);

-- QR Campaigns
create table if not exists qr_campaigns (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references venues(id) on delete cascade,
  slug text unique not null,
  label text not null default 'Table QR',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

-- Review Sessions (analytics)
create table if not exists review_sessions (
  id uuid primary key default gen_random_uuid(),
  venue_id uuid references venues(id) on delete set null,
  slug text,
  star_rating int not null check (star_rating between 1 and 5),
  tags text[] not null default '{}',
  persona text not null,
  draft_text text not null,
  copied_at timestamptz,
  redirected_at timestamptz,
  platform text,
  created_at timestamptz not null default now()
);

-- RLS
alter table merchants enable row level security;
alter table venues enable row level security;
alter table qr_campaigns enable row level security;
alter table review_sessions enable row level security;

-- Merchants can only access their own data
create policy "merchants_own" on merchants
  for all using (auth.uid() = id);

-- Venues owned by merchant
create policy "venues_own" on venues
  for all using (
    merchant_id = auth.uid()
    or merchant_id is null
  );

-- QR campaigns via venue ownership
create policy "qr_campaigns_own" on qr_campaigns
  for all using (
    exists (
      select 1 from venues v
      where v.id = qr_campaigns.venue_id
        and (v.merchant_id = auth.uid() or v.merchant_id is null)
    )
  );

-- Review sessions: anyone can insert, merchants can read their own
create policy "review_sessions_insert" on review_sessions
  for insert with check (true);

create policy "review_sessions_read_own" on review_sessions
  for select using (
    venue_id in (
      select id from venues where merchant_id = auth.uid()
    )
  );

-- Indexes
create index if not exists idx_venues_slug on venues(qr_slug);
create index if not exists idx_qr_campaigns_slug on qr_campaigns(slug);
create index if not exists idx_review_sessions_venue on review_sessions(venue_id);
create index if not exists idx_review_sessions_created on review_sessions(created_at desc);
