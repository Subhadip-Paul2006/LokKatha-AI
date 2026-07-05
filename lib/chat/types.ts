export interface ChatSource {
  title: string
  book: string
  similarity: number
  pages?: string
  characters?: string
  region?: string
  category?: string
  language?: string
  era?: string
  tradition?: string
}

export interface RelatedStory {
  title: string
  similarity: number
}

export interface ChatMetrics {
  embeddingMs: number
  retrievalMs: number
  contextBuildMs: number
  gemmaMs: number
  totalMs: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp: string
  sources?: ChatSource[]
  relatedStories?: RelatedStory[]
  suggestions?: string[]
  confidence?: number
  status: 'streaming' | 'complete' | 'error' | 'thinking'
  metrics?: ChatMetrics
}

export interface StructuredChatOutput {
  answer: string
  sources: ChatSource[]
  relatedStories: RelatedStory[]
  suggestedQuestions: string[]
  confidence: number
  metrics?: ChatMetrics
}

export type SSEEvent = 'start' | 'thinking' | 'token' | 'sources' | 'suggestions' | 'complete' | 'error'
