'use client'

import { ChatSource } from '@/lib/chat/types'
import { Book, FileText, Users, Sparkles, BookOpen } from 'lucide-react'

interface SourceCardProps {
  source: ChatSource
  onPreview?: () => void
}

export function SourceCard({ source, onPreview }: SourceCardProps) {
  return (
    <button 
      onClick={onPreview}
      className="w-full text-left paper-grain lk-rise-sm relative overflow-hidden rounded-xl border border-brown-dark/20 bg-paper-old p-4 shadow-sm transition-all hover:border-terracotta/40 hover:shadow-paper group"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="font-heading text-lg font-semibold text-ink group-hover:text-terracotta-deep transition-colors flex items-center gap-2">
            <BookOpen size={18} className="text-terracotta/70" />
            {source.title}
          </h4>
          
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-brown-dark/90">
            <div className="flex items-center gap-1.5">
              <Book size={14} className="opacity-70" />
              <span>{source.book}</span>
            </div>
            
            {source.pages && (
              <div className="flex items-center gap-1.5">
                <FileText size={14} className="opacity-70" />
                <span>Pages {source.pages}</span>
              </div>
            )}
            
            {source.characters && (
              <div className="flex items-center gap-1.5">
                <Users size={14} className="opacity-70" />
                <span className="truncate max-w-[120px]">{source.characters}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex shrink-0 flex-col items-end gap-1">
          <span className="inline-flex items-center gap-1 rounded-full bg-cream px-2 py-1 text-[10px] font-medium text-terracotta-deep">
            <Sparkles size={10} />
            {(source.similarity * 100).toFixed(0)}% Match
          </span>
        </div>
      </div>
    </button>
  )
}
