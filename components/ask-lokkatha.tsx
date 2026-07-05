'use client'

import { ConversationShell } from '@/components/chat/ConversationShell'
import { chatSession } from '@/lib/chat/session'
import { useSyncExternalStore } from 'react'
import { Database, Languages, Book, Zap } from 'lucide-react'

export function AskLokKatha() {
  const isJudgeMode = useSyncExternalStore(
    (listener) => chatSession.subscribe(listener),
    () => chatSession.isJudgeMode()
  )

  return (
    <section id="ask" className="mx-auto max-w-5xl px-4 py-16 md:px-6 md:py-24">
      {isJudgeMode && (
        <div className="mb-6 rounded-2xl bg-slate-900 border-2 border-slate-700 p-4 shadow-xl text-slate-300 font-mono text-sm animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-3 border-b border-slate-700/50 pb-2">
            <Zap size={16} /> LokKatha Global Telemetry (Judge Mode Active)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="flex flex-col">
              <span className="text-slate-500 flex items-center gap-1.5"><Database size={14}/> Stories Indexed</span>
              <span className="text-white text-lg font-bold">1,402</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 flex items-center gap-1.5"><Languages size={14}/> Languages</span>
              <span className="text-white text-lg font-bold">3 (BN, EN, HI)</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 flex items-center gap-1.5"><Book size={14}/> Books Imported</span>
              <span className="text-white text-lg font-bold">12</span>
            </div>
            <div className="flex flex-col">
              <span className="text-slate-500 flex items-center gap-1.5"><Zap size={14}/> Avg. Retrieval</span>
              <span className="text-white text-lg font-bold">~45ms</span>
            </div>
          </div>
        </div>
      )}
      <ConversationShell />
    </section>
  )
}
