'use client'

import { ChatMessage, ChatSource } from '@/lib/chat/types'
import { StreamingRenderer } from './StreamingRenderer'
import { SourceCard } from './SourceCard'
import { SuggestionChips } from './SuggestionChips'
import { TypingIndicator } from './TypingIndicator'

interface MessageProps {
  message: ChatMessage
  onSelectSuggestion: (suggestion: string) => void
  onPreviewSource: (source: ChatSource) => void
}

export function Message({ message, onSelectSuggestion, onPreviewSource }: MessageProps) {
  const isUser = message.role === 'user'

  if (isUser) {
    return (
      <div className="flex justify-end mb-8">
        <div className="max-w-[85%] rounded-2xl rounded-tr-sm bg-terracotta/10 px-5 py-4 text-ink">
          <p className="text-lg">{message.content}</p>
        </div>
      </div>
    )
  }

  // Assistant Message
  return (
    <div className="mb-10 w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
      
      {/* 1. Status Indicators */}
      {message.status === 'thinking' && (
        <TypingIndicator />
      )}

      {/* 2. Text Content */}
      {(message.content || message.status === 'streaming' || message.status === 'complete') && (
        <div className="mt-2 text-ink">
          <StreamingRenderer 
            content={message.content} 
            isStreaming={message.status === 'streaming'} 
          />
        </div>
      )}

      {/* 3. Sources */}
      {message.sources && message.sources.length > 0 && (
        <div className="mt-8 animate-in fade-in duration-700">
          <div className="mb-3 text-sm font-accent text-terracotta-deep">
            From the Archives
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {message.sources.map((src, idx) => (
              <SourceCard key={idx} source={src} onPreview={() => onPreviewSource(src)} />
            ))}
          </div>
        </div>
      )}

      {/* 4. Suggestions */}
      {message.suggestions && message.suggestions.length > 0 && (
        <div className="animate-in fade-in duration-700">
          <SuggestionChips 
            suggestions={message.suggestions} 
            onSelect={onSelectSuggestion} 
          />
        </div>
      )}

      {/* 5. Manuscript Separator */}
      {message.status === 'complete' && (
        <div className="mt-10 flex items-center justify-center opacity-30">
          <div className="h-px w-32 bg-brown-dark/50" />
          <span className="mx-4 text-brown-dark">✤</span>
          <div className="h-px w-32 bg-brown-dark/50" />
        </div>
      )}
    </div>
  )
}
