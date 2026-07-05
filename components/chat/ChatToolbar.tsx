'use client'

import { Trash2, Copy, Share2, Volume2, Languages } from 'lucide-react'

interface ChatToolbarProps {
  onClear: () => void
  onCopyLast: () => void
}

export function ChatToolbar({ onClear, onCopyLast }: ChatToolbarProps) {
  return (
    <div className="flex items-center gap-2 border-b border-brown-dark/15 pb-4 mb-4 text-brown-dark/70">
      <button 
        onClick={onClear}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-brown-dark/5 hover:text-terracotta-deep"
        title="Clear Conversation"
      >
        <Trash2 size={14} />
        <span className="hidden sm:inline">Clear</span>
      </button>

      <button 
        onClick={onCopyLast}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-brown-dark/5 hover:text-terracotta-deep"
        title="Copy Last Response"
      >
        <Copy size={14} />
        <span className="hidden sm:inline">Copy</span>
      </button>

      <div className="h-4 w-px bg-brown-dark/15 mx-1" />

      <button 
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-brown-dark/5 hover:text-terracotta-deep"
        title="Share"
      >
        <Share2 size={14} />
        <span className="hidden sm:inline">Share</span>
      </button>

      <button 
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-brown-dark/5 hover:text-terracotta-deep"
        title="Listen to Narration"
      >
        <Volume2 size={14} />
        <span className="hidden sm:inline">Listen</span>
      </button>

      <button 
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-brown-dark/5 hover:text-terracotta-deep ml-auto"
        title="Change Language"
      >
        <Languages size={14} />
        <span className="hidden sm:inline">English</span>
      </button>
    </div>
  )
}
