'use client'

import { ChatSource } from '@/lib/chat/types'
import { Book, FileText, Users, Sparkles, BookOpen, MapPin, Tag, Languages, History, Feather } from 'lucide-react'

interface SourceCardProps {
  source: ChatSource
  onPreview?: () => void
}

export function SourceCard({ source, onPreview }: SourceCardProps) {
  return (
    <button 
      onClick={onPreview}
      className="w-full text-left paper-grain lk-rise-sm relative overflow-hidden rounded-xl border border-brown-dark/20 bg-paper-old p-4 shadow-sm transition-all hover:border-terracotta/40 hover:shadow-paper group flex flex-col justify-between h-full"
    >
      <div>
        <div className="flex items-start justify-between gap-4">
          <h4 className="font-heading text-lg font-semibold text-ink group-hover:text-terracotta-deep transition-colors flex items-center gap-2 leading-tight">
            <BookOpen size={18} className="text-terracotta/70 shrink-0" />
            <span className="line-clamp-2">{source.title}</span>
          </h4>
          <span className="shrink-0 inline-flex items-center gap-1 rounded-full bg-cream px-2 py-1 text-[10px] font-medium text-terracotta-deep">
            <Sparkles size={10} />
            {(source.similarity * 100).toFixed(0)}%
          </span>
        </div>
        
        <div className="mt-3 flex flex-col gap-2 text-xs text-brown-dark/90">
          <div className="flex items-center gap-1.5 font-medium text-ink/80">
            <Book size={14} className="opacity-70 text-terracotta" />
            <span className="truncate">{source.book}</span>
          </div>
          
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 mt-1">
            {source.region && (
              <div className="flex items-center gap-1 bg-brown-dark/5 px-1.5 py-0.5 rounded text-[10px] text-terracotta-deep border border-terracotta/20">
                <MapPin size={10} />
                <span>{source.region}</span>
              </div>
            )}
            
            {source.category && (
              <div className="flex items-center gap-1">
                <Tag size={12} className="opacity-60" />
                <span>{source.category}</span>
              </div>
            )}
            
            {source.language && (
              <div className="flex items-center gap-1">
                <Languages size={12} className="opacity-60" />
                <span>{source.language}</span>
              </div>
            )}
            
            {source.era && (
              <div className="flex items-center gap-1">
                <History size={12} className="opacity-60" />
                <span>{source.era}</span>
              </div>
            )}
            
            {source.tradition && (
              <div className="flex items-center gap-1 text-terracotta-deep/80 font-medium">
                <Feather size={12} />
                <span>{source.tradition}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </button>
  )
}
