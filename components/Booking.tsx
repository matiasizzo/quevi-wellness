'use client'

import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Phone,
  Mail,
  MapPin,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Lock,
} from 'lucide-react'
import { SITE, RITUALES } from '@/content'
import { fadeUp, staggerContainer, slideInLeft, slideInRight } from '@/lib/animations'
import { useScrollAnimation } from '@/lib/useScrollAnimation'

// ─── Services list ─────────────────────────────────────────────────────────
const SERVICES_OPTIONS = [
  'Diagnóstico BIO-SCAN SKIN 360°',
  'Neuromoduladores',
  'Rellenos — DallÒ LIPS / Arquitectura Face',
  'PRP Photoativa / PDRN',
  'Tecnología High-Tech (LED, Láser, IPL)',
  'Primera consulta (orientación)',
  // Rituales de Firma — reservables con seña de 50 € (el resto se abona en clínica)
  ...RITUALES.map((r) => `Ritual ${r.name}`),
]

// ─── Time slots ────────────────────────────────────────────────────────────
const MORNING_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30']
const AFTERNOON_SLOTS = ['16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

// ─── Calendar helpers ──────────────────────────────────────────────────────
const MONTH_NAMES_ES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]
const DAY_LABELS = ['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá', 'Do']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

/** Returns 0=Mon … 6=Sun for the first day of the month */
function firstDayOfWeek(year: number, month: number) {
  const d = new Date(year, month, 1).getDay() // 0=Sun
  return d === 0 ? 6 : d - 1
}

function formatDateISO(year: number, month: number, day: number) {
  const mm = String(month + 1).padStart(2, '0')
  const dd = String(day).padStart(2, '0')
  return `${year}-${mm}-${dd}`
}

function formatDateDisplay(iso: string) {
  const [y, m, d] = iso.split('-')
  return `${d}/${m}/${y}`
}

// ─── Sub-components ────────────────────────────────────────────────────────
function ContactItem({
  icon,
  label,
  value,
  href,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href?: string
}) {
  const inner = (
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-cream-50/10 flex items-center justify-center flex-shrink-0">
        {icon}
      </div>
      <div>
        <p className="text-brand-200 text-xs">{label}</p>
        <p className="text-cream-50 text-sm font-medium mt-0.5">{value}</p>
      </div>
    </div>
  )
  return href ? <a href={href}>{inner}</a> : <div>{inner}</div>
}

function StepDots({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {[1, 2, 3].map((s) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all duration-300 ${
            s === step
              ? 'w-6 bg-brand-600'
              : s < step
              ? 'w-3 bg-brand-400'
              : 'w-3 bg-cream-400'
          }`}
        />
      ))}
      <span className="ml-2 text-xs text-carbon-400">Paso {step} de 3</span>
    </div>
  )
}

// ─── Step 1: Select service ─────────────────────────────────────────────────
function Step1Service({
  selected,
  onSelect,
  onNext,
}: {
  selected: string
  onSelect: (s: string) => void
  onNext: () => void
}) {
  return (
    <div>
      <StepDots step={1} />
      <h3 className="font-serif text-2xl font-normal text-carbon-900 mb-1">
        Selecciona el servicio
      </h3>
      <p className="text-sm text-carbon-400 mb-6">¿Qué tratamiento te interesa?</p>

      {/* Price chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-100 border border-brand-200 mb-5">
        <span className="text-xs font-semibold text-brand-700">50€</span>
        <span className="text-xs text-brand-600">· Consulta médica</span>
      </div>

      <div className="flex flex-col gap-2.5 mb-7">
        {SERVICES_OPTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => onSelect(s)}
            className={`w-full text-left px-4 py-3.5 rounded-xl border text-sm font-medium transition-all duration-200 ${
              selected === s
                ? 'border-brand-600 bg-brand-600 text-cream-50 shadow-brand'
                : 'border-cream-400 bg-cream-100 text-carbon-800 hover:border-brand-300 hover:bg-cream-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <button
        type="button"
        disabled={!selected}
        onClick={onNext}
        className="group flex items-center justify-center gap-2 w-full py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-cream-50 font-medium rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-brand hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
      >
        Siguiente
        <ArrowRight size={16} className="transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  )
}

// ─── Step 2: Calendar + time slot ──────────────────────────────────────────
function Step2DateTime({
  selectedDate,
  selectedTime,
  onDateSelect,
  onTimeSelect,
  onBack,
  onNext,
}: {
  selectedDate: string
  selectedTime: string
  onDateSelect: (d: string) => void
  onTimeSelect: (t: string) => void
  onBack: () => void
  onNext: () => void
}) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())

  const daysInMonth = useMemo(() => getDaysInMonth(viewYear, viewMonth), [viewYear, viewMonth])
  const firstDow = useMemo(() => firstDayOfWeek(viewYear, viewMonth), [viewYear, viewMonth])

  // Build calendar cells: nulls for leading blanks, then day numbers
  const cells = useMemo(() => {
    const arr: (number | null)[] = Array(firstDow).fill(null)
    for (let d = 1; d <= daysInMonth; d++) arr.push(d)
    return arr
  }, [daysInMonth, firstDow])

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11)
      setViewYear((y) => y - 1)
    } else {
      setViewMonth((m) => m - 1)
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0)
      setViewYear((y) => y + 1)
    } else {
      setViewMonth((m) => m + 1)
    }
  }

  function isDayDisabled(day: number) {
    const date = new Date(viewYear, viewMonth, day)
    if (date < today) return true // past
    if (date.getDay() === 0) return true // Sunday
    return false
  }

  function handleDayClick(day: number) {
    if (isDayDisabled(day)) return
    onDateSelect(formatDateISO(viewYear, viewMonth, day))
    onTimeSelect('') // reset time when date changes
  }

  function isTodayCell(day: number) {
    return (
      viewYear === today.getFullYear() &&
      viewMonth === today.getMonth() &&
      day === today.getDate()
    )
  }

  function isSelectedCell(day: number) {
    return selectedDate === formatDateISO(viewYear, viewMonth, day)
  }

  const canNext = selectedDate !== '' && selectedTime !== ''

  return (
    <div>
      <StepDots step={2} />
      <h3 className="font-serif text-2xl font-normal text-carbon-900 mb-1">
        Elige fecha y hora
      </h3>
      <p className="text-sm text-carbon-400 mb-6">Los domingos no hay consulta.</p>

      {/* Calendar */}
      <div className="bg-cream-100 border border-cream-400 rounded-2xl p-4 mb-4">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            type="button"
            onClick={prevMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-cream-300 transition-colors"
          >
            <ChevronLeft size={16} className="text-carbon-600" />
          </button>
          <span className="text-sm font-semibold text-carbon-800">
            {MONTH_NAMES_ES[viewMonth]} {viewYear}
          </span>
          <button
            type="button"
            onClick={nextMonth}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-cream-300 transition-colors"
          >
            <ChevronRight size={16} className="text-carbon-600" />
          </button>
        </div>

        {/* Day headers */}
        <div className="grid grid-cols-7 mb-1">
          {DAY_LABELS.map((d) => (
            <div key={d} className="text-center text-[11px] font-medium text-carbon-400 py-1">
              {d}
            </div>
          ))}
        </div>

        {/* Day cells */}
        <div className="grid grid-cols-7 gap-y-0.5">
          {cells.map((day, idx) => {
            if (day === null) return <div key={`blank-${idx}`} />
            const disabled = isDayDisabled(day)
            const isSelected = isSelectedCell(day)
            const isToday = isTodayCell(day)
            return (
              <button
                key={day}
                type="button"
                disabled={disabled}
                onClick={() => handleDayClick(day)}
                className={[
                  'mx-auto flex h-8 w-8 items-center justify-center rounded-full text-[13px] transition-all duration-150',
                  isSelected
                    ? 'bg-brand-600 text-cream-50 font-semibold shadow-brand'
                    : disabled
                    ? 'text-carbon-200 cursor-not-allowed'
                    : isToday
                    ? 'border border-brand-400 text-carbon-800 hover:bg-brand-100'
                    : 'text-carbon-700 hover:bg-cream-300',
                ].join(' ')}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-5"
        >
          <p className="text-xs font-semibold text-carbon-500 uppercase tracking-wider mb-2">
            Mañana
          </p>
          <div className="flex flex-wrap gap-2 mb-4">
            {MORNING_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTimeSelect(t)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                  selectedTime === t
                    ? 'bg-brand-600 border-brand-600 text-cream-50 shadow-brand'
                    : 'bg-cream-100 border-cream-400 text-carbon-700 hover:border-brand-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <p className="text-xs font-semibold text-carbon-500 uppercase tracking-wider mb-2">
            Tarde
          </p>
          <div className="flex flex-wrap gap-2">
            {AFTERNOON_SLOTS.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onTimeSelect(t)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-all duration-150 ${
                  selectedTime === t
                    ? 'bg-brand-600 border-brand-600 text-cream-50 shadow-brand'
                    : 'bg-cream-100 border-cream-400 text-carbon-700 hover:border-brand-400'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Nav buttons */}
      <div className="flex gap-3 mt-2">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-1.5 px-5 py-3 rounded-full border border-cream-400 bg-cream-100 text-sm text-carbon-700 font-medium hover:border-brand-300 transition-all duration-200"
        >
          <ChevronLeft size={15} />
          Atrás
        </button>
        <button
          type="button"
          disabled={!canNext}
          onClick={onNext}
          className="group flex-1 flex items-center justify-center gap-2 py-3 bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:cursor-not-allowed text-cream-50 text-sm font-medium rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-brand hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
        >
          Siguiente
          <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
        </button>
      </div>
    </div>
  )
}

// ─── Step 3: Patient data + payment ────────────────────────────────────────
function Step3Payment({
  service,
  date,
  time,
  onBack,
}: {
  service: string
  date: string
  time: string
  onBack: () => void
}) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone,
          service,
          date,
          time,
          notes: form.notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Error al crear la sesión de pago')
      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('No se recibió la URL de pago')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <StepDots step={3} />
      <h3 className="font-serif text-2xl font-normal text-carbon-900 mb-1">
        Tus datos
      </h3>
      <p className="text-sm text-carbon-400 mb-6">
        Últimos detalles antes del pago seguro.
      </p>

      {/* Price summary */}
      <div className="flex items-center justify-between px-4 py-3.5 rounded-xl bg-brand-600 text-cream-50 mb-5">
        <div>
          <p className="text-sm font-semibold">Consulta médica QUEVI</p>
          <p className="text-xs text-brand-200 mt-0.5">
            {service} · {formatDateDisplay(date)} a las {time}
          </p>
        </div>
        <span className="text-lg font-bold">50,00€</span>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4 mb-5">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-carbon-700">
            Nombre completo <span className="text-terra-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Tu nombre completo"
            required
            className="px-4 py-3 rounded-xl border border-cream-400 bg-cream-100 text-sm text-carbon-800 placeholder:text-carbon-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-carbon-700">
            Email <span className="text-terra-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="tu@email.com"
            required
            className="px-4 py-3 rounded-xl border border-cream-400 bg-cream-100 text-sm text-carbon-800 placeholder:text-carbon-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-carbon-700">
            Teléfono <span className="text-carbon-300 text-xs">(opcional)</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+34 600 000 000"
            className="px-4 py-3 rounded-xl border border-cream-400 bg-cream-100 text-sm text-carbon-800 placeholder:text-carbon-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-carbon-700">
            Notas / motivo de consulta{' '}
            <span className="text-carbon-300 text-xs">(opcional)</span>
          </label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Cuéntanos brevemente tu consulta..."
            className="px-4 py-3 rounded-xl border border-cream-400 bg-cream-100 text-sm text-carbon-800 placeholder:text-carbon-300 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition-all resize-none"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-4">
          {error}
        </p>
      )}

      {/* Nav */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-1.5 px-5 py-3 rounded-full border border-cream-400 bg-cream-100 text-sm text-carbon-700 font-medium hover:border-brand-300 transition-all duration-200 disabled:opacity-50"
        >
          <ChevronLeft size={15} />
          Atrás
        </button>
        <button
          type="submit"
          disabled={loading}
          className="group flex-1 flex items-center justify-center gap-2 py-3.5 bg-brand-600 hover:bg-brand-700 disabled:opacity-60 disabled:cursor-not-allowed text-cream-50 font-medium rounded-full transition-all duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] shadow-brand hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
        >
          {loading ? (
            <>
              <span className="animate-spin w-4 h-4 border-2 border-cream-50/40 border-t-cream-50 rounded-full" />
              Redirigiendo…
            </>
          ) : (
            <>
              <Lock size={14} />
              Reservar y pagar 50€
              <ArrowRight size={15} className="transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>

      <p className="mt-4 text-center text-xs text-carbon-400 leading-relaxed">
        <Lock size={10} className="inline mr-1 opacity-60" />
        Pago seguro con Stripe · Podrás cancelar hasta 24h antes
      </p>
    </form>
  )
}

// ─── Main Booking component ─────────────────────────────────────────────────
export default function Booking() {
  const { ref, isInView } = useScrollAnimation()

  const [step, setStep] = useState(1)
  const [service, setService] = useState('')
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')

  // Preselección por URL (?service=Ritual%20X) — usada por los botones
  // "Reservar con seña" de la sección de Rituales
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get('service')
    if (param && SERVICES_OPTIONS.includes(param)) {
      setService(param)
      setStep(2)
    }
  }, [])

  return (
    <>
      {/* ── BIO-SCAN CTA band ──────────────────────────────────────────── */}
      <section
        id="diagnostico"
        className="relative overflow-hidden text-center py-28"
        style={{ background: '#355539', color: '#f9f7f3' }}
      >
        {/* Glow blobs */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-120px',
            left: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(213,226,214,0.10)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-120px',
            right: '-120px',
            width: '500px',
            height: '500px',
            borderRadius: '50%',
            background: 'rgba(196,135,106,0.18)',
            filter: 'blur(80px)',
          }}
        />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-[2]">
          <div className="max-w-[720px] mx-auto">
            <span
              className="inline-block px-4 py-1.5 rounded-full text-[11px] tracking-[0.2em] uppercase text-cream-100 mb-[22px]"
              style={{
                background: 'rgba(245,242,236,0.12)',
                border: '1px solid rgba(245,242,236,0.22)',
              }}
            >
              BIO-SCAN 360°
            </span>
            <h3
              className="font-serif font-normal leading-[1.05] tracking-tight m-0 mb-5 text-cream-100 text-balance"
              style={{ fontSize: 'clamp(34px, 4.2vw, 56px)' }}
            >
              ¿No sabes por dónde <em className="italic text-brand-300">empezar</em>?
            </h3>
            <p className="text-[16px] text-brand-200 m-0 mx-auto mb-8 max-w-[540px] leading-relaxed">
              Reserva un diagnóstico médico gratuito en clínica QUEVI. Cruzamos tu ADN, tu
              mapa mineral y tu lectura facial 3D — y diseñamos un protocolo personalizado
              hecho a la medida de tu historia.
            </p>
            <div className="inline-flex gap-3 flex-wrap justify-center">
              <a
                href="#contact"
                className="group inline-flex items-center gap-2.5 px-7 py-3 text-[13px] tracking-[0.02em] font-medium rounded-full bg-cream-100 text-brand-700 border border-cream-100 transition-all duration-200 hover:bg-transparent hover:text-cream-100 hover:-translate-y-0.5 active:scale-[0.97] will-change-transform"
                style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
              >
                Reservar diagnóstico — gratis
                <svg
                  className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M5 12h14" />
                  <path d="m12 5 7 7-7 7" />
                </svg>
              </a>
              <a
                href="#contact"
                className="inline-flex items-center gap-2.5 px-7 py-3 text-[13px] tracking-[0.02em] font-medium rounded-full text-cream-100 transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/10 active:scale-[0.97] will-change-transform"
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(245,242,236,0.32)',
                  transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)',
                }}
              >
                Ver tienda completa
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Paid booking section ───────────────────────────────────────── */}
      <section id="booking" className="py-28 bg-cream-200 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <motion.div
            ref={ref}
            variants={staggerContainer}
            initial="hidden"
            animate={isInView ? 'visible' : 'hidden'}
            className="text-center mb-16"
          >
            <motion.span
              variants={fadeUp}
              className="inline-block px-4 py-1.5 rounded-full bg-brand-100 text-brand-700 text-sm font-medium mb-4"
            >
              Cita médica pagada · 50€
            </motion.span>
            <motion.h2
              variants={fadeUp}
              className="font-serif font-normal text-4xl sm:text-5xl leading-[1.05] tracking-tight text-carbon-900 mb-4"
            >
              Reserva tu cita{' '}
              <em className="italic font-normal text-brand-600">médica</em>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-carbon-500 text-lg max-w-lg mx-auto">
              Elige servicio, fecha y hora. Pago seguro con Stripe. Tu cita queda
              confirmada al instante.
            </motion.p>
          </motion.div>

          <div className="grid lg:grid-cols-[1fr_1.5fr] gap-12 items-start">
            {/* Left — contact info + benefits */}
            <motion.div
              variants={slideInLeft}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
              className="flex flex-col gap-5"
            >
              <div className="rounded-3xl bg-gradient-to-br from-brand-600 to-brand-800 p-8 text-cream-50">
                <h3 className="text-xl font-bold mb-2">Información de contacto</h3>
                <p className="text-brand-200 text-sm mb-8">
                  Estamos aquí para ayudarte en cada paso.
                </p>
                <div className="flex flex-col gap-5">
                  <ContactItem
                    icon={<Phone size={18} />}
                    label="Teléfono"
                    value={SITE.phone}
                    href={`tel:${SITE.phone}`}
                  />
                  <ContactItem
                    icon={<Mail size={18} />}
                    label="Email"
                    value={SITE.email}
                    href={`mailto:${SITE.email}`}
                  />
                  <ContactItem icon={<MapPin size={18} />} label="Dirección" value={SITE.address} />
                </div>
                <div className="mt-10 flex gap-3">
                  <div className="w-3 h-3 rounded-full bg-cream-50/30" />
                  <div className="w-3 h-3 rounded-full bg-cream-50/20" />
                  <div className="w-3 h-3 rounded-full bg-cream-50/10" />
                </div>
              </div>

              {[
                'Confirmación inmediata por email',
                'Pago seguro con Stripe',
                'Cancelación hasta 24h antes',
              ].map((p) => (
                <div
                  key={p}
                  className="flex items-center gap-3 px-5 py-3.5 rounded-xl bg-cream-100 border border-cream-400 transition-all duration-200 hover:border-brand-300 hover:shadow-sm"
                  style={{ transitionTimingFunction: 'cubic-bezier(0.22,1,0.36,1)' }}
                >
                  <CheckCircle2 size={16} className="text-brand-500 flex-shrink-0" />
                  <span className="text-sm text-carbon-700 font-medium">{p}</span>
                </div>
              ))}
            </motion.div>

            {/* Right — 3-step wizard */}
            <motion.div
              variants={slideInRight}
              initial="hidden"
              animate={isInView ? 'visible' : 'hidden'}
            >
              <div
                id="contact"
                className="p-8 rounded-3xl border border-cream-400 bg-cream-200"
              >
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Step1Service
                        selected={service}
                        onSelect={setService}
                        onNext={() => setStep(2)}
                      />
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div
                      key="step2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Step2DateTime
                        selectedDate={date}
                        selectedTime={time}
                        onDateSelect={setDate}
                        onTimeSelect={setTime}
                        onBack={() => setStep(1)}
                        onNext={() => setStep(3)}
                      />
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div
                      key="step3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Step3Payment
                        service={service}
                        date={date}
                        time={time}
                        onBack={() => setStep(2)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </>
  )
}
