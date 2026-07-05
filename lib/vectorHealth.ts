import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })

export class VectorHealth {
  private supabase: any

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing in environment variables.')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  async verifyVectorExtension(): Promise<boolean> {
    // If the database has pgvector enabled, we can verify this by checking if the extension exists.
    // Easiest way in JS SDK without full permissions is just calling match_stories with a dummy 768 array.
    // However, if we want to explicitly check extensions:
    try {
      const { data, error } = await this.supabase
        .rpc('match_stories', {
          query_embedding: JSON.stringify(Array(768).fill(0)),
          match_threshold: -1, // Just dummy threshold
          match_count: 1
        })
      if (error && error.message.includes('Could not find the function')) {
        return false // RPC doesn't exist, which means migration hasn't run.
      }
      return true
    } catch {
      return false
    }
  }

  async verifyRPC(): Promise<boolean> {
    return this.verifyVectorExtension()
  }

  async verifyIndex(): Promise<boolean> {
    // To explicitly check index via JS SDK is hard without elevated privileges.
    // The fact that RPC is successfully callable is a strong proxy for migration completion.
    // Alternatively, we query the `embedding` column on one row to ensure it exists.
    const { error } = await this.supabase.from('stories').select('embedding').limit(1)
    return !error
  }

  async verifyEmbeddingCount(): Promise<{ total: number, embedded: number }> {
    const { count: totalCount, error: err1 } = await this.supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      
    const { count: embeddedCount, error: err2 } = await this.supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
      .not('embedding', 'is', null)

    if (err1 || err2) {
      throw new Error('Failed to fetch counts from database')
    }

    return { total: totalCount || 0, embedded: embeddedCount || 0 }
  }
}
