'use client'

import { Trash2, Copy, Share2, Volume2, VolumeX, Languages, Printer, Download } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ChatToolbarProps {
  onClear: () => void
  onCopyLast: () => void
  lastMessageContent: string
}

export function ChatToolbar({ onClear, onCopyLast, lastMessageContent }: ChatToolbarProps) {
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [speechSynthesis, setSpeechSynthesis] = useState<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      setSpeechSynthesis(window.speechSynthesis)
    }
  }, [])

  const toggleSpeech = () => {
    if (!speechSynthesis) return

    if (isSpeaking) {
      speechSynthesis.cancel()
      setIsSpeaking(false)
    } else if (lastMessageContent) {
      const utterance = new SpeechSynthesisUtterance(lastMessageContent.replace(/[*#]/g, ''))
      // Try to find a good voice
      const voices = speechSynthesis.getVoices()
      const indianVoice = voices.find(v => v.lang.includes('IN'))
      if (indianVoice) utterance.voice = indianVoice
      
      utterance.onend = () => setIsSpeaking(false)
      speechSynthesis.speak(utterance)
      setIsSpeaking(true)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="flex flex-wrap items-center gap-2 border-b border-brown-dark/15 pb-4 mb-4 text-brown-dark/70">
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

      <div className="h-4 w-px bg-brown-dark/15 mx-1 hidden sm:block" />

      <button 
        onClick={handlePrint}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-brown-dark/5 hover:text-terracotta-deep"
        title="Save as PDF / Print Story"
      >
        <Printer size={14} />
        <span className="hidden sm:inline">Save</span>
      </button>

      <button 
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-brown-dark/5 hover:text-terracotta-deep"
        title="Share"
      >
        <Share2 size={14} />
        <span className="hidden md:inline">Share</span>
      </button>

      <button 
        onClick={toggleSpeech}
        className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors hover:bg-terracotta/10 hover:text-terracotta-deep text-terracotta-deep bg-terracotta/5 ml-auto"
        title={isSpeaking ? "Stop Narration" : "Story Narration"}
      >
        {isSpeaking ? <VolumeX size={14} /> : <Volume2 size={14} />}
        <span className="hidden sm:inline font-semibold">{isSpeaking ? "Stop" : "Story Narration"}</span>
      </button>
    </div>
  )
}
