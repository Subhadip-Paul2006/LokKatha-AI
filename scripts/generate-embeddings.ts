import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { createClient } from '@supabase/supabase-js'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { EmbeddingGenerator } from '../lib/pipeline/embeddingGenerator'
import { validateEmbedding } from '../lib/pipeline/embeddingValidator'

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
  stories: number
  embedded: number
  failed: number
  processing_time: string
  model: string
  dimensions: number
  completed_at: string
}

async function run() {
  log('🚀 Starting Semantic Knowledge Indexing...')
  const startTime = Date.now()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  const generator = new EmbeddingGenerator()

  // 1. Fetch stories that need embedding
  log('Fetching stories pending semantic indexing...')
  // Using or filter for both conditions
  const { data: stories, error: fetchError } = await supabase
    .from('stories')
    .select('id, metadata')
    .or('embedding_status.neq.completed,embedding.is.null')

  if (fetchError) {
    log(`❌ Failed to fetch stories from Supabase: ${fetchError.message}`)
    process.exit(1)
  }

  const totalStories = stories?.length || 0
  if (totalStories === 0) {
    log('✅ All stories are already embedded. Exiting.')
    process.exit(0)
  }

  log(`Found ${totalStories} stories requiring embeddings.`)

  // 2. Batch Processing (10 stories per batch)
  const BATCH_SIZE = 10
  let successCount = 0
  let failedCount = 0

  for (let i = 0; i < totalStories; i += BATCH_SIZE) {
    const batch = stories!.slice(i, i + BATCH_SIZE)
    log(`\nProcessing batch ${Math.floor(i / BATCH_SIZE) + 1} (${batch.length} items)...`)

    for (const story of batch) {
      log(`  ➡️ Processing story ID: ${story.id}`)
      const searchDoc = story.metadata?.search_document

      if (!searchDoc) {
        log(`    ❌ Failed: No search_document found in metadata for ${story.id}.`)
        failedCount++
        continue
      }

      try {
        log(`    Creating semantic document... Generating embedding...`)
        const vector = await generator.generate(searchDoc)
        
        const isValid = validateEmbedding(vector, 768)
        if (!isValid) {
          throw new Error('Generated vector failed validation (NaNs, wrong dimension, or empty)')
        }
        log(`    Validated! Size: ${vector.length}`)

        // Update database
        log(`    Saving to database...`)
        const { error: updateError } = await supabase
          .from('stories')
          .update({
            embedding: JSON.stringify(vector),
            embedding_model: 'text-embedding-004',
            embedding_dimensions: 768,
            embedding_status: 'completed',
            embedding_created_at: new Date().toISOString()
          })
          .eq('id', story.id)

        if (updateError) {
          throw new Error(`Database update failed: ${updateError.message}`)
        }

        // Also update pipeline metadata embedded flag
        if (story.metadata && story.metadata.pipeline) {
          story.metadata.pipeline.embedded = true
          await supabase.from('stories').update({ metadata: story.metadata }).eq('id', story.id)
        }

        log(`    ✅ Completed story ID: ${story.id}`)
        successCount++
      } catch (err: any) {
        log(`    ❌ Failed story ID ${story.id}: ${err.message}`)
        failedCount++
      }
    }
  }

  // 3. Generate Report
  const elapsedMs = Date.now() - startTime
  const mins = Math.floor(elapsedMs / 60000)
  const secs = Math.floor((elapsedMs % 60000) / 1000)

  const report: EmbeddingReport = {
    stories: totalStories,
    embedded: successCount,
    failed: failedCount,
    processing_time: `${mins}m ${secs}s`,
    model: 'text-embedding-004',
    dimensions: 768,
    completed_at: new Date().toISOString()
  }

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
  log(`\n🎉 Semantic Indexing Finished! Embedded=${successCount}, Failed=${failedCount}`)
}

run().catch(e => log(`Fatal Error: ${e.message}`))
