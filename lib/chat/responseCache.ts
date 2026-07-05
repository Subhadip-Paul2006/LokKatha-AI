import { StructuredChatOutput } from './types'

/**
 * A highly aggressive top-level conversational cache.
 * If 100 users ask "Who is Lalkamal?", we hit memory cache and bypass Gemma and RAG entirely.
 */

interface CacheEntry {
  response: StructuredChatOutput
  timestamp: number
}

const chatCache = new Map<string, CacheEntry>()
const TTL = 1000 * 60 * 60 * 2 // 2 hours

export function getCachedChatResponse(query: string): StructuredChatOutput | null {
  const entry = chatCache.get(query.toLowerCase().trim())
  if (!entry) return null

  if (Date.now() - entry.timestamp > TTL) {
    chatCache.delete(query.toLowerCase().trim())
    return null
  }
  return entry.response
}

export function setCachedChatResponse(query: string, response: StructuredChatOutput): void {
  chatCache.set(query.toLowerCase().trim(), {
    response,
    timestamp: Date.now()
  })
}
