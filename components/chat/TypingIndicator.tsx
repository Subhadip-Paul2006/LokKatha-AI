'use client'

import { useEffect, useState } from 'react'

const phrases = [
  '📜 Searching LokKatha Archive...',
  '🪔 Reading Manuscripts...',
  '✍️ Preparing Story...',
]

export function TypingIndicator() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => Math.min(i + 1, phrases.length - 1))
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex items-center gap-3 py-2 text-brown-dark opacity-80 transition-opacity animate-in fade-in duration-500">
      <div className="flex gap-1">
        <span className="animate-bounce" style={{ animationDelay: '0ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '150ms' }}>.</span>
        <span className="animate-bounce" style={{ animationDelay: '300ms' }}>.</span>
      </div>
      <span className="font-quote italic">{phrases[index]}</span>
    </div>
  )
}
