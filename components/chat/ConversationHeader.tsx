'use client'

interface ConversationHeaderProps {
  onSelectExample: (text: string) => void
}

const EXAMPLES = [
  'Who is Lalkamal?',
  'Tell me a fairy tale',
  'Explain Baul songs',
  'Behula story',
  'Gopal Bhar'
]

export function ConversationHeader({ onSelectExample }: ConversationHeaderProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 md:py-20 animate-in fade-in duration-700">
      
      <div className="flex w-full items-center justify-center opacity-40 mb-6">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent to-brown-dark/80" />
        <span className="mx-4 font-accent text-2xl text-brown-dark">🪔</span>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent to-brown-dark/80" />
      </div>

      <h2 className="font-heading text-3xl md:text-4xl font-semibold text-ink mb-3 text-center text-balance">
        What story do you seek today?
      </h2>
      <p className="text-brown-dark/80 max-w-lg text-center leading-relaxed">
        Welcome to LokKatha AI. The archive answers gently — like a village librarian who has read every manuscript on the shelf.
      </p>

      <div className="flex w-full items-center justify-center opacity-40 mt-8 mb-8">
        <div className="h-px w-32 bg-brown-dark/50" />
        <span className="mx-4 text-sm text-brown-dark uppercase tracking-widest font-medium">Try Asking</span>
        <div className="h-px w-32 bg-brown-dark/50" />
      </div>

      <div className="flex flex-wrap justify-center gap-3 max-w-2xl">
        {EXAMPLES.map(ex => (
          <button
            key={ex}
            onClick={() => onSelectExample(ex)}
            className="rounded-full border border-brown-dark/20 bg-paper-old/50 px-5 py-2 text-sm text-terracotta-deep shadow-sm transition-all hover:border-terracotta/40 hover:bg-terracotta/5 hover:shadow-paper"
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}
