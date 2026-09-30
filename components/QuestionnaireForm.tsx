'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DOCS,
  FORMS,
  IDENTITY_FIELDS,
  CONSENTIMIENTO,
  CONSENTIMIENTOS_OPCIONALES,
  NOTA_PROTECCION_DATOS,
  RESPONSABLE,
  FINALIDAD,
  isFormKey,
  type DocKey,
  type Field,
} from '@/lib/questionnaires'
import { LANGS, tr, ui, type Lang } from '@/lib/questionnaires.en'

// Formulario público de los documentos que firma la paciente: la protección de
// datos y los cuestionarios de salud (piel y tricología). Se usa igual desde el
// móvil de la paciente en su casa que desde la tablet de la clínica: por pasos,
// con botones grandes y firma con el dedo.
//
// Un enlace puede llevar varios documentos seguidos (primero la protección de
// datos y después el cuestionario): cada uno se firma y se guarda por separado,
// y los datos de la paciente no se vuelven a pedir en el segundo.
//
// Se puede rellenar en castellano o en inglés (conmutador arriba, o el enlace
// con ?lang=en). El idioma solo cambia lo que se lee: las respuestas se guardan
// siempre con el texto en castellano, para que el panel y los avisos médicos
// funcionen igual.

type Value = string | string[] | Record<string, string>
type Answers = Record<string, Value>

const storageKey = (doc: DocKey) => `quevi-cuestionario-${doc}`

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
  lang,
}: {
  field: Field
  value: Value | undefined
  onChange: (v: Value) => void
  error?: string
  lang: Lang
}) {
  return (
    <div className="space-y-2">
      <label className="block text-[15px] font-medium text-carbon-900 leading-snug">{tr(field.label, lang)}</label>
      {field.help && <p className="text-[13px] text-carbon-400 leading-relaxed m-0">{tr(field.help, lang)}</p>}

      {(field.type === 'text' || field.type === 'number') && (
        <input
          type={field.type === 'number' ? 'number' : 'text'}
          inputMode={field.id === 'email' ? 'email' : undefined}
          autoComplete={field.id === 'email' ? 'email' : field.id === 'nombre' ? 'name' : field.id === 'telefono' ? 'tel' : 'off'}
          value={typeof value === 'string' ? value : ''}
          onChange={e => onChange(e.target.value)}
          placeholder={field.placeholder && tr(field.placeholder, lang)}
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
            <Choice key={opt} label={tr(opt, lang)} selected={value === opt} onClick={() => onChange(value === opt ? '' : opt)} />
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
                label={tr(opt, lang)}
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
              {tr(opt, lang)}
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
              <span>{tr(field.minLabel, lang)}</span>
              <span>{tr(field.maxLabel, lang)}</span>
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
                    {tr(field.groups[row.id], lang)}
                  </p>
                )}
                <p className="text-[14px] text-carbon-700 leading-snug mb-1.5 m-0">{tr(row.label, lang)}</p>
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
                      {tr(opt, lang)}
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
function SignaturePad({ onChange, lang }: { onChange: (dataUrl: string) => void; lang: Lang }) {
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
        <p className="text-[13px] text-carbon-400 m-0">{ui(lang).signatureHint}</p>
        <button type="button" onClick={clear} className="text-[13px] text-carbon-500 underline underline-offset-2">
          {ui(lang).clearSignature}
        </button>
      </div>
    </div>
  )
}

// ── Casilla de confirmación ──────────────────────────────────────────────────
function Check({ checked, onClick, children }: { checked: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" onClick={onClick} className="flex items-start gap-3 text-left w-full">
      <span
        className={`flex-shrink-0 mt-0.5 w-5 h-5 rounded-md border flex items-center justify-center ${
          checked ? 'border-brand-600 bg-brand-600 text-cream-50' : 'border-carbon-300 bg-white'
        }`}
      >
        {checked && (
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        )}
      </span>
      <span className="text-[14px] text-carbon-700 leading-relaxed">{children}</span>
    </button>
  )
}

// ── Un documento: sus pasos, su firma y su envío ─────────────────────────────
function DocumentForm({
  doc,
  lang,
  identity,
  onSigned,
}: {
  doc: DocKey
  lang: Lang
  /** Datos de la paciente que ya dio en el documento anterior: no se vuelven a pedir */
  identity: Answers | null
  onSigned: (answers: Answers) => void
}) {
  const t = ui(lang)
  const config = DOCS[doc]
  const form = isFormKey(doc) ? FORMS[doc] : null
  const SECTIONS = identity ? config.sections.filter(s => s.id !== 'datos') : config.sections
  const STORAGE_KEY = storageKey(doc)

  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [signature, setSignature] = useState('')
  const [consent, setConsent] = useState(false)
  const [declaracion, setDeclaracion] = useState(false)
  // Los opcionales: ninguno viene marcado por defecto
  const [optionalConsents, setOptionalConsents] = useState<Record<string, string>>({})
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [restored, setRestored] = useState(false)

  const totalSteps = SECTIONS.length + 1 // + la firma
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

  // Al cambiar de idioma, el error que hubiera se queda en el idioma anterior
  useEffect(() => setError(''), [lang])

  const setValue = useCallback((id: string, v: Value) => {
    setAnswers(prev => ({ ...prev, [id]: v }))
  }, [])

  const section = step < SECTIONS.length ? SECTIONS[step] : null

  function validateStep(): string {
    if (section?.id === 'datos') {
      const nombre = typeof answers.nombre === 'string' ? answers.nombre.trim() : ''
      const email = typeof answers.email === 'string' ? answers.email.trim() : ''
      if (!nombre) return t.errName
      if (!isEmail(email)) return t.errEmail
    }
    if (isLast) {
      if (form && !declaracion) return t.errDeclaration
      if (!form && !consent) return t.errConsent
      if (!signature) return t.errSignature
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
    // Los datos del documento anterior mandan: son los que ya firmó
    const signedAnswers: Answers = identity ? { ...answers, ...identity } : answers
    try {
      const res = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // __lang: en qué idioma lo leyó la paciente (las respuestas van en castellano)
        body: JSON.stringify({
          form: doc,
          answers: { ...signedAnswers, __lang: lang },
          signature,
          ...(form ? { declaracion } : { consent, optionalConsents }),
        }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        // Los errores del servidor vienen en castellano
        setError(lang === 'es' && json.error ? json.error : t.errSend)
        return
      }
      try {
        localStorage.removeItem(STORAGE_KEY)
      } catch {
        // da igual: el documento ya está guardado
      }
      onSigned(signedAnswers)
    } catch {
      setError(t.errNetwork)
    } finally {
      setSending(false)
    }
  }

  const progreso = Math.round(((step + 1) / totalSteps) * 100)

  return (
    <>
      {/* Progreso dentro del documento */}
      <div className="mb-8">
        <div className="h-1.5 rounded-full bg-cream-300 overflow-hidden">
          <div className="h-full bg-brand-600 transition-all duration-300" style={{ width: `${progreso}%` }} />
        </div>
        <p className="text-[12px] text-carbon-400 mt-2 text-center">{t.step(step + 1, totalSteps)}</p>
      </div>

      <div className="rounded-2xl border border-cream-400 bg-cream-100 p-5 sm:p-7">
        {section ? (
          <>
            <h2 className={`font-serif text-[21px] text-carbon-900 ${section.intro ? 'mb-1' : 'mb-6'}`}>
              {tr(section.title, lang)}
            </h2>
            {section.intro && (
              <p className="text-[14px] text-carbon-500 leading-relaxed mb-6">{tr(section.intro, lang)}</p>
            )}
            <div className="space-y-7">
              {section.fields.map(field => (
                <div key={field.id}>
                  <FieldInput field={field} value={answers[field.id]} onChange={v => setValue(field.id, v)} lang={lang} />
                  {/* Campo de detalle asociado a la respuesta */}
                  {field.type === 'yesno' && field.detail && answers[field.id] === (field.detailOn ?? 'Sí') && (
                    <input
                      type="text"
                      placeholder={tr(field.detail, lang)}
                      value={typeof answers[`${field.id}_detalle`] === 'string' ? (answers[`${field.id}_detalle`] as string) : ''}
                      onChange={e => setValue(`${field.id}_detalle`, e.target.value)}
                      className={`${inputCls} mt-2`}
                    />
                  )}
                </div>
              ))}
            </div>
          </>
        ) : form ? (
          // ── Cierre de un cuestionario: aviso, declaración y firma ──
          <>
            <h2 className="font-serif text-[21px] text-carbon-900 mb-4">{t.finalTitleForm}</h2>

            <div className="rounded-xl border border-terra-200 bg-terra-50 p-4 mb-5">
              <p className="text-[14px] text-terra-900 leading-relaxed m-0">
                <strong>{t.important}</strong> {tr(form.aviso, lang)}
              </p>
            </div>

            <div className="rounded-xl border border-cream-400 bg-cream-50 p-4 mb-5">
              <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 m-0 mb-1">{t.declaration}</p>
              <p className="text-[14px] text-carbon-700 leading-relaxed m-0">{tr(form.declaracion, lang)}</p>
            </div>

            <div className="mb-5">
              <Check checked={declaracion} onClick={() => setDeclaracion(v => !v)}>
                {t.confirmDeclaration}
              </Check>
            </div>

            <p className="text-[12px] text-carbon-400 leading-relaxed mb-6">{tr(NOTA_PROTECCION_DATOS, lang)}</p>

            <p className="text-[13px] tracking-[0.1em] uppercase text-carbon-400 mb-2">{t.signature}</p>
            <SignaturePad onChange={setSignature} lang={lang} />
          </>
        ) : (
          // ── Cierre de la protección de datos: información, autorizaciones y firma ──
          <>
            <h2 className="font-serif text-[21px] text-carbon-900 mb-4">{t.finalTitleDatos}</h2>

            <div className="rounded-xl border border-cream-400 bg-cream-50 p-4 mb-5 space-y-3">
              <div>
                <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 m-0 mb-1">{t.responsable}</p>
                <p className="text-[13px] text-carbon-700 leading-relaxed m-0">{tr(RESPONSABLE, lang)}</p>
              </div>
              <div>
                <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 m-0 mb-1">{t.finalidad}</p>
                <p className="text-[13px] text-carbon-700 leading-relaxed m-0">{tr(FINALIDAD, lang)}</p>
              </div>
            </div>

            <div className="mb-6">
              <Check checked={consent} onClick={() => setConsent(v => !v)}>
                {tr(CONSENTIMIENTO, lang)} <span className="text-carbon-400">{t.requiredToContinue}</span>
              </Check>
            </div>

            {/* Autorizaciones opcionales: ninguna viene marcada por defecto */}
            <div className="space-y-4 mb-6">
              <p className="text-[11px] tracking-[0.14em] uppercase text-carbon-400 m-0">{t.optionalConsents}</p>
              {CONSENTIMIENTOS_OPCIONALES.map(c => (
                <div key={c.id}>
                  <p className="text-[14px] text-carbon-700 leading-relaxed m-0 mb-2">{tr(c.label, lang)}</p>
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
                        {opt === 'Sí' ? t.yes : t.no}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[13px] tracking-[0.1em] uppercase text-carbon-400 mb-2">{t.signature}</p>
            <SignaturePad onChange={setSignature} lang={lang} />
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
            {t.back}
          </button>

          {isLast ? (
            <button
              type="button"
              onClick={submit}
              disabled={sending}
              className="px-7 py-3 rounded-full bg-brand-600 text-cream-50 text-[14px] font-medium hover:bg-brand-700 transition-colors disabled:opacity-50"
            >
              {sending ? t.sending : t.submit}
            </button>
          ) : (
            <button
              type="button"
              onClick={next}
              className="px-7 py-3 rounded-full bg-brand-600 text-cream-50 text-[14px] font-medium hover:bg-brand-700 transition-colors"
            >
              {t.continue}
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ── El enlace completo: uno o varios documentos seguidos ─────────────────────
// Por dónde va la paciente se guarda en el dispositivo, para que si recarga
// después de firmar la protección de datos no se la vuelva a pedir. Caduca
// pronto: en la tablet de la clínica, la siguiente paciente no debe heredarlo.
const FLOW_TTL = 2 * 60 * 60 * 1000

type FlowState = { index: number; identity: Answers; at: number }

export default function QuestionnaireFlow({ docs, initialLang = 'es' }: { docs: DocKey[]; initialLang?: Lang }) {
  const [lang, setLang] = useState<Lang>(initialLang)
  const [index, setIndex] = useState(0)
  const [identity, setIdentity] = useState<Answers | null>(null)
  const [finished, setFinished] = useState(false)
  const t = ui(lang)
  const FLOW_KEY = `quevi-documentos-${docs.join('-')}`

  useEffect(() => {
    if (docs.length < 2) return
    try {
      const saved = JSON.parse(localStorage.getItem(FLOW_KEY) ?? 'null') as FlowState | null
      if (saved && Date.now() - saved.at < FLOW_TTL && saved.index > 0 && saved.index < docs.length) {
        setIndex(saved.index)
        setIdentity(saved.identity)
      }
    } catch {
      // sin acceso al almacenamiento: se empieza por el primero
    }
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [index])

  function changeLang(next: Lang) {
    setLang(next)
    // Se refleja en la dirección para que, si se recarga, siga en el mismo idioma
    const url = new URL(window.location.href)
    if (next === 'es') url.searchParams.delete('lang')
    else url.searchParams.set('lang', next)
    window.history.replaceState(null, '', url)
  }

  function forgetFlow() {
    try {
      localStorage.removeItem(FLOW_KEY)
    } catch {
      // nada que limpiar
    }
  }

  function handleSigned(answers: Answers) {
    const who: Answers =
      identity ?? Object.fromEntries(IDENTITY_FIELDS.filter(id => answers[id] !== undefined).map(id => [id, answers[id]]))
    const next = index + 1
    if (next >= docs.length) {
      forgetFlow()
      setFinished(true)
      return
    }
    try {
      localStorage.setItem(FLOW_KEY, JSON.stringify({ index: next, identity: who, at: Date.now() } satisfies FlowState))
    } catch {
      // si no se puede guardar, solo se pierde la recuperación al recargar
    }
    setIdentity(who)
    setIndex(next)
  }

  function restart() {
    forgetFlow()
    // Lo que hubiera a medias es de la otra persona
    try {
      for (const d of docs) localStorage.removeItem(storageKey(d))
    } catch {
      // nada que limpiar
    }
    setIdentity(null)
    setIndex(0)
  }

  const onlyDatos = docs.every(d => d === 'datos')

  if (finished) {
    return (
      <div lang={lang} className="max-w-[560px] mx-auto px-5 py-24 text-center">
        <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h1 className="font-serif text-[28px] text-carbon-900 mb-3">{onlyDatos ? t.sentTitleDatos : t.sentTitle}</h1>
        <p className="text-[15px] text-carbon-500 leading-relaxed">{onlyDatos ? t.sentBodyDatos : t.sentBody}</p>
      </div>
    )
  }

  const doc = docs[index]
  const nombre = identity
    ? [identity.nombre, identity.apellidos].filter(v => typeof v === 'string' && v.trim()).join(' ')
    : ''

  return (
    <div lang={lang} className="max-w-[680px] mx-auto px-5 py-10 sm:py-14">
      {/* Idioma */}
      <div className="flex justify-end mb-4">
        <div role="group" aria-label={t.langLabel} className="inline-flex rounded-full border border-cream-400 bg-cream-50 p-0.5">
          {LANGS.map(l => (
            <button
              key={l}
              type="button"
              lang={l}
              onClick={() => changeLang(l)}
              aria-pressed={lang === l}
              className={`px-3.5 py-1.5 rounded-full text-[12px] font-medium tracking-[0.08em] transition-colors ${
                lang === l ? 'bg-brand-600 text-cream-50' : 'text-carbon-500 hover:text-carbon-900'
              }`}
            >
              {l === 'es' ? 'ES · Español' : 'EN · English'}
            </button>
          ))}
        </div>
      </div>

      {/* Cabecera */}
      <div className="text-center mb-8">
        <p className="text-[11px] tracking-[0.28em] uppercase text-carbon-400 mb-2">QUEVI Wellness Clinic</p>
        <h1 className="font-serif text-[26px] sm:text-[30px] text-carbon-900 leading-tight">
          {tr(DOCS[doc].title, lang)}
        </h1>
      </div>

      {/* Qué documentos incluye el enlace y por cuál va */}
      {docs.length > 1 && (
        <div className="mb-8">
          <p className="text-[12px] text-carbon-400 text-center mb-3">{t.docStep(index + 1, docs.length)}</p>
          <ol className="flex flex-wrap justify-center gap-2 list-none p-0 m-0">
            {docs.map((d, i) => (
              <li
                key={d}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-[13px] ${
                  i === index
                    ? 'border-brand-500 bg-brand-50 text-brand-800 font-medium'
                    : i < index
                      ? 'border-cream-400 bg-cream-50 text-carbon-500'
                      : 'border-cream-400 text-carbon-400'
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] ${
                    i < index ? 'bg-brand-600 text-cream-50' : i === index ? 'bg-brand-600 text-cream-50' : 'bg-cream-300 text-carbon-500'
                  }`}
                >
                  {i < index ? '✓' : i + 1}
                </span>
                {tr(DOCS[d].name, lang)}
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Viene de firmar el documento anterior */}
      {identity && (
        <div className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-3 mb-6 text-[14px] text-brand-800 leading-relaxed">
          <p className="m-0">✓ {t.signedDatos}</p>
          {nombre && (
            <p className="m-0 mt-1 text-[13px] text-carbon-500">
              {t.fillingAs(nombre)}{' '}
              <button type="button" onClick={restart} className="underline underline-offset-2 hover:text-carbon-900">
                {t.notYou}
              </button>
            </p>
          )}
        </div>
      )}

      <DocumentForm key={doc} doc={doc} lang={lang} identity={identity} onSigned={handleSigned} />

      <p className="text-[12px] text-carbon-400 text-center mt-6 leading-relaxed">{t.footer}</p>
    </div>
  )
}
