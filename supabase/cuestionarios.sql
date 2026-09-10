-- ─────────────────────────────────────────────────────────────────────────────
-- QUEVI — CUESTIONARIOS DE SALUD (piel y tricología)
--
-- Sustituye a supabase/cuestionario_piel.sql. Se puede ejecutar tanto si ya
-- habías corrido aquel script como si no:
--   · Si existe la tabla skin_questionnaires, se renombra a health_questionnaires
--     conservando todo lo que hubiera dentro.
--   · Si no existe ninguna, se crea de cero.
--   · Las columnas nuevas se añaden solo si faltan.
-- Ejecutarlo dos veces no rompe nada.
--
-- OJO: esto son datos de salud (categoría especial del RGPD). La tabla queda
-- con RLS activo y SIN políticas públicas: solo el backend con la service_role
-- puede leerla o escribirla.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── 1 · Renombrar la tabla anterior, si existía ──────────────────────────────
do $$
begin
  if exists (select 1 from information_schema.tables
              where table_schema = 'public' and table_name = 'skin_questionnaires')
     and not exists (select 1 from information_schema.tables
                      where table_schema = 'public' and table_name = 'health_questionnaires')
  then
    alter table public.skin_questionnaires rename to health_questionnaires;
  end if;
end $$;

-- ─── 2 · Crear la tabla si no existe ──────────────────────────────────────────
create table if not exists health_questionnaires (
  id             uuid primary key default uuid_generate_v4(),
  created_at     timestamptz not null default now(),

  -- Qué cuestionario rellenó: 'piel' | 'capilar'
  form           text not null default 'piel',

  -- Quién lo rellena
  patient_name   text not null,
  patient_email  text not null,
  patient_phone  text,
  patient_age    text,
  history_number text,

  -- Todas las respuestas, con la forma que define lib/questionnaires.ts
  answers        jsonb not null default '{}'::jsonb,

  -- Firma manuscrita (PNG en base64) y momento de la firma
  signature      text,
  signed_at      timestamptz,

  -- Consentimiento obligatorio para tratar datos de salud
  consent        boolean not null default false,

  -- Prueba de integridad: sha-256 del cuestionario + las respuestas + la firma
  content_hash   text,

  -- Contexto del envío, como prueba de la firma electrónica simple
  ip             text,
  user_agent     text,

  -- Notas internas del equipo médico (no las ve la paciente)
  staff_notes    text,
  reviewed_at    timestamptz
);

-- ─── 3 · Columnas nuevas ──────────────────────────────────────────────────────
-- Se añaden una a una con "if not exists" para que el script valga igual sobre
-- una tabla recién creada que sobre la que ya tenías con cuestionarios dentro.
alter table health_questionnaires add column if not exists form              text not null default 'piel';
alter table health_questionnaires add column if not exists patient_dni       text;
alter table health_questionnaires add column if not exists patient_birth_date text;
-- Autorizaciones opcionales del consentimiento informado
alter table health_questionnaires add column if not exists consent_photos    boolean not null default false;
alter table health_questionnaires add column if not exists consent_comms     boolean not null default false;
alter table health_questionnaires add column if not exists consent_promo     boolean not null default false;

-- ─── 4 · Índices ──────────────────────────────────────────────────────────────
create index if not exists health_questionnaires_created_idx on health_questionnaires (created_at desc);
create index if not exists health_questionnaires_email_idx   on health_questionnaires (lower(patient_email));
create index if not exists health_questionnaires_form_idx    on health_questionnaires (form, created_at desc);

-- ─── 5 · Permisos ─────────────────────────────────────────────────────────────
alter table health_questionnaires enable row level security;

-- Sin políticas: ni lectura ni escritura con la anon key. Los formularios
-- públicos guardan a través de /api/questionnaire, que usa la service_role en
-- el servidor, y el panel lee por /api/admin/questionnaires, con contraseña.

-- ─── COMPROBACIÓN ─────────────────────────────────────────────────────────────
-- select id, created_at, form, patient_name, patient_email
--   from health_questionnaires order by created_at desc limit 20;
