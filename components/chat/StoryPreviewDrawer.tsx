'use client'

import { ChatSource } from '@/lib/chat/types'
import { X, BookOpen, Users, FileText } from 'lucide-react'
import { useEffect } from 'react'

interface StoryPreviewDrawerProps {
  source: ChatSource | null
  onClose: () => void
}

export function StoryPreviewDrawer({ source, onClose }: StoryPreviewDrawerProps) {
  useEffect(() => {
    if (source) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [source])

  if (!source) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-50 bg-brown-dark/40 backdrop-blur-sm transition-opacity animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-paper-old shadow-paper-lg sm:w-[400px] border-l-2 border-brown-dark/20 animate-in slide-in-from-right duration-300 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-brown-dark/15 px-6 py-4 sticky top-0 bg-paper-old/90 backdrop-blur-md z-10">
          <h3 className="font-heading text-xl font-semibold text-ink">Story Preview</h3>
          <button 
            onClick={onClose}
            className="rounded-full p-2 text-brown-dark transition-colors hover:bg-brown-dark/10 hover:text-terracotta-deep"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-8">
          <div className="text-center">
            <BookOpen size={48} className="mx-auto text-terracotta/40 mb-4" />
            <h2 className="font-heading text-3xl font-bold text-ink mb-2">{source.title}</h2>
            <p className="text-sm font-medium text-terracotta-deep">{source.book}</p>
          </div>

          <div className="space-y-4">
            {source.pages && (
              <div>
                <h4 className="flex items-center gap-2 font-accent text-sm text-brown-dark uppercase tracking-wider mb-1">
                  <FileText size={16} /> Pages
                </h4>
                <p className="text-ink leading-relaxed">{source.pages}</p>
              </div>
            )}

            <div className="mt-8 border-l-2 border-terracotta/30 ml-3 pl-6 space-y-8 relative">
              {/* Timeline Nodes */}
              
              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-terracotta ring-4 ring-paper-old" />
                <h4 className="flex items-center gap-2 font-accent text-sm text-brown-dark uppercase tracking-wider mb-1">
                  <Users size={16} /> Characters
                </h4>
                <p className="text-ink leading-relaxed text-sm">
                  {source.characters || "Main characters of the folklore"}
                </p>
              </div>

              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-clay-orange ring-4 ring-paper-old" />
                <h4 className="font-accent text-sm text-brown-dark uppercase tracking-wider mb-2">Events</h4>
                <p className="text-ink leading-relaxed text-sm italic border-l-2 border-terracotta/40 pl-4 bg-terracotta/5 p-3 rounded-r-lg">
                  This is a preview of the semantic context that was retrieved from the database to generate the AI response.
                </p>
              </div>
              
              <div className="relative">
                <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-brown-dark/50 ring-4 ring-paper-old" />
                <h4 className="font-accent text-sm text-brown-dark uppercase tracking-wider mb-1">Moral</h4>
                <p className="text-ink leading-relaxed text-sm">
                  Implicit teachings passed down through oral tradition.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-brown-dark/15 flex justify-center">
            <button className="rounded-xl bg-terracotta px-6 py-3 font-semibold text-paper-old shadow-sm transition-transform hover:scale-[1.02]">
              Read Full Story
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
