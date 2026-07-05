export interface RAGQuery {
  raw: string
  normalized: string
  category: QueryCategory
  embedding?: number[]
}

export type QueryCategory = 'CHARACTER' | 'RECOMMENDATION' | 'SUMMARY' | 'KNOWLEDGE' | 'UNKNOWN'

export interface RetrievedStory {
  id: string
  title: string
  summary: string
  content: string
  metadata: any
  search_document: string
  similarity: number
}

export interface ContextBlock {
  title: string
  book: string
  characters: string
  themes: string
  excerpt: string
  similarity: number
  confidence?: number
}

export interface RAGConfig {
  similarityThreshold: number
  defaultTopK: number
  maxContextTokens: number
}

export interface ValidationReport {
  query: string
  context_blocks: number
  duplicates_removed: number
  stories_filtered: number
  estimated_tokens: number
  prompt_valid: boolean
  injection_detected: boolean
}

export interface RAGReport {
  query: string
  topK: number
  retrieved: number
  averageSimilarity: number
  promptTokens: number
  latency: string
  timestamp: string
  gemmaMs?: number
}
