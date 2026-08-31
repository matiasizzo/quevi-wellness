-- ─────────────────────────────────────────────────────────────────────────────
-- ATRIBUCIÓN DE CAMPAÑA — de qué anuncio viene cada cita
--
-- Guardar el identificador de clic de Google Ads junto a la reserva es lo que
-- permite subir después la CONVERSIÓN OFFLINE: cuando la paciente viene de
-- verdad a la clínica, se marca la cita como asistida y se exporta el gclid con
-- la fecha y el valor. Google aprende entonces qué palabras traen pacientes
-- reales, no solo formularios rellenados.
--
-- La ventana de importación de Google es de 90 días desde el clic.
--
-- Ejecutar en el SQL Editor de Supabase. Es idempotente.
-- ─────────────────────────────────────────────────────────────────────────────

-- ─── Solicitudes de cita (formulario de la landing) ──────────────────────────
alter table bookings add column if not exists gclid         text;
alter table bookings add column if not exists wbraid        text;
alter table bookings add column if not exists gbraid        text;
alter table bookings add column if not exists utm_source    text;
alter table bookings add column if not exists utm_medium    text;
alter table bookings add column if not exists utm_campaign  text;
alter table bookings add column if not exists landing_page  text;
alter table bookings add column if not exists locale        text;
-- Origen del formulario: 'landing-es', 'landing-en', 'home'…
alter table bookings add column if not exists source        text;

-- ─── Citas con seña pagada (flujo de Stripe) ─────────────────────────────────
alter table appointments add column if not exists gclid        text;
alter table appointments add column if not exists wbraid       text;
alter table appointments add column if not exists gbraid       text;
alter table appointments add column if not exists utm_source   text;
alter table appointments add column if not exists utm_medium   text;
alter table appointments add column if not exists utm_campaign text;

-- Índices para el export mensual de conversiones offline
create index if not exists bookings_gclid_idx
  on bookings (gclid) where gclid is not null;
create index if not exists appointments_gclid_idx
  on appointments (gclid) where gclid is not null;

-- ─────────────────────────────────────────────────────────────────────────────
-- EXPORT PARA GOOGLE ADS
--
-- Google Ads → Objetivos → Conversiones → Cargas → subir CSV.
-- El fichero necesita exactamente estas columnas y la hora en formato
-- "yyyy-mm-dd hh:mm:ss+00:00". Marca la cita como 'completed' en /admin cuando
-- la paciente asista, y esta vista devuelve lo que hay que subir.
-- ─────────────────────────────────────────────────────────────────────────────
create or replace view ads_offline_conversions as
select
  b.gclid                                            as "Google Click ID",
  'Cita asistida'                                    as "Conversion Name",
  to_char(b.created_at at time zone 'UTC',
          'YYYY-MM-DD HH24:MI:SS+00:00')             as "Conversion Time",
  120                                                as "Conversion Value",
  'EUR'                                              as "Conversion Currency"
from bookings b
where b.gclid is not null
  and b.status = 'completed'
  -- Google descarta cualquier conversión de más de 90 días
  and b.created_at > now() - interval '90 days';
