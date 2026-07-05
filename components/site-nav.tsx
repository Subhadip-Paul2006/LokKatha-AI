'use client'

import { useEffect, useState } from 'react'
import { Languages, Menu, X } from 'lucide-react'
import { Logo, GithubMark } from '@/components/marks'
import { useI18n } from '@/lib/i18n'

export function SiteNav() {
  const { t, lang, toggle } = useI18n()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  const links = [
    { label: 'Explore Stories', href: '#stories' },
    { label: 'Ask LokKatha', href: '#ask' },
    { label: 'Listen', href: '#listen' },
    { label: 'Explore Regions', href: '#regions' },
    { label: 'Festivals', href: '#festivals' },
  ]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled
          ? 'border-b border-brown-dark/15 bg-cream/80 backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 md:px-6">
        <a href="#top" className="rounded-lg" aria-label="LokKatha AI home">
          <Logo />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-brown-dark underline-offset-4 transition-colors hover:text-terracotta-deep hover:underline"
            >
              {l.label}
            </a>
          ))}
          <button
            type="button"
            onClick={toggle}
            className="flex min-h-11 items-center gap-1.5 rounded-lg border border-brown-dark/20 px-3 text-sm font-medium text-brown-dark transition-colors hover:border-terracotta hover:text-terracotta-deep"
            aria-label={t.switchAria}
          >
            <Languages size={20} strokeWidth={1.5} aria-hidden="true" />
            <span className="font-accent">{t.toggleLabel}</span>
          </button>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="grid size-11 place-items-center rounded-lg text-brown-dark transition-colors hover:text-terracotta-deep"
            aria-label="View source on GitHub"
          >
            <GithubMark size={20} />
          </a>
        </div>

        <button
          type="button"
          className="grid size-11 place-items-center rounded-lg text-brown-dark md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <X size={24} strokeWidth={1.5} /> : <Menu size={24} strokeWidth={1.5} />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-brown-dark/15 bg-cream/95 backdrop-blur-md md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col px-4 py-3">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="flex min-h-11 items-center text-base font-medium text-brown-dark"
              >
                {l.label}
              </a>
            ))}
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-2 text-base font-medium text-brown-dark"
            >
              <GithubMark size={20} /> {t.nav.github}
            </a>
            <button
              type="button"
              onClick={() => {
                toggle()
                setOpen(false)
              }}
              className="flex min-h-11 items-center gap-2 text-base font-medium text-brown-dark"
              aria-label={t.switchAria}
            >
              <Languages size={20} strokeWidth={1.5} aria-hidden="true" />
              <span className="font-accent">
                {lang === 'en' ? 'বাংলায় দেখুন' : 'View in English'}
              </span>
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
