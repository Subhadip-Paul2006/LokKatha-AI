import { RAGConfig } from '../types'

export const RAG_CONFIG: RAGConfig = {
  similarityThreshold: 0.72,
  defaultTopK: 5,
  maxContextTokens: 6000 // A safe limit leaving room for Gemma's output and system prompt
}
