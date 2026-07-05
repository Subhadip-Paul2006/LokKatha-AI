'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { Mission } from '@/components/mission'
import { RecordStory } from '@/components/record-story'
import { StoryGrid } from '@/components/story-grid'
import { HeritageTimeline } from '@/components/heritage-timeline'
import { SiteFooter } from '@/components/site-footer'
import { I18nProvider } from '@/lib/i18n'
import { CinematicIntro } from '@/components/cinematic-intro'

// AskLokKatha uses useSyncExternalStore (client-only store).
// dynamic + ssr:false prevents any remaining prerender crash.
const AskLokKatha = dynamic(
  () => import('@/components/ask-lokkatha').then((mod) => mod.AskLokKatha),
  {
    ssr: false,
    loading: () => (
      <section className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
        <div className="flex h-[80vh] min-h-[600px] w-full items-center justify-center rounded-3xl border-2 border-[#8B5E3C]/20 bg-[#F4F1EA]">
          <p className="text-[#8B5E3C]/60 font-serif text-lg">Loading LokKatha AI…</p>
        </div>
      </section>
    ),
  }
)

export function HomeClient() {
  const [introDone, setIntroDone] = useState(false)

  return (
    <I18nProvider>
      <CinematicIntro onComplete={() => setIntroDone(true)} />
      <main
        className={`min-h-screen bg-background transition-opacity duration-700 ${
          introDone ? 'opacity-100' : 'opacity-90'
        }`}
      >
        <SiteNav />
        <Hero />
        <Mission />
        <RecordStory />
        <AskLokKatha />
        <StoryGrid />
        <HeritageTimeline />
        <SiteFooter />
      </main>
    </I18nProvider>
  )
}
