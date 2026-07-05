'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface StreamingRendererProps {
  content: string
  isStreaming: boolean
}

export function StreamingRenderer({ content, isStreaming }: StreamingRendererProps) {
  return (
    <div className={`prose prose-stone max-w-none prose-p:leading-relaxed prose-headings:font-heading prose-a:text-terracotta-deep transition-opacity duration-300 ${isStreaming ? 'opacity-90' : 'opacity-100'}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {content}
      </ReactMarkdown>
      {isStreaming && (
        <span className="inline-block ml-1 animate-pulse" title="The quill is writing...">
          🪶
        </span>
      )}
    </div>
  )
}
