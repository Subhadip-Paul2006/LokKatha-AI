import { createClient } from '@supabase/supabase-js'
import type { ProcessedEntry } from './validators'

export class SupabaseImporter {
  private supabase: any

  constructor() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials missing in environment variables.')
    }

    this.supabase = createClient(supabaseUrl, supabaseKey)
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Mod 7: Better duplicate check. Look up existing stories by slug.
   * If they exist, we return their existing ID so we can update them safely.
   */
  async findExistingBySlug(entries: ProcessedEntry[]): Promise<Map<string, string>> {
    const slugs = entries.map(e => e.slug)
    if (slugs.length === 0) return new Map()

    // Using Supabase jsonb arrow operator to search metadata->>slug
    // Wait, since we can't reliably query jsonb with generic eq over multiple slugs easily in JS SDK without raw SQL,
    // we might need to just fetch all slugs or use an 'in' filter if Supabase supports it on jsonb.
    // For safety, since it's a script, we can select id, metadata from stories where metadata->>slug in (...)
    // If that fails, we can just fetch all and filter in memory, but that's bad.
    // Let's use raw postgres syntax if possible, but JS client `.in('metadata->>slug', slugs)` often doesn't work.
    // Actually, `.contains('metadata', { slug: ... })` works for one, but not multiple.
    // Let's just fetch id, metadata and filter in memory. There are only ~90 records in the hackathon.
    
    const { data, error } = await this.supabase
      .from('stories')
      .select('id, metadata')

    if (error) {
      throw new Error(`Failed to fetch existing records: ${error.message}`)
    }

    const map = new Map<string, string>()
    if (data) {
      for (const row of data) {
        if (row.metadata?.slug) {
          map.set(row.metadata.slug, row.id)
        }
      }
    }
    return map
  }

  private generateSearchDocument(entry: ProcessedEntry): string {
    const parts = [
      entry.title,
      entry.category,
      entry.summary_en,
      entry.summary_bn,
      entry.characters?.join(', ') || '',
      entry.themes?.join(', ') || '',
      entry.keywords?.join(', ') || '',
      entry.search_terms?.join(', ') || '',
      entry.cultural_importance || '',
      entry.moral || '',
      entry.content
    ]
    return parts.filter(p => p.trim().length > 0).join('\n\n')
  }

  mapToDbRecord(entry: ProcessedEntry, existingId?: string) {
    const kwords = [...(entry.keywords || []), ...(entry.search_terms || [])]
    const tags = [...(entry.themes || []), entry.category, entry.festival_association].filter(Boolean)

    const searchDoc = this.generateSearchDocument(entry)

    return {
      id: existingId || entry.id, // Use existing ID if it's an update
      title: entry.title,
      speaker_name: `Book Extract: ${entry.citations?.book || 'Unknown'}`,
      district: 'Unknown',
      language: entry.citations?.language || 'bn',
      transcript: entry.content,
      summary: entry.summary_en || entry.summary_bn,
      translation_en: entry.summary_en,
      translation_bn: entry.summary_bn,
      translation_hi: entry.summary_hi,
      keywords: kwords,
      cultural_tags: tags,
      historical_importance: entry.cultural_importance,
      metadata: {
        slug: entry.slug,
        checksum: entry.checksum,
        search_document: searchDoc,
        import_version: '1.0.0',
        imported_at: new Date().toISOString(),
        book: {
          title: entry.citations?.book || 'Unknown',
          author: 'Dakshinaranjan Mitra Majumdar',
          year: 1907,
          language: entry.citations?.language || 'bn'
        },
        pipeline: {
          extracted: true,
          enriched: true,
          imported: true,
          embedded: false
        },
        culture: {
          confidence: entry.confidence,
          festival: entry.festival_association,
          moral: entry.moral,
          difficulty: entry.difficulty,
          age_group: entry.age_group,
          reading_time: entry.reading_time,
        },
        entities: entry.entities,
        questions: entry.sample_questions,
        themes: entry.themes,
        citations: entry.citations
      }
    }
  }

  async upsertBatch(records: any[], retries = 3): Promise<void> {
    if (records.length === 0) return

    let attempt = 0
    while (attempt < retries) {
      try {
        const { error } = await this.supabase
          .from('stories')
          .upsert(records, { onConflict: 'id' })

        if (error) {
          throw new Error(error.message)
        }
        return
      } catch (err: any) {
        attempt++
        if (attempt >= retries) {
          throw new Error(`Upsert failed after ${retries} attempts: ${err.message}`)
        }
        await this.sleep(3000 * attempt)
      }
    }
  }

  async verifyCount(): Promise<number> {
    const { count, error } = await this.supabase
      .from('stories')
      .select('*', { count: 'exact', head: true })
    
    if (error) throw new Error(error.message)
    return count || 0
  }
}
