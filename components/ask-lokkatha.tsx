'use client'

import { useState } from 'react'
import { Leaf, Search } from 'lucide-react'
import { AnswerCard } from '@/components/answer-card'
import { Reveal } from '@/components/reveal'
import type { AskAnswer } from '@/app/api/ask/route'

const suggestions = [
  'Tell me about the terracotta temples of Bishnupur',
  'What are Baul songs and who sings them?',
  'A forgotten harvest ritual from rural Bengal',
  'The story behind Bankura\u2019s clay horses',
]

type Status = 'idle' | 'loading' | 'error'

export function AskLokKatha() {
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<Status>('idle')
  const [answer, setAnswer] = useState<AskAnswer | null>(null)
  const [errorMsg, setErrorMsg] = useState('')

  async function ask(question: string) {
    const q = question.trim()
    if (!q || status === 'loading') return
    setQuery(q)
    setStatus('loading')
    setErrorMsg('')
    setAnswer(null)
    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error ?? 'Something went wrong.')
      setAnswer(data as AskAnswer)
      setStatus('idle')
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Something went wrong.')
      setStatus('error')
    }
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    ask(query)
  }

  return (
    <section id="ask" className="mx-auto max-w-3xl px-4 py-16 md:px-6 md:py-24">
      <Reveal className="text-center">
        <p className="font-accent text-terracotta-deep">Ask LokKatha</p>
        <h2 className="mt-2 text-balance font-heading text-3xl font-semibold text-ink md:text-4xl">
          Ask about India&apos;s forgotten stories
        </h2>
        <p className="mx-auto mt-3 max-w-xl leading-relaxed text-brown-dark">
          The archive answers gently — like a village librarian who has read every manuscript
          on the shelf.
        </p>
      </Reveal>

      <Reveal className="mt-8">
        <form onSubmit={onSubmit}>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-brown-dark/25 bg-paper-old p-2 shadow-paper focus-within:border-terracotta">
            <span className="pl-2 text-terracotta" aria-hidden="true">
              <Search size={22} strokeWidth={1.5} />
            </span>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask about India's forgotten stories..."
              aria-label="Ask about India's forgotten stories"
              className="min-h-11 flex-1 bg-transparent px-1 text-ink placeholder:text-temple-stone focus:outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading' || !query.trim()}
              className="inline-flex min-h-11 items-center rounded-xl bg-clay-orange px-5 font-semibold text-paper-old shadow-paper transition-transform duration-200 ease-out hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-60"
            >
              Ask
            </button>
          </div>
        </form>

        {/* Suggested questions as archive-catalog text links */}
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="text-sm text-temple-stone">Try:</span>
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => ask(s)}
              className="text-left text-sm text-terracotta-deep underline-offset-4 transition-colors hover:underline"
            >
              {s}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10">
        {status === 'loading' && (
          <div className="flex flex-col items-center py-12 text-center" role="status">
            <Leaf
              size={40}
              strokeWidth={1.5}
              className="lk-leaf-spin text-terracotta"
              aria-hidden="true"
            />
            <p className="mt-4 font-quote text-lg italic text-brown-dark">
              Searching through India&apos;s memories…
            </p>
          </div>
        )}

        {status === 'error' && (
          <div className="paper-grain rounded-[20px] border-2 border-accent-red/30 bg-paper-old p-6 text-center shadow-paper">
            <p className="font-heading text-xl text-accent-red">
              The story couldn&apos;t be found
            </p>
            <p className="mt-1 text-brown-dark">{errorMsg} Let&apos;s preserve another one.</p>
            <button
              type="button"
              onClick={() => ask(query)}
              className="mt-4 inline-flex min-h-11 items-center rounded-xl border-2 border-terracotta px-6 font-semibold text-terracotta-deep transition-colors hover:bg-terracotta/10"
            >
              Try again
            </button>
          </div>
        )}

        {status === 'idle' && answer && <AnswerCard answer={answer} onAsk={ask} />}
      </div>
    </section>
  )
}
