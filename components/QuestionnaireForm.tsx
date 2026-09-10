'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  FORMS,
  CONSENTIMIENTO,
  CONSENTIMIENTOS_OPCIONALES,
  RESPONSABLE,
  FINALIDAD,
  type Field,
  type FormKey,
} from '@/lib/questionnaires'

// Formulario público de los cuestionarios de salud (piel y tricología).
// Se usa igual desde el móvil de la paciente en su casa que desde la tablet de
// la clínica: por pasos, con botones grandes y firma con el dedo.

type Value = string | string[] | Record<string, string>
type Answers = Record<string, Value>

const storageKey = (form: FormKey) => `quevi-cuestionario-${form}`

const inputCls =
  'w-full px-4 py-3 rounded-xl border border-cream-400 bg-cream-50 text-[15px] text-carbon-900 ' +
  'outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-colors'

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())
}

// ── Opción tipo botón: lo bastante grande para el dedo en una tablet ─────────
function Choice({
  label,
  selected,
  onClick,
  multiple = false,
}: {
  label: string
  selected: boolean
  onClick: () => void
  multiple?: boolean
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl border text-[15px] leading-snug transition-colors ${
        selected
          ? 'border-brand-500 bg-brand-50 text-brand-800'
          : 'border-cream-400 bg-cream-50 text-carbon-700 hover:border-brand-300'
      }`}
    >
      <span
        className={`flex-shrink-0 w-5 h-5 flex items-center justify-center border ${
          multiple ? 'rounded-md' : 'rounded-full'
        } ${selected ? 'border-brand-600 bg-brand-600 text-cream-50' : 'border-carbon-300 bg-white'}`}
      >
        {selected && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span>{label}</span>
    </button>
  )
}

// ── Un campo cualquiera del cuestionario ─────────────────────────────────────
function FieldInput({
  field,
  value,
  onChange,
  error,
}: {
  field: Field
  value: Value | undefined
  onChange: (v: Value) => void
  error?: string
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[15px] font-medium text-carbon-900 leading-snug">{field.label}</label>
      {field.help && <p className="text-[13px] text-carbon-400 leading-relaxed m-0">{field.help}</p>}

      {(field.type === 'text' || field.type === 'number') && (
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          inputMode={field.id === 'email' ? 'email' : undefined}
          autoComplete={field.id === 'email' ? 'email' : field.id === 'nombre' ? 'name' : field.id === 'telefono' ? 'tel' : 'off'}
          value={typeof value === 'string' ? value : ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder}
          className={inputCls}
        />
      )}

      {field.type === 'textarea' && (
        <textarea
          rows={3}
          value={typeof value === 'string' ? value : ''}
          onChange={e => onChange(e.target.value)}
          className={`${inputCls} resize-y`}
        />
      )}

      {field.type === 'radio' && (
        <div className="grid gap-2">
          {field.options.map(opt => (
            <Choice key={opt} label={opt} selected={value === opt} onClick={() => onChange(value === opt ? '' : opt)} />
          ))}
        </div>
      )}

      {field.type === 'checkboxes' && (
        <div className="grid gap-2 sm:grid-cols-2">
          {field.options.map(opt => {
            const list = Array.isArray(value) ? value : []
            const selected = list.includes(opt)
            return (
              <Choice
                key={opt}
                label={opt}
                multiple
                selected={selected}
                onClick={() => onChange(selected ? list.filter(v => v !== opt) : [...list, opt])}
              />
            )
          })}
        </div>
      )}

      {field.type === 'yesno' && (
        <div className="flex flex-wrap gap-2">
          {(field.options ?? ['Sí', 'No']).map(opt => (
            <button
              key={opt}
              type="button"
              onClick={() => onChange(value === opt ? '' : opt)}
              className={`px-6 py-3 rounded-xl border text-[15px] font-medium transition-colors ${
                value === opt
                  ? 'border-brand-500 bg-brand-600 text-cream-50'
                  : 'border-cream-400 bg-cream-50 text-carbon-700 hover:border-brand-300'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {field.type === 'scale' && (
        <div>
          <div className="flex flex-wrap gap-1.5">
            {Array.from({ length: field.max - field.min + 1 }, (_, i) => String(field.min + i)).map(n => (
              <button
                key={n}
                type="button"
                onClick={() => onChange(value === n ? '' : n)}
                className={`w-11 h-11 rounded-xl border text-[15px] font-medium tabular-nums transition-colors ${
                  value === n
                    ? 'border-brand-500 bg-brand-600 text-cream-50'
                    : 'border-cream-400 bg-cream-50 text-carbon-700 hover:border-brand-300'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
          {(field.minLabel || field.maxLabel) && (
            <div className="flex justify-between text-[12px] text-carbon-400 mt-1.5">
              <span>{field.minLabel}</span>
              <span>{field.maxLabel}</span>
            </div>
          )}
        </div>
      )}

      {field.type === 'matrix' && (
        <div className="space-y-3">
          {field.rows.map(row => {
            const current = (value && typeof value === 'object' && !Array.isArray(value) ? value : {}) as Record<string, string>
            return (
              <div key={row.id}>
                {field.groups?.[row.id] && (
                  <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 mt-4 mb-2 m-0">
                    {field.groups[row.id]}
                  </p>
                )}
                <p className="text-[14px] text-carbon-700 leading-snug mb-1.5 m-0">{row.label}</p>
                <div className="flex flex-wrap gap-2">
                  {field.options.map(opt => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() =>
                        onChange({ ...current, [row.id]: current[row.id] === opt ? '' : opt })
                      }
                      className={`px-4 py-2.5 rounded-xl border text-[14px] transition-colors ${
                        current[row.id] === opt
                          ? 'border-brand-500 bg-brand-600 text-cream-50'
                          : 'border-cream-400 bg-cream-50 text-carbon-700 hover:border-brand-300'
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {error && <p className="text-[13px] text-terra-700 m-0">{error}</p>}
    </div>
  )
}

// ── Firma con el dedo ────────────────────────────────────────────────────────
function SignaturePad({ onChange }: { onChange: (dataUrl: string) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const [hasInk, setHasInk] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ratio = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * ratio
    canvas.height = rect.height * ratio
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.scale(ratio, ratio)
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.strokeStyle = '#1e1e1e'
  }, [])

  function pos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = e.currentTarget.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function start(e: React.PointerEvent<HTMLCanvasElement>) {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    e.currentTarget.setPointerCapture(e.pointerId)
    drawing.current = true
    const { x, y } = pos(e)
    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  function move(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!drawing.current) return
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const { x, y } = pos(e)
    ctx.lineTo(x, y)
    ctx.stroke()
    setHasInk(true)
  }

  function end() {
    if (!drawing.current) return
    drawing.current = false
    const canvas = canvasRef.current
    if (canvas && hasInk) onChange(canvas.toDataURL('image/png'))
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    setHasInk(false)
    onChange('')
  }

  return (
    <div>
      <canvas
        ref={canvasRef}
        onPointerDown={start}
        onPointerMove={move}
        onPointerUp={end}
        onPointerLeave={end}
        className="w-full h-40 rounded-xl border border-cream-400 bg-cream-50 touch-none cursor-crosshair"
      />
      <div className="flex items-center justify-between mt-2">
        <p className="text-[13px] text-carbon-400 m-0">Firma con el dedo o con el ratón dentro del recuadro</p>
        <button type="button" onClick={clear} className="text-[13px] text-carbon-500 underline underline-offset-2">
          Borrar firma
        </button>
      </div>
    </div>
  )
}

// ── Formulario ───────────────────────────────────────────────────────────────
export default function QuestionnaireForm({ form }: { form: FormKey }) {
  const config = FORMS[form]
  const SECTIONS = config.sections
  const STORAGE_KEY = storageKey(form)

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [signature, setSignature] = useState('')
  const [consent, setConsent] = useState(false)
  const [declaracion, setDeclaracion] = useState(false)
  // Los opcionales: ninguno viene marcado por defecto
  const [optionalConsents, setOptionalConsents] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')
  const [restored, setRestored] = useState(false)

  const totalSteps = SECTIONS.length + 1 // + la declaración y la firma
  const isLast = step === totalSteps - 1

  // Recupera lo escrito si se recarga la página o se cierra sin querer
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setAnswers(JSON.parse(saved) as Answers)
    } catch {
      // si el navegador no deja guardar, se sigue sin recuperar
    }
    setRestored(true)
  }, [])

  useEffect(() => {
    if (!restored) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
    } catch {
      // sin espacio o en modo privado: no es motivo para romper el formulario
    }
  }, [answers, restored])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const setValue = useCallback((id: string, v: Value) => {
    setAnswers(prev => ({ ...prev, [id]: v }))
  }, [])

  function validateStep(): string {
    if (step === 0) {
      const nombre = typeof answers.nombre === 'string' ? answers.nombre.trim() : ''
      const email = typeof answers.email === 'string' ? answers.email.trim() : ''
      if (!nombre) return 'Necesitamos tu nombre para saber de quién es el cuestionario'
      if (!isEmail(email)) return 'Escribe un correo electrónico válido'
    }
    if (isLast) {
      if (!declaracion) return 'Confirma la declaración para poder enviar el cuestionario'
      if (!consent) return 'Necesitamos tu autorización para tratar los datos de este cuestionario'
      if (!signature) return 'Falta tu firma'
    }
    return ''
  }

  function next() {
    const problem = validateStep()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setStep(s => Math.min(s + 1, totalSteps - 1))
  }

  async function submit() {
    const problem = validateStep()
    if (problem) {
      setError(problem)
      return
    }
    setError('')
    setSending(true)
    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, answers, signature, consent, declaracion, optionalConsents }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(json.error ?? 'No se pudo enviar el cuestionario. Inténtalo de nuevo.')
        return
      }
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // da igual: el cuestionario ya está guardado
      }
      setSent(true)
    } catch {
      setError('No hay conexión. Comprueba la red e inténtalo otra vez.')
    } finally {
      setSending(false)
    }
  }

  if (sent) {
    return (
      <div className="max-w-[560px] mx-auto px-5 py-24 text-center">
        <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="font-serif text-[28px] text-carbon-900 mb-3">Cuestionario recibido</h1>
        <p className="text-[15px] text-carbon-500 leading-relaxed">
          Gracias. Tu equipo médico lo revisará antes de tu cita. Si necesitamos aclarar algo, te lo
          preguntaremos en la consulta.
        </p>
      </div>
    )
  }

  const section = step < SECTIONS.length ? SECTIONS[step] : null
  const progreso = Math.round(((step + 1) / totalSteps) * 100)

  return (
    <div className="max-w-[680px] mx-auto px-5 py-10 sm:py-14">
      {/* Cabecera */}
      <div className="text-center mb-8">
        <p className="text-[11px] tracking-[0.28em] uppercase text-carbon-400 mb-2">QUEVI Wellness Clinic</p>
        <h1 className="font-serif text-[26px] sm:text-[30px] text-carbon-900 leading-tight">
          {config.title}
        </h1>
      </div>

      {/* Progreso */}
      <div className="mb-8">
        <div className="h-1.5 rounded-full bg-cream-300 overflow-hidden">
          <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: `${progreso}%` }} />
        </div>
        <p className="text-[12px] text-carbon-400 mt-2 text-center">
          Paso {step + 1} de {totalSteps}
        </p>
      </div>

      <div className="rounded-2xl border border-cream-400 bg-cream-100 p-5 sm:p-7">
        {section ? (
          <>
            <h2 className={`font-serif text-[21px] text-carbon-900 ${section.intro ? 'mb-1' : 'mb-6'}`}>
              {section.title}
            </h2>
            {section.intro && (
              <p className="text-[14px] text-carbon-500 leading-relaxed mb-6">{section.intro}</p>
            )}
            <div className="space-y-7">
              {section.fields.map(field => (
                <div key={field.id}>
                  <FieldInput field={field} value={answers[field.id]} onChange={v => setValue(field.id, v)} />
                  {/* Campo de detalle asociado a la respuesta */}
                  {field.type === 'yesno' && field.detail && answers[field.id] === (field.detailOn ?? 'Sí') && (
                    <input
                      type="text"
                      placeholder={field.detail}
                      value={typeof answers[`${field.id}_detalle`] === 'string' ? (answers[`${field.id}_detalle`] as string) : ''}
                      onChange={e => setValue(`${field.id}_detalle`, e.target.value)}
                      className={`${inputCls} mt-2`}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <h2 className="font-serif text-[21px] text-carbon-900 mb-4">Consentimiento, declaración y firma</h2>

            {/* Aviso clínico propio de cada cuestionario */}
            <div className="rounded-xl border border-terra-200 bg-terra-50 p-4 mb-5">
              <p className="text-[14px] text-terra-900 leading-relaxed m-0">
                <strong>Importante:</strong> {config.aviso}
              </p>
            </div>

            {/* Información de protección de datos */}
            <div className="rounded-xl border border-cream-400 bg-cream-50 p-4 mb-5 space-y-3">
              <div>
                <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 m-0 mb-1">
                  Responsable del tratamiento
                </p>
                <p className="text-[13px] text-carbon-700 leading-relaxed m-0">{RESPONSABLE}</p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 m-0 mb-1">
                  Finalidad, base legal y conservación
                </p>
                <p className="text-[13px] text-carbon-700 leading-relaxed m-0">{FINALIDAD}</p>
              </div>
            </div>

            <div className="rounded-xl border border-cream-400 bg-cream-50 p-4 mb-5">
              <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 m-0 mb-1">Declaración</p>
              <p className="text-[14px] text-carbon-700 leading-relaxed m-0">{config.declaracion}</p>
            </div>

            <div className="space-y-3 mb-6">
              <button
                type="button"
                onClick={() => setDeclaracion(v => !v)}
                className="flex items-start gap-3 text-left w-full"
              >
                <span
                  className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
                    declaracion ? 'border-brand-600 bg-brand-600 text-cream-50' : 'border-carbon-300 bg-white'
                  }`}
                >
                  {declaracion && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <span className="text-[14px] text-carbon-700 leading-relaxed">
                  Confirmo la declaración anterior.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setConsent(v => !v)}
                className="flex items-start gap-3 text-left w-full"
              >
                <span
                  className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
                    consent ? 'border-brand-600 bg-brand-600 text-cream-50' : 'border-carbon-300 bg-white'
                  }`}
                >
                  {consent && (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  )}
                </span>
                <span className="text-[14px] text-carbon-700 leading-relaxed">
                  {CONSENTIMIENTO} <span className="text-carbon-400">(obligatorio para continuar)</span>
                </span>
              </button>
            </div>

            {/* Autorizaciones opcionales: ninguna viene marcada por defecto */}
            <div className="space-y-4 mb-6">
              <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 m-0">
                Autorizaciones opcionales
              </p>
              {CONSENTIMIENTOS_OPCIONALES.map(c => (
                <div key={c.id}>
                  <p className="text-[14px] text-carbon-700 leading-relaxed m-0 mb-2">{c.label}</p>
                  <div className="flex gap-2">
                    {['Sí', 'No'].map(opt => (
                      <button
                        key={opt}
                        type="button"
                        onClick={() =>
                          setOptionalConsents(prev => ({
                            ...prev,
                            [c.id]: prev[c.id] === opt ? '' : opt,
                          }))
                        }
                        className={`px-6 py-2.5 rounded-xl border text-[14px] font-medium transition-colors ${
                          optionalConsents[c.id] === opt
                            ? 'border-brand-500 bg-brand-600 text-cream-50'
                            : 'border-cream-400 bg-cream-50 text-carbon-700 hover:border-brand-300'
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[13px] tracking-[0.1em] uppercase text-carbon-400 mb-2">Firma</p>
            <SignaturePad onChange={setSignature} />
          </>
        )}

        {error && (
          <p className="mt-5 text-[14px] text-terra-700 bg-terra-50 border border-terra-200 rounded-xl px-4 py-3">
            {error}
          </p>
        )}

        {/* Navegación */}
        <div className="flex items-center justify-between gap-3 mt-8">
          <button
            type="button"
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="px-5 py-3 rounded-full border border-cream-400 text-[14px] text-carbon-500 hover:text-carbon-900 transition-colors disabled:opacity-40"
          >
            Atrás
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={sending}
              className="px-7 py-3 rounded-full bg-brand-600 text-cream-50 text-[14px] font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {sending ? 'Enviando…' : 'Firmar y enviar'}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="px-7 py-3 rounded-full bg-brand-600 text-cream-50 text-[14px] font-medium hover:bg-brand-700 transition-colors"
            >
              Continuar
            </button>
          )}
        </div>
      </div>

      <p className="text-[12px] text-carbon-400 text-center mt-6 leading-relaxed">
        Tus respuestas solo las ve el equipo médico de la clínica. Lo que escribes se conserva en este
        dispositivo hasta que envías el cuestionario, por si se te cierra la página.
      </p>
    </div>
  )
}
