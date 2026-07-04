'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { ArrowRight, Feather, ChevronLeft, ChevronRight } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

const HERO_SLIDES = [
  {
    src: '/images/hero-archive.png',
    alt: 'Folk-art illustration of a Bengal terracotta temple, palm-leaf manuscripts, and a courtyard library',
    title: 'Terracotta Courtyard & Palm-Leaf Manuscripts',
    tag: 'Archive Library',
  },
  {
    src: '/images/story-weaver.png',
    alt: 'Folk-art illustration of a traditional Bengal Jamdani handloom weaver preserving textile heritage',
    title: 'Handloom Jamdani Weaving & Craft Heritage',
    tag: 'Artisanal Knowledge',
  },
  {
    src: '/images/story-potter.png',
    alt: 'Folk-art illustration of a Bishnupur terracotta potter creating sacred earthen vessels',
    title: 'Bishnupur Terracotta Pottery & Sculptural Art',
    tag: 'Sacred Crafts',
  },
  {
    src: '/images/story-boatman.png',
    alt: 'Folk-art illustration of a Padma river boatman singing traditional folk songs',
    title: 'Padma River Boatman Folk Songs & Oral Ballads',
    tag: 'Folk Music',
  },
]

export function Hero() {
  const { t } = useI18n()
  const FULL = t.hero.title
  const [typed, setTyped] = useState('')

  // Slideshow state
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Typewriter effect
  useEffect(() => {
    const reduce =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduce) {
      setTyped(FULL)
      return
    }

    let isSubscribed = true
    let timeoutId: NodeJS.Timeout
    let charIndex = 0
    let isDeleting = false

    const animateTypewriter = () => {
      if (!isSubscribed) return

      if (!isDeleting) {
        // Typing forward
        charIndex++
        setTyped(FULL.slice(0, charIndex))

        if (charIndex >= FULL.length) {
          // Pause for 2.5s when full text is typed out
          isDeleting = true
          timeoutId = setTimeout(animateTypewriter, 2500)
          return
        }
        timeoutId = setTimeout(animateTypewriter, 50)
      } else {
        // Untyping backward
        charIndex--
        setTyped(FULL.slice(0, charIndex))

        if (charIndex <= 0) {
          // Pause briefly (500ms) before starting next loop
          isDeleting = false
          timeoutId = setTimeout(animateTypewriter, 500)
          return
        }
        timeoutId = setTimeout(animateTypewriter, 30)
      }
    }

    animateTypewriter()

    return () => {
      isSubscribed = false
      clearTimeout(timeoutId)
    }
  }, [FULL])

  // Automatic slideshow loop
  useEffect(() => {
    if (isPaused) return
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isPaused])

  const nextSlide = () => {
    setActiveSlide((prev) => (prev + 1) % HERO_SLIDES.length)
  }

  const prevSlide = () => {
    setActiveSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length)
  }

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

          <h1 className="mt-5 text-balance font-heading text-[32px] font-semibold leading-tight text-ink md:text-5xl lg:text-6xl min-h-[2.4em] md:min-h-[2.2em]">
            <span>{typed}</span>
            <span
              aria-hidden="true"
              className="inline-block w-[0.06em] translate-y-1 lk-pulse bg-terracotta ml-0.5"
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

        {/* Hero Interactive Folk Art Slideshow */}
        <div className="lk-rise order-1 md:order-2">
          <div
            className="group relative overflow-hidden rounded-[28px] border-2 border-brown-dark/20 bg-palmleaf shadow-paper-lg aspect-square"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Slides Image Stack */}
            {HERO_SLIDES.map((slide, index) => (
              <div
                key={slide.src}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  index === activeSlide
                    ? 'opacity-100 scale-100 z-10'
                    : 'opacity-0 scale-105 z-0 pointer-events-none'
                }`}
              >
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  width={720}
                  height={720}
                  priority={index === 0}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}

            {/* Top Tag Overlay */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-2 rounded-full border border-paper-old/30 bg-[#2B2118]/75 backdrop-blur-md px-3.5 py-1 text-xs font-serif tracking-wide text-[#FFF8EE] shadow-md">
              <span className="w-2 h-2 rounded-full bg-terracotta animate-pulse" />
              <span>{HERO_SLIDES[activeSlide].tag}</span>
            </div>

            {/* Bottom Caption Overlay */}
            <div className="absolute bottom-12 left-4 right-4 z-20 rounded-xl border border-paper-old/20 bg-[#2B2118]/80 backdrop-blur-md p-3 text-xs font-serif text-[#FFF8EE] shadow-md transition-opacity duration-300">
              <p className="font-semibold text-sm leading-snug">{HERO_SLIDES[activeSlide].title}</p>
            </div>

            {/* Left / Right Navigation Controls */}
            <button
              onClick={prevSlide}
              aria-label="Previous Slide"
              className="absolute left-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-[#2B2118]/60 hover:bg-[#2B2118]/90 text-[#FFF8EE] border border-paper-old/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md focus:outline-none"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextSlide}
              aria-label="Next Slide"
              className="absolute right-3 top-1/2 -translate-y-1/2 z-30 p-2 rounded-full bg-[#2B2118]/60 hover:bg-[#2B2118]/90 text-[#FFF8EE] border border-paper-old/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-md focus:outline-none"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dot Pagination Indicators */}
            <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-center items-center gap-2">
              {HERO_SLIDES.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === activeSlide
                      ? 'w-6 bg-terracotta'
                      : 'w-2 bg-paper-old/60 hover:bg-paper-old'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
