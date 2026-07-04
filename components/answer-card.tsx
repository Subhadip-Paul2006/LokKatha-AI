'use client'

import { useState } from 'react'
import { Bookmark, MapPin, Share2 } from 'lucide-react'
import type { AskAnswer } from '@/app/api/ask/route'

export function AnswerCard({
  answer,
  onAsk,
}: {
  answer: AskAnswer
  onAsk?: (question: string) => void
}) {
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <article className="paper-grain lk-rise-sm relative overflow-hidden rounded-[28px] border-2 border-brown-dark/25 bg-paper-old p-6 shadow-paper-lg md:p-8">
      {/* Manuscript top rule */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-muted-gold/60 to-transparent"
      />
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="font-heading text-2xl font-semibold text-ink md:text-3xl">
            {answer.title}
          </h3>
          {answer.location && (
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1 text-sm text-terracotta-deep">
              <MapPin size={16} strokeWidth={1.5} aria-hidden="true" />
              {answer.location}
            </span>
          )}
        </div>
        <div className="flex shrink-0 gap-1">
          <button
            type="button"
            onClick={() => setBookmarked((v) => !v)}
            className="grid size-11 place-items-center rounded-lg text-brown-dark transition-colors hover:text-terracotta-deep"
            aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this answer'}
            aria-pressed={bookmarked}
          >
            <Bookmark
              size={20}
              strokeWidth={1.5}
              fill={bookmarked ? 'currentColor' : 'none'}
              className={bookmarked ? 'text-terracotta' : ''}
            />
          </button>
          <button
            type="button"
            className="grid size-11 place-items-center rounded-lg text-brown-dark transition-colors hover:text-terracotta-deep"
            aria-label="Share this answer"
          >
            <Share2 size={20} strokeWidth={1.5} aria-hidden="true" />
          </button>
        </div>
      </div>

      {answer.excerpt && (
        <blockquote className="mt-6 border-l-2 border-terracotta/60 pl-4 font-quote text-xl italic leading-relaxed text-brown-dark">
          {`\u201C${answer.excerpt}\u201D`}
        </blockquote>
      )}

      <div className="mt-5 space-y-4 leading-relaxed text-ink">
        {answer.answer
          .split(/\n{2,}/)
          .filter(Boolean)
          .map((para, i) => (
            <p key={i} className="text-pretty">
              {para}
            </p>
          ))}
      </div>

      {answer.keywords.length > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {answer.keywords.map((k) => (
            <span
              key={k}
              className="rounded-full border border-brown-dark/25 bg-cream px-3 py-1 text-xs font-medium text-brown-dark"
            >
              {k}
            </span>
          ))}
        </div>
      )}

      {answer.relatedQuestions.length > 0 && (
        <div className="mt-6 border-t border-brown-dark/15 pt-5">
          <p className="font-accent text-sm text-terracotta-deep">Follow the thread</p>
          <ul className="mt-2 flex flex-col gap-1.5">
            {answer.relatedQuestions.map((q) => (
              <li key={q}>
                <button
                  type="button"
                  onClick={() => onAsk?.(q)}
                  className="text-left text-brown-dark underline-offset-4 transition-colors hover:text-terracotta-deep hover:underline"
                >
                  {q}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </article>
  )
}
