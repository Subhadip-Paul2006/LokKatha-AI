import { Heart } from 'lucide-react'
import { GithubMark } from '@/components/marks'

export function SiteFooter() {
  return (
    <footer className="bg-[var(--clay-orange)] text-paper-old">
      <div className="mx-auto max-w-6xl px-4 py-12 md:px-6">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-md">
            <p className="font-heading text-2xl font-semibold">
              LokKatha <span className="text-cream">AI</span>
            </p>
            <p className="mt-3 leading-relaxed text-paper-old/90">
              A digital cultural archive that preserves the voices, traditions, and wisdom of
              India&apos;s villages — so no story is lost to time.
            </p>
          </div>

          <div className="flex flex-col gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 font-medium text-paper-old underline-offset-4 hover:underline"
            >
              <GithubMark size={20} /> GitHub
            </a>
            <span className="text-paper-old/90">The LokKatha Team</span>
            <span className="text-paper-old/90">In partnership with rural heritage NGOs</span>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-paper-old/25 pt-6 text-sm text-paper-old/90 md:flex-row">
          <span className="inline-flex items-center gap-1.5">
            Made with{' '}
            <Heart size={16} strokeWidth={1.5} fill="currentColor" aria-label="love" /> using
            Gemma
          </span>
          <span>Preserving India&apos;s living cultural memory.</span>
        </div>
      </div>
    </footer>
  )
}
