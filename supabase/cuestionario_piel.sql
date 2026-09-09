-- ─────────────────────────────────────────────────────────────────────────────
-- QUEVI — CUESTIONARIO PREVIO AL CHEQUEO DE PIEL
-- La paciente lo rellena y lo firma desde /chequeo-piel (móvil, ordenador o la
-- tablet de la clínica) y queda guardado aquí para verlo en el panel.
--
-- OJO: esto son datos de salud (categoría especial del RGPD). La tabla queda
-- con RLS activo y SIN políticas públicas: solo el backend con la service_role
-- puede leerla o escribirla. Nadie con la anon key ve nada.
--
-- Ejecutar en: Supabase Dashboard → SQL Editor → Run
-- ─────────────────────────────────────────────────────────────────────────────

create table if not exists skin_questionnaires (
  id             uuid primary key default uuid_generate_v4(),
  created_at     timestamptz not null default now(),

  -- Quién lo rellena
  patient_name   text not null,
  patient_email  text not null,
  patient_phone  text,
  patient_age    text,
  history_number text,

  -- Todas las respuestas, con la forma que define lib/skinQuestionnaire.ts
  answers        jsonb not null default '{}'::jsonb,

  -- Firma manuscrita (PNG en base64) y momento de la firma
  signature      text,
  signed_at      timestamptz,

  -- Consentimiento explícito para tratar datos de salud
  consent        boolean not null default false,

  -- Prueba de integridad: sha-256 de las respuestas + la firma. Si alguien
  -- tocara la fila después, el hash deja de cuadrar.
  content_hash   text,

  -- Contexto del envío, como prueba de la firma electrónica simple
  ip             text,
  user_agent     text,

  -- Notas internas del equipo médico (no las ve la paciente)
  staff_notes    text,
  reviewed_at    timestamptz
);

create index if not exists skin_questionnaires_created_idx on skin_questionnaires (created_at desc);
create index if not exists skin_questionnaires_email_idx   on skin_questionnaires (lower(patient_email));

-- ─── PERMISOS ─────────────────────────────────────────────────────────────────
alter table skin_questionnaires enable row level security;

-- Sin políticas: ni lectura ni escritura con la anon key. El formulario público
-- guarda a través de /api/skin-questionnaire, que usa la service_role en el
-- servidor, y el panel lee por /api/admin/data, protegido con contraseña.

-- ─── COMPROBACIÓN ─────────────────────────────────────────────────────────────
-- select id, created_at, patient_name, patient_email from skin_questionnaires
--  order by created_at desc limit 20;
