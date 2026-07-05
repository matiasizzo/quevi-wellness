-- Suscriptores de la newsletter (formulario del footer)
-- Ejecutar en: Supabase Dashboard → SQL Editor → New query → Run

create table if not exists newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text not null unique,
  source     text not null default 'footer',
  created_at timestamptz default now()
);

alter table newsletter_subscribers enable row level security;

create policy "Service: full access newsletter"
  on newsletter_subscribers for all
  using (auth.role() = 'service_role');
