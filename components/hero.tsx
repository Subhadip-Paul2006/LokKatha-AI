'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowRight, Feather } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export function Hero() {
  const { t } = useI18n()
  const FULL = t.hero.title
  const [typed, setTyped] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTyped(FULL)
      setDone(true)
      return
    }
    setTyped('')
    setDone(false)
    let i = 0
    const id = setInterval(() => {
      i += 1
      setTyped(FULL.slice(0, i))
      if (i >= FULL.length) {
        clearInterval(id)
        setDone(true)
      }
    }, 40)
    return () => clearInterval(id)
  }, [FULL])

  return (
    <section
      id="top"
      className="paper-grain relative overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24"
    >
      {/* Alpana line motif at low opacity */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-terracotta/40 to-transparent"
      />
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:px-6">
        <div className="order-2 md:order-1">
          <span className="lk-fade inline-flex items-center gap-2 rounded-full border border-brown-dark/20 bg-paper-old px-3 py-1 font-accent text-sm text-terracotta-deep">
            <Feather size={16} strokeWidth={1.5} aria-hidden="true" />
            {t.hero.badge}
          </span>

          <h1 className="mt-5 text-balance font-heading text-[32px] font-semibold leading-tight text-ink md:text-5xl lg:text-6xl">
            <span>{typed}</span>
            <span
              aria-hidden="true"
              className={`inline-block w-[0.06em] translate-y-1 ${
                done ? 'opacity-0' : 'lk-pulse bg-terracotta'
              }`}
              style={{ height: '0.9em' }}
            >
              &nbsp;
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-brown-dark">
            {t.hero.subtitle}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#ask"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl bg-clay-orange px-6 text-base font-semibold text-paper-old shadow-paper transition-transform duration-200 ease-out hover:scale-[1.02] hover:shadow-paper-lg"
            >
              {t.hero.explore}
              <ArrowRight size={20} strokeWidth={1.5} aria-hidden="true" />
            </a>
            <a
              href="#record"
              className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-terracotta bg-transparent px-6 text-base font-semibold text-terracotta-deep transition-colors duration-200 hover:bg-terracotta/10"
            >
              {t.hero.record}
            </a>
          </div>
        </div>

        <div className="lk-rise order-1 md:order-2">
          <div className="relative overflow-hidden rounded-[28px] border-2 border-brown-dark/20 bg-palmleaf shadow-paper-lg">
            <Image
              src="/images/hero-archive.png"
              alt="Folk-art illustration of a Bengal terracotta temple, palm-leaf manuscripts, and a courtyard library"
              width={720}
              height={720}
              priority
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
