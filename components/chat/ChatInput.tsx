'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, StopCircle } from 'lucide-react'

interface ChatInputProps {
  onSend: (text: string) => void
  onStop?: () => void
  isStreaming: boolean
  placeholder?: string
}

export function ChatInput({ onSend, onStop, isStreaming, placeholder = "Ask about India's forgotten stories..." }: ChatInputProps) {
  const [text, setText] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`
    }
  }, [text])

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!text.trim() || isStreaming) return
    onSend(text.trim())
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="relative mx-auto max-w-4xl px-4 pb-6 pt-2 md:px-8">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 rounded-2xl border-2 border-brown-dark/25 bg-paper-old p-2 shadow-paper-lg focus-within:border-terracotta transition-colors"
      >
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="max-h-[200px] min-h-[44px] w-full resize-none bg-transparent px-3 py-3 text-ink placeholder:text-temple-stone focus:outline-none custom-scrollbar"
          rows={1}
          disabled={isStreaming}
        />
        
        {isStreaming ? (
          <button
            type="button"
            onClick={onStop}
            className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-brown-dark/10 text-brown-dark transition-colors hover:bg-brown-dark/20"
            title="Stop generating"
          >
            <StopCircle size={20} />
          </button>
        ) : (
          <button
            type="submit"
            disabled={!text.trim()}
            className="mb-1 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-clay-orange text-paper-old shadow-sm transition-transform duration-200 ease-out hover:scale-[1.05] disabled:cursor-not-allowed disabled:opacity-50"
            title="Send Message"
          >
            <Send size={18} className="ml-1" />
          </button>
        )}
      </form>
      
      <div className="mt-2 text-center text-xs text-brown-dark/60">
        LokKatha AI may make mistakes. Please verify cultural facts.
      </div>
    </div>
  )
}
