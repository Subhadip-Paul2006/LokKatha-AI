import { SiteNav } from '@/components/site-nav'
import { Hero } from '@/components/hero'
import { Mission } from '@/components/mission'
import { RecordStory } from '@/components/record-story'
import { AskLokKatha } from '@/components/ask-lokkatha'
import { StoryGrid } from '@/components/story-grid'
import { HeritageTimeline } from '@/components/heritage-timeline'
import { SiteFooter } from '@/components/site-footer'
import { I18nProvider } from '@/lib/i18n'

export default function Page() {
  return (
    <I18nProvider>
      <main className="min-h-screen bg-background">
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
