'use client'

import { useEffect, useRef } from 'react'
import { ChatMessage, ChatSource } from '@/lib/chat/types'
import { Message } from './Message'

interface MessageListProps {
  messages: ChatMessage[]
  onSelectSuggestion: (suggestion: string) => void
  onPreviewSource: (source: ChatSource) => void
  isJudgeMode?: boolean
}

export function MessageList({ messages, onSelectSuggestion, onPreviewSource, isJudgeMode }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Smooth auto-scroll when new messages or tokens arrive
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 custom-scrollbar scroll-smooth">
      <div className="mx-auto max-w-4xl">
        {messages.map((msg) => (
          <Message 
            key={msg.id} 
            message={msg} 
            onSelectSuggestion={onSelectSuggestion} 
            onPreviewSource={onPreviewSource}
            isJudgeMode={isJudgeMode}
          />
        ))}
        <div ref={bottomRef} className="h-4" />
      </div>
    </div>
  )
}
