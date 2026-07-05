'use client'

interface SuggestionChipsProps {
  suggestions: string[]
  onSelect: (suggestion: string) => void
}

export function SuggestionChips({ suggestions, onSelect }: SuggestionChipsProps) {
  if (!suggestions || suggestions.length === 0) return null

  return (
    <div className="mt-6 flex flex-wrap items-center gap-2">
      {suggestions.map((suggestion, idx) => (
        <button
          key={idx}
          onClick={() => onSelect(suggestion)}
          className="rounded-full border border-terracotta/30 bg-cream/50 px-4 py-2 text-sm text-terracotta-deep transition-all hover:bg-terracotta/10 hover:border-terracotta/60"
        >
          {suggestion}
        </button>
      ))}
    </div>
  )
}
