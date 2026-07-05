/**
 * An in-memory cache for query embeddings to prevent unnecessary API calls
 * during the same session or duplicated rapid-fire queries.
 */

interface CacheEntry {
  embedding: number[]
  timestamp: number
}

const cache = new Map<string, CacheEntry>()
const TTL = 1000 * 60 * 60 // 1 hour

export function getCachedEmbedding(query: string): number[] | null {
  const entry = cache.get(query.toLowerCase().trim())
  if (!entry) return null

  if (Date.now() - entry.timestamp > TTL) {
    cache.delete(query.toLowerCase().trim())
    return null
  }
  return entry.embedding
}

export function setCachedEmbedding(query: string, embedding: number[]): void {
  cache.set(query.toLowerCase().trim(), {
    embedding,
    timestamp: Date.now()
  })
}
