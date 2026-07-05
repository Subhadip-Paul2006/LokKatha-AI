import { createClient } from '@supabase/supabase-js'

export const MODEL_DIMENSIONS = 768
export const EMBEDDING_MODEL = 'embedding-001'
export const EMBEDDING_VERSION = '1.0'

export class VectorSearch {
  private supabase: any

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  /**
   * Search for stories semantically similar to the given query embedding.
   */
  async searchSimilarStories(queryEmbedding: number[], topK: number = 5, matchThreshold: number = 0.72) {
    if (queryEmbedding.length !== MODEL_DIMENSIONS) {
      throw new Error(`Query embedding must be exactly ${MODEL_DIMENSIONS} dimensions`)
    }

    const { data, error } = await this.supabase.rpc('match_stories', {
      query_embedding: JSON.stringify(queryEmbedding),
      match_threshold: matchThreshold,
      match_count: topK
    })

    if (error) {
      throw new Error(`Semantic search failed: ${error.message}`)
    }

    return data
  }

  /**
   * Helper to retrieve the embedding for a specific story ID directly from the DB.
   */
  async getStoryEmbedding(id: string): Promise<number[] | null> {
    const { data, error } = await this.supabase
      .from('stories')
      .select('embedding')
      .eq('id', id)
      .single()

    if (error || !data) return null
    
    let parsed
    try {
      parsed = typeof data.embedding === 'string' ? JSON.parse(data.embedding) : data.embedding
    } catch {
      return null
    }

    return parsed
  }
}
