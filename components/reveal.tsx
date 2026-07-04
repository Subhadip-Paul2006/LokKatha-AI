'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'

type RevealProps = {
  children: ReactNode
  className?: string
  /** stagger delay in ms */
  delay?: number
  as?: 'div' | 'section' | 'li' | 'article'
}

/**
 * Fade-in on scroll entry (opacity only per §6 for sections).
 * Respects prefers-reduced-motion via the .lk-fade utility fallback.
 */
export function Reveal({ children, className = '', delay = 0, as = 'div' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [shown, setShown] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setShown(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const Tag = as as 'div'
  return (
    <Tag
      ref={ref as never}
      className={`${shown ? 'lk-fade' : 'opacity-0'} ${className}`}
      style={shown ? { animationDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  )
}
