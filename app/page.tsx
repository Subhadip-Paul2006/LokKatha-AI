'use client'

import { useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { Mission } from '@/components/mission'
import { RecordStory } from '@/components/record-story'
import { AskLokKatha } from '@/components/ask-lokkatha'
import { StoryGrid } from '@/components/story-grid'
import { HeritageTimeline } from '@/components/heritage-timeline'
import { SiteFooter } from '@/components/site-footer'
import { I18nProvider } from '@/lib/i18n'
import { CinematicIntro } from '@/components/cinematic-intro'

export default function Page() {
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
