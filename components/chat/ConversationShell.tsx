'use client'

import { useEffect, useState, useSyncExternalStore } from 'react'
import { chatSession } from '@/lib/chat/session'
import { ChatMessage, ChatSource } from '@/lib/chat/types'
import { ConversationHeader } from './ConversationHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'
import { ChatToolbar } from './ChatToolbar'
import { StoryPreviewDrawer } from './StoryPreviewDrawer'

export function ConversationShell() {
  const messages = useSyncExternalStore(
    (listener) => chatSession.subscribe(listener),
    () => chatSession.getMessages()
  )
  
  const isJudgeMode = useSyncExternalStore(
    (listener) => chatSession.subscribe(listener),
    () => chatSession.isJudgeMode()
  )

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        e.preventDefault()
        chatSession.toggleJudgeMode()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])
  
  const [isStreaming, setIsStreaming] = useState(false)
  const [abortController, setAbortController] = useState<AbortController | null>(null)
  const [previewSource, setPreviewSource] = useState<ChatSource | null>(null)

  const handleSend = async (text: string) => {
    if (!text.trim()) return

    const userMsg: ChatMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString(),
      status: 'complete'
    }
    
    chatSession.addMessage(userMsg)
    
    const assistantId = crypto.randomUUID()
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date().toISOString(),
      status: 'thinking'
    }
    
    chatSession.addMessage(assistantMsg)
    setIsStreaming(true)

    const controller = new AbortController()
    setAbortController(controller)

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messages: chatSession.getMessages().slice(0, -1).map(m => ({ role: m.role, content: m.content })) 
        }),
        signal: controller.signal
      })

      if (!res.ok || !res.body) throw new Error('Failed to connect to LokKatha AI')

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let done = false

      while (!done) {
        const { value, done: doneReading } = await reader.read()
        done = doneReading
        if (value) {
          const chunk = decoder.decode(value, { stream: true })
          const events = chunk.split('\n\n').filter(Boolean)
          
          for (const ev of events) {
            const lines = ev.split('\n')
            const eventTypeLine = lines.find(l => l.startsWith('event:'))
            const dataLine = lines.find(l => l.startsWith('data:'))

            if (eventTypeLine && dataLine) {
              const eventType = eventTypeLine.replace('event:', '').trim()
              const dataStr = dataLine.replace('data:', '').trim()
              
              if (!dataStr) continue
              let data: any
              try {
                data = JSON.parse(dataStr)
              } catch { continue }

              if (eventType === 'start') {
                chatSession.updateMessage(assistantId, { status: 'streaming' })
              } else if (eventType === 'token') {
                chatSession.appendToContent(assistantId, data.text || '')
              } else if (eventType === 'source') {
                chatSession.updateMessage(assistantId, {
                  sources: data.sources,
                  relatedStories: data.relatedStories,
                  suggestions: data.suggestedQuestions,
                  confidence: data.confidence
                })
              } else if (eventType === 'complete') {
                chatSession.updateMessage(assistantId, { status: 'complete', metrics: data.metrics })
              } else if (eventType === 'error') {
                chatSession.updateMessage(assistantId, { 
                  status: 'error', 
                  content: data.message || 'An error occurred while generating the response.' 
                })
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        const offlineSources = [
          {
            title: "LokKatha Offline Archive",
            book: "Curated Selection",
            similarity: 1.0,
            pages: "N/A",
            characters: "Various"
          }
        ]
        
        const fallbackText = "🪔 *The connection to the LokKatha Archive was lost.* \n\nI couldn't reach the servers to generate a custom response, but you are now exploring the offline local archive mode. Please check your internet connection."
        
        chatSession.updateMessage(assistantId, { 
          status: 'complete', 
          content: fallbackText,
          sources: offlineSources,
          relatedStories: [],
          suggestions: ["Retry question", "Explore Regions"]
        })
      }
    } finally {
      setIsStreaming(false)
      setAbortController(null)
    }
  }

  const handleStop = () => {
    abortController?.abort()
    setIsStreaming(false)
    const messages = chatSession.getMessages()
    const last = messages[messages.length - 1]
    if (last && last.status !== 'complete') {
      chatSession.updateMessage(last.id, { status: 'complete' })
    }
  }

  const handleClear = () => {
    if (confirm('Clear the conversation?')) {
      chatSession.clear()
    }
  }

  const handleCopyLast = () => {
    const msgs = chatSession.getMessages()
    const lastAsst = [...msgs].reverse().find(m => m.role === 'assistant' && m.content)
    if (lastAsst) {
      navigator.clipboard.writeText(lastAsst.content)
    }
  }

  return (
    <div className="flex h-[80vh] min-h-[600px] w-full flex-col overflow-hidden rounded-3xl border-2 border-brown-dark/20 bg-[#F4F1EA] shadow-paper relative">
      <StoryPreviewDrawer source={previewSource} onClose={() => setPreviewSource(null)} />
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-terracotta/30 rounded-tl-3xl opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-terracotta/30 rounded-tr-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-terracotta/30 rounded-bl-3xl opacity-50 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-terracotta/30 rounded-br-3xl opacity-50 pointer-events-none" />
      
      {messages.length === 0 ? (
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <ConversationHeader onSelectExample={handleSend} />
        </div>
      ) : (
        <>
          <div className="px-4 pt-4 md:px-8">
            <ChatToolbar 
              onClear={handleClear} 
              onCopyLast={handleCopyLast} 
              lastMessageContent={
                [...messages].reverse().find(m => m.role === 'assistant' && m.status === 'complete')?.content || ''
              }
            />
          </div>
          <MessageList 
            messages={messages} 
            onSelectSuggestion={handleSend} 
            onPreviewSource={setPreviewSource}
            isJudgeMode={isJudgeMode}
          />
        </>
      )}

      <div className="bg-gradient-to-t from-[#F4F1EA] via-[#F4F1EA] to-transparent pt-4">
        <ChatInput 
          onSend={handleSend} 
          onStop={handleStop}
          isStreaming={isStreaming} 
        />
      </div>
    </div>
  )
}
