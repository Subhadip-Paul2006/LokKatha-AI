import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { EmbeddingGenerator } from '../lib/pipeline/embeddingGenerator'
import { validateEmbedding } from '../lib/pipeline/embeddingValidator'
import { createSemanticDocument } from '../lib/pipeline/semanticDocument'
import { EMBEDDING_MODEL, MODEL_DIMENSIONS, EMBEDDING_VERSION } from '../lib/vectorSearch'

const LOGS_DIR = join(process.cwd(), 'knowledge', 'logs')
const REPORT_PATH = join(process.cwd(), 'knowledge', 'embedding-report.json')

if (!existsSync(LOGS_DIR)) {
  mkdirSync(LOGS_DIR, { recursive: true })
}
const today = new Date().toISOString().split('T')[0]
const LOG_FILE = join(LOGS_DIR, `${today}-embedding.log`)

function log(msg: string) {
  const timestamp = new Date().toISOString()
  const line = `[${timestamp}] ${msg}`
  console.log(line)
  writeFileSync(LOG_FILE, line + '\n', { flag: 'a' })
}

interface EmbeddingReport {
  total: number
  embedded: number
  skipped: number
  failed: number
  processing_time: string
  average_time_per_story: string
  average_embedding_length: number
  model: string
  completed_at: string
}

async function run() {
  log('🚀 Starting Semantic Knowledge Indexing...')
  const startTime = Date.now()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const generator = new EmbeddingGenerator()

  // Mod 4: We fetch ALL stories, and use checksum caching logic locally.
  log('Fetching all stories to check embedding status...')
  const { data: stories, error: fetchError } = await supabase
    .from('stories')
    .select('id, title, summary, transcript, keywords, historical_importance, metadata, embedding_status')

  if (fetchError || !stories) {
    log(`❌ Failed to fetch stories from Supabase: ${fetchError?.message}`)
    process.exit(1)
  }

  const totalStories = stories.length
  if (totalStories === 0) {
    log('✅ No stories found in database. Exiting.')
    process.exit(0)
  }

  const BATCH_SIZE = 10
  let successCount = 0
  let failedCount = 0
  let skippedCount = 0
  let embeddingTimes: number[] = []

  for (let i = 0; i < totalStories; i += BATCH_SIZE) {
    const batch = stories.slice(i, i + BATCH_SIZE)
    log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} items)...`)

    for (const story of batch) {
      log(`  ➡️ Checking story ID: ${story.id}`)
      
      const meta = story.metadata || {}
      const currentChecksum = meta.checksum
      const lastEmbeddedChecksum = meta.last_embedded_checksum

      // Cache logic: skip if already successfully embedded and checksum hasn't changed
      if (story.embedding_status === 'completed' && currentChecksum === lastEmbeddedChecksum && currentChecksum) {
        log(`    ⏭️ Skipped: Checksum hasn't changed.`)
        skippedCount++
        continue
      }

      // Mod 5: Better search_document structured generation
      const searchDoc = createSemanticDocument(story)
      
      if (!searchDoc) {
        log(`    ❌ Failed: Empty search document.`)
        failedCount++
        continue
      }

      try {
        log(`    Generating embedding for "${story.title}"...`)
        const embedStart = Date.now()
        const vector = await generator.generate(searchDoc)
        embeddingTimes.push(Date.now() - embedStart)
        
        const isValid = validateEmbedding(vector, MODEL_DIMENSIONS)
        if (!isValid) {
          throw new Error('Generated vector failed validation (NaNs, wrong dimension, or empty)')
        }
        
        // Mod 8: Don't log raw vectors
        log(`    ✅ Embedding generated | Dimensions: ${vector.length} | Status: Success`)

        // Update database with vector and top-level search_document
        meta.last_embedded_checksum = currentChecksum
        meta.pipeline = meta.pipeline || {}
        meta.pipeline.embedded = true

        const { error: updateError } = await supabase
          .from('stories')
          .update({
            embedding: JSON.stringify(vector),
            embedding_model: EMBEDDING_MODEL,
            embedding_version: EMBEDDING_VERSION,
            embedding_dimensions: MODEL_DIMENSIONS,
            embedding_status: 'completed',
            embedding_created_at: new Date().toISOString(),
            search_document: searchDoc,
            metadata: meta
          })
          .eq('id', story.id)

        if (updateError) {
          throw new Error(`Database update failed: ${updateError.message}`)
        }

        successCount++
      } catch (err: any) {
        log(`    ❌ Failed story ID ${story.id}: ${err.message}`)
        failedCount++
      }
    }
  }

  // Generate Report
  const elapsedMs = Date.now() - startTime
  const mins = Math.floor(elapsedMs / 60000)
  const secs = Math.floor((elapsedMs % 60000) / 1000)
  
  const avgMs = embeddingTimes.length > 0 
    ? Math.floor(embeddingTimes.reduce((a, b) => a + b, 0) / embeddingTimes.length) 
    : 0

  const report: EmbeddingReport = {
    total: totalStories,
    embedded: successCount,
    skipped: skippedCount,
    failed: failedCount,
    processing_time: `${mins}m ${secs}s`,
    average_time_per_story: `${(avgMs / 1000).toFixed(2)}s`,
    average_embedding_length: MODEL_DIMENSIONS,
    model: EMBEDDING_MODEL,
    completed_at: new Date().toISOString()
  }

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
  log(`\n🎉 Semantic Indexing Finished! Embedded=${successCount}, Skipped=${skippedCount}, Failed=${failedCount}`)
}

run().catch(e => log(`Fatal Error: ${e.message}`))
