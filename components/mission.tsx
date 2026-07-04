'use client'

import { Mic, Sparkles, TreeDeciduous } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { useI18n } from '@/lib/i18n'

const icons = [TreeDeciduous, Mic, Sparkles]

export function Mission() {
  const { t } = useI18n()
  const cards = t.mission.cards.map((c, i) => ({ ...c, icon: icons[i] }))

  return (
    <section id="mission" className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="font-accent text-terracotta-deep">{t.mission.eyebrow}</p>
        <h2 className="mt-2 text-balance font-heading text-3xl font-semibold text-ink md:text-4xl">
          {t.mission.heading}
        </h2>
      </Reveal>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {cards.map((c, i) => (
          <Reveal as="article" key={c.title} delay={i * 80}>
            <div className="paper-grain h-full rounded-[20px] border-2 border-brown-dark/20 bg-paper-old p-6 shadow-paper">
              <span className="grid size-12 place-items-center rounded-xl bg-cream text-terracotta">
                <c.icon size={28} strokeWidth={1.5} aria-hidden="true" />
              </span>
              <h3 className="mt-5 font-heading text-xl font-semibold text-ink">{c.title}</h3>
              <p className="mt-2 leading-relaxed text-brown-dark">{c.body}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  )
}
