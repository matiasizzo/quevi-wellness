-- Tarjetas regalo / vales (Nivel 2)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run

create table if not exists gift_cards (
  id                       uuid primary key default uuid_generate_v4(),
  code                     text not null unique,
  item_name                text not null,
  item_slug                text,
  amount_cents             integer not null default 0,
  total_sessions           integer not null default 1,
  sessions_used            integer not null default 0,
  status                   text not null default 'active',  -- active | redeemed | cancelled
  purchaser_name           text,
  purchaser_email          text,
  recipient_name           text,
  recipient_email          text,
  message                  text,
  stripe_payment_intent_id text,
  created_at               timestamptz default now(),
  expires_at               timestamptz,
  redeemed_at              timestamptz
);

create index if not exists gift_cards_code_idx on gift_cards (code);

alter table gift_cards enable row level security;

create policy "Service: full access gift_cards"
  on gift_cards for all
  using (auth.role() = 'service_role');
