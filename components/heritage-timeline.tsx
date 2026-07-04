import { heritageTimeline } from '@/lib/stories'
import { Reveal } from '@/components/reveal'

export function HeritageTimeline() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <Reveal className="max-w-2xl">
        <p className="font-accent text-terracotta-deep">A walk through time</p>
        <h2 className="mt-2 text-balance font-heading text-3xl font-semibold text-ink md:text-4xl">
          Heritage timeline
        </h2>
        <p className="mt-3 leading-relaxed text-brown-dark">
          Memory moves by decades. Each marker holds a tradition that once filled courtyards
          and fields.
        </p>
      </Reveal>

      {/* Horizontal scroll-snap on desktop; vertical stack on mobile */}
      <Reveal className="mt-10">
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute left-4 top-0 hidden h-px w-full bg-brown-dark/20 md:left-0 md:top-6 md:block"
          />
          <ol className="flex snap-x snap-mandatory flex-col gap-6 overflow-x-auto pb-4 md:flex-row md:gap-5">
            {heritageTimeline.map((entry) => (
              <li
                key={entry.decade}
                className="relative shrink-0 snap-start md:w-72"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-4 top-2 size-3 -translate-x-1/2 rounded-full border-2 border-terracotta bg-cream md:left-0 md:top-[18px]"
                />
                <div className="pl-10 md:pl-0 md:pt-12">
                  <span className="font-heading text-2xl font-semibold text-terracotta">
                    {entry.decade}
                  </span>
                  <div className="paper-grain mt-2 rounded-[20px] border-2 border-brown-dark/20 bg-paper-old p-4 shadow-paper">
                    <h3 className="font-heading text-lg font-semibold text-ink">
                      {entry.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-brown-dark">
                      {entry.note}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </Reveal>
    </section>
  )
}
