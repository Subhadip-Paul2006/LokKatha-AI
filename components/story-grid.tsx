import Image from 'next/image'
import { ArrowRight, MapPin } from 'lucide-react'
import { recentStories } from '@/lib/stories'
import { Reveal } from '@/components/reveal'

export function StoryGrid() {
  return (
    <section id="stories" className="bg-palmleaf/60 py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-end">
          <div>
            <p className="font-accent text-terracotta-deep">From the archive</p>
            <h2 className="mt-2 text-balance font-heading text-3xl font-semibold text-ink md:text-4xl">
              Recently preserved stories
            </h2>
          </div>
          <a
            href="#ask"
            className="text-sm font-medium text-terracotta-deep underline-offset-4 hover:underline"
          >
            Explore the full archive
          </a>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recentStories.map((story, i) => (
            <Reveal as="article" key={story.id} delay={i * 80}>
              <div className="paper-grain group h-full overflow-hidden rounded-[20px] border-2 border-brown-dark/20 bg-paper-old shadow-paper transition-transform duration-200 ease-out hover:-translate-y-1 hover:shadow-paper-lg">
                <div className="relative aspect-[4/3] overflow-hidden bg-palmleaf">
                  <Image
                    src={story.image || '/placeholder.svg'}
                    alt={`Folk-art illustration for “${story.title}”`}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-cream/90 px-3 py-1 text-xs font-medium text-terracotta-deep backdrop-blur-sm">
                    {story.language}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-heading text-xl font-semibold leading-snug text-ink">
                    {story.title}
                  </h3>
                  <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-brown-dark">
                    <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
                    {story.village}, {story.district}
                  </p>
                  <p className="mt-3 line-clamp-3 leading-relaxed text-brown-dark">
                    {story.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-sm text-temple-stone">{story.speaker}</span>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-terracotta-deep">
                      Read Story
                      <ArrowRight
                        size={16}
                        strokeWidth={1.5}
                        aria-hidden="true"
                        className="transition-transform duration-200 group-hover:translate-x-0.5"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
