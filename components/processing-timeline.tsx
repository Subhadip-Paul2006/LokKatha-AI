'use client'

import { Check, FileText, Languages, Mic, Save, Sparkles } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useI18n } from '@/lib/i18n'

export const PROCESSING_STEPS = [
  { key: 'recording', icon: Mic },
  { key: 'transcribing', icon: FileText },
  { key: 'thinking', icon: Sparkles },
  { key: 'summary', icon: FileText },
  { key: 'translating', icon: Languages },
  { key: 'saving', icon: Save },
] as const

export type ProcessingStepKey = (typeof PROCESSING_STEPS)[number]['key']

type Props = {
  /** index of the currently active step (0-based); steps before are done */
  activeIndex: number
}

/**
 * Vertical progress-step timeline (never a spinner).
 * pending → temple-stone, active → muted-gold pulse, done → forest-green check.
 */
export function ProcessingTimeline({ activeIndex }: Props) {
  const { t } = useI18n()
  return (
    <ol className="mx-auto flex max-w-sm flex-col gap-1">
      {PROCESSING_STEPS.map((step, i) => {
        const status = i < activeIndex ? 'done' : i === activeIndex ? 'active' : 'pending'
        return (
          <Step
            key={step.key}
            icon={step.icon}
            label={t.steps[step.key]}
            status={status}
            last={i === PROCESSING_STEPS.length - 1}
          />
        )
      })}
    </ol>
  )
}

function Step({
  icon: Icon,
  label,
  status,
  last,
}: {
  icon: LucideIcon
  label: string
  status: 'pending' | 'active' | 'done'
  last: boolean
}) {
  const ring =
    status === 'done'
      ? 'border-forest-green text-forest-green bg-forest-green/10'
      : status === 'active'
        ? 'border-muted-gold text-terracotta-deep bg-muted-gold/15 lk-pulse'
        : 'border-temple-stone/40 text-temple-stone bg-transparent'

  return (
    <li className="flex items-start gap-3">
      <div className="flex flex-col items-center">
        <span className={`grid size-10 place-items-center rounded-full border-2 ${ring}`}>
          {status === 'done' ? (
            <Check size={20} strokeWidth={2} aria-hidden="true" />
          ) : (
            <Icon size={20} strokeWidth={1.5} aria-hidden="true" />
          )}
        </span>
        {!last && (
          <span
            aria-hidden="true"
            className={`my-1 w-0.5 flex-1 ${
              status === 'done' ? 'bg-forest-green/50' : 'bg-temple-stone/25'
            }`}
            style={{ minHeight: 20 }}
          />
        )}
      </div>
      <span
        className={`pt-2 text-base ${
          status === 'pending' ? 'text-temple-stone' : 'font-medium text-ink'
        }`}
      >
        {label}
        {status === 'active' && <span className="sr-only"> (in progress)</span>}
        {status === 'done' && <span className="sr-only"> (complete)</span>}
      </span>
    </li>
  )
}
