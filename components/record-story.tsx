'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Mic, Upload } from 'lucide-react'
import { PROCESSING_STEPS, ProcessingTimeline } from '@/components/processing-timeline'
import { Reveal } from '@/components/reveal'

const languages = ['Bengali', 'Hindi', 'Santali', 'Odia', 'Assamese', 'Maithili', 'Bhojpuri']

type Errors = Partial<Record<'source' | 'language' | 'district', string>>

export function RecordStory() {
  const [mode, setMode] = useState<'upload' | 'record'>('upload')
  const [hasSource, setHasSource] = useState(false)
  const [sourceName, setSourceName] = useState('')
  const [language, setLanguage] = useState('')
  const [district, setDistrict] = useState('')
  const [errors, setErrors] = useState<Errors>({})
  const [phase, setPhase] = useState<'form' | 'processing' | 'done'>('form')
  const [activeIndex, setActiveIndex] = useState(0)
  const timers = useRef<ReturnType<typeof setTimeout>[]>([])

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  function validate() {
    const next: Errors = {}
    if (!hasSource) next.source = 'Please upload audio or record a voice sample.'
    if (!language) next.language = 'Choose the language of the story.'
    if (!district.trim()) next.district = 'District is required.'
    setErrors(next)
    return Object.keys(next).length === 0
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validate()) return
    setPhase('processing')
    setActiveIndex(0)
    PROCESSING_STEPS.forEach((_, i) => {
      const t = setTimeout(
        () => {
          if (i === PROCESSING_STEPS.length - 1) setPhase('done')
          else setActiveIndex(i + 1)
        },
        (i + 1) * 850,
      )
      timers.current.push(t)
    })
  }

  function reset() {
    timers.current.forEach(clearTimeout)
    timers.current = []
    setPhase('form')
    setHasSource(false)
    setSourceName('')
    setLanguage('')
    setDistrict('')
    setErrors({})
    setActiveIndex(0)
  }

  return (
    <section id="record" className="bg-palmleaf/60 py-16 md:py-24">
      <div className="mx-auto max-w-3xl px-4 md:px-6">
        <Reveal className="text-center">
          <p className="font-accent text-terracotta-deep">Add to the archive</p>
          <h2 className="mt-2 text-balance font-heading text-3xl font-semibold text-ink md:text-4xl">
            Record a story from your village
          </h2>
          <p className="mx-auto mt-3 max-w-xl leading-relaxed text-brown-dark">
            Every entry becomes part of a shared register — spoken as it has always been, kept
            for those who come after.
          </p>
        </Reveal>

        <Reveal className="mt-10">
          <div className="paper-grain rounded-[28px] border-2 border-brown-dark/20 bg-paper-old p-6 shadow-paper-lg md:p-8">
            {phase === 'form' && (
              <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
                {/* Source toggle */}
                <div>
                  <div className="mb-2 flex rounded-xl border-2 border-brown-dark/20 bg-cream p-1">
                    {(['upload', 'record'] as const).map((m) => (
                      <button
                        key={m}
                        type="button"
                        onClick={() => setMode(m)}
                        className={`flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${
                          mode === m
                            ? 'bg-clay-orange text-paper-old shadow-paper'
                            : 'text-brown-dark'
                        }`}
                      >
                        {m === 'upload' ? (
                          <Upload size={18} strokeWidth={1.5} aria-hidden="true" />
                        ) : (
                          <Mic size={18} strokeWidth={1.5} aria-hidden="true" />
                        )}
                        {m === 'upload' ? 'Upload Audio' : 'Record Voice'}
                      </button>
                    ))}
                  </div>

                  {mode === 'upload' ? (
                    <label className="flex min-h-11 cursor-pointer items-center justify-between rounded-xl border-2 border-dashed border-brown-dark/30 bg-cream px-4 py-4 text-brown-dark transition-colors hover:border-terracotta">
                      <span className="text-sm">
                        {sourceName || 'Choose an audio file (.mp3, .wav, .m4a)'}
                      </span>
                      <Upload size={20} strokeWidth={1.5} aria-hidden="true" />
                      <input
                        type="file"
                        accept="audio/*"
                        className="sr-only"
                        onChange={(e) => {
                          const f = e.target.files?.[0]
                          setHasSource(Boolean(f))
                          setSourceName(f?.name ?? '')
                          if (f) setErrors((p) => ({ ...p, source: undefined }))
                        }}
                      />
                    </label>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setHasSource(true)
                        setSourceName('Voice sample captured (0:42)')
                        setErrors((p) => ({ ...p, source: undefined }))
                      }}
                      className={`flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border-2 px-4 py-4 text-sm font-medium transition-colors ${
                        hasSource
                          ? 'border-forest-green bg-forest-green/10 text-forest-green'
                          : 'border-brown-dark/30 bg-cream text-brown-dark hover:border-terracotta'
                      }`}
                    >
                      {hasSource ? (
                        <>
                          <Check size={20} strokeWidth={2} aria-hidden="true" /> {sourceName}
                        </>
                      ) : (
                        <>
                          <Mic size={20} strokeWidth={1.5} aria-hidden="true" /> Tap to record
                        </>
                      )}
                    </button>
                  )}
                  {errors.source && (
                    <p className="mt-2 text-sm font-medium text-accent-red">{errors.source}</p>
                  )}
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                  <Field label="Language" error={errors.language} required>
                    <select
                      value={language}
                      onChange={(e) => {
                        setLanguage(e.target.value)
                        if (e.target.value) setErrors((p) => ({ ...p, language: undefined }))
                      }}
                      className="min-h-11 w-full rounded-xl border-2 border-brown-dark/20 bg-cream px-3 text-ink focus:border-terracotta"
                    >
                      <option value="">Select a language</option>
                      {languages.map((l) => (
                        <option key={l} value={l}>
                          {l}
                        </option>
                      ))}
                    </select>
                  </Field>

                  <Field label="District" error={errors.district} required>
                    <input
                      value={district}
                      onChange={(e) => {
                        setDistrict(e.target.value)
                        if (e.target.value.trim())
                          setErrors((p) => ({ ...p, district: undefined }))
                      }}
                      placeholder="e.g. Bankura"
                      className="min-h-11 w-full rounded-xl border-2 border-brown-dark/20 bg-cream px-3 text-ink placeholder:text-temple-stone focus:border-terracotta"
                    />
                  </Field>

                  <Field label="Village (optional)">
                    <input
                      placeholder="e.g. Panchmura"
                      className="min-h-11 w-full rounded-xl border-2 border-brown-dark/20 bg-cream px-3 text-ink placeholder:text-temple-stone focus:border-terracotta"
                    />
                  </Field>

                  <Field label="Speaker name (optional)">
                    <input
                      placeholder="Name of the storyteller"
                      className="min-h-11 w-full rounded-xl border-2 border-brown-dark/20 bg-cream px-3 text-ink placeholder:text-temple-stone focus:border-terracotta"
                    />
                  </Field>
                </div>

                <button
                  type="submit"
                  className="inline-flex min-h-11 items-center justify-center rounded-xl bg-clay-orange px-6 text-base font-semibold text-paper-old shadow-paper transition-transform duration-200 ease-out hover:scale-[1.01] hover:shadow-paper-lg"
                >
                  Submit to the archive
                </button>
              </form>
            )}

            {phase === 'processing' && (
              <div className="py-4">
                <p className="mb-8 text-center font-quote text-lg italic text-brown-dark">
                  Preserving your story, unhurried and with care…
                </p>
                <ProcessingTimeline activeIndex={activeIndex} />
              </div>
            )}

            {phase === 'done' && (
              <div className="py-6 text-center">
                <span className="mx-auto grid size-14 place-items-center rounded-full border-2 border-forest-green bg-forest-green/10 text-forest-green">
                  <Check size={28} strokeWidth={2} aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-heading text-2xl font-semibold text-ink">
                  Your story has been preserved
                </h3>
                <p className="mx-auto mt-2 max-w-md leading-relaxed text-brown-dark">
                  Thank you for adding to India&apos;s living memory. A librarian will review it
                  and it will soon join the archive.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="mt-6 inline-flex min-h-11 items-center rounded-xl border-2 border-terracotta px-6 font-semibold text-terracotta-deep transition-colors hover:bg-terracotta/10"
                >
                  Record another
                </button>
              </div>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  )
}

function Field({
  label,
  error,
  required,
  children,
}: {
  label: string
  error?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold text-brown-dark">
        {label}
        {required && <span className="text-terracotta-deep"> *</span>}
      </span>
      {children}
      {error && <span className="mt-1 block text-sm font-medium text-accent-red">{error}</span>}
    </label>
  )
}
