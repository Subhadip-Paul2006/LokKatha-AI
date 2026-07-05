import { createClient } from '@supabase/supabase-js'
import { RAGQuery, RetrievedStory } from '../types'
import { RAG_CONFIG } from '../config/rag'
import { EmbeddingGenerator } from '../../pipeline/embeddingGenerator'
import { getCachedEmbedding, setCachedEmbedding } from '../cache/queryCache'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

const generator = new EmbeddingGenerator()

export async function performHybridSearch(
  query: RAGQuery, 
  topK: number,
  threshold: number = RAG_CONFIG.similarityThreshold
): Promise<RetrievedStory[]> {
  
  // 1. Resolve Embedding (Cache or Generate)
  let vector = query.embedding
  if (!vector) {
    const cached = getCachedEmbedding(query.raw)
    if (cached) {
      vector = cached
    } else {
      vector = await generator.generate(query.normalized, 3)
      setCachedEmbedding(query.raw, vector)
    }
    query.embedding = vector
  }

  // 2. Perform Vector Search (match_stories)
  const { data: vectorResults, error: vectorError } = await supabase.rpc('match_stories', {
    query_embedding: JSON.stringify(vector),
    match_threshold: threshold,
    match_count: topK
  })

  if (vectorError) {
    throw new Error(`Vector search failed: ${vectorError.message}`)
  }

  // 3. Perform Keyword Search (Fallback / Hybrid Fusion)
  // We search the 'search_document' using ilike for highly specific matches that vectors might miss (e.g. rare names)
  const searchTerms = query.normalized.split(' ').filter(w => w.length > 3)
  
  let keywordResults: any[] = []
  if (searchTerms.length > 0) {
    const likeQuery = `%${searchTerms.join('%')}%`
    const { data: kwData, error: kwError } = await supabase
      .from('stories')
      .select('id, title, summary, transcript, metadata, search_document')
      .ilike('search_document', likeQuery)
      .limit(topK)
    
    if (!kwError && kwData) {
      keywordResults = kwData
    }
  }

  // 4. Fusion
  // Merge results, giving a slight synthetic similarity boost to keyword exact matches
  const map = new Map<string, RetrievedStory>()
  
  for (const item of (vectorResults || [])) {
    map.set(item.id, {
      ...item,
      content: item.content || item.transcript // map transcript to content if needed
    })
  }

  for (const item of keywordResults) {
    if (!map.has(item.id)) {
      map.set(item.id, {
        id: item.id,
        title: item.title,
        summary: item.summary,
        content: item.transcript,
        metadata: item.metadata,
        search_document: item.search_document,
        similarity: threshold + 0.05 // Synthetic score for pure keyword match
      })
    } else {
      // If it exists in both, boost its similarity slightly
      const existing = map.get(item.id)!
      existing.similarity += 0.02
    }
  }

  return Array.from(map.values())
}
