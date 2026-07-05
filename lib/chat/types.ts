export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export interface ChatSource {
  title: string
  book: string
  similarity: number
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

export interface StructuredChatOutput {
  answer: string
  sources: ChatSource[]
  relatedStories: RelatedStory[]
  suggestedQuestions: string[]
  confidence: number
  metrics?: ChatMetrics
}

export type SSEEvent = 'start' | 'token' | 'source' | 'complete' | 'error'
