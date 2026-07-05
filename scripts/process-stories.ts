import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import { enrichStory } from '../lib/pipeline/aiEnricher'
import { bengaliCharRatio, generateChecksum } from '../lib/pipeline/utils'

// Directories
const RAW_DIR = join(process.cwd(), 'knowledge', 'raw')
const PROCESSED_DIR = join(process.cwd(), 'knowledge', 'processed')
const DEBUG_DIR = join(process.cwd(), 'knowledge', 'debug')
const REPORT_PATH = join(process.cwd(), 'knowledge', 'process-report.json')

// Create directories if missing
;[PROCESSED_DIR, DEBUG_DIR].forEach(dir => {
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true })
  }
})

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

/** Check if text contains Devanagari characters */
function hasDevanagari(text: string): boolean {
  return /[\u0900-\u097F]/.test(text)
}

/** Check if text is predominantly English/Latin */
function isEnglish(text: string): boolean {
  // Check if it's mostly basic Latin
  const matches = text.match(/[a-zA-Z]/g) || []
  return matches.length > text.length * 0.5
}

interface ProcessReport {
  book: string
  total: number
  processed: number
  failed: number
  skipped: number
  processing_time: string
  tokens_used: number
  estimated_cost: string
  model: string
  completed_at: string
}

async function run() {
  console.log('🚀 Starting Knowledge Enrichment Pipeline...')
  const startTime = Date.now()
  let tokensUsed = 0
  let processedCount = 0
  let failedCount = 0
  let skippedCount = 0
  let bookName = 'Unknown'
  
  const files = readdirSync(RAW_DIR).filter(f => f.endsWith('.json'))
  const totalFiles = files.length
  
  console.log(`Found ${totalFiles} raw stories to process.`)

  for (let i = 0; i < totalFiles; i++) {
    const file = files[i]
    const rawPath = join(RAW_DIR, file)
    const rawContent = JSON.parse(readFileSync(rawPath, 'utf8'))
    
    bookName = rawContent.source_book || bookName
    const slug = rawContent.slug
    const processedPath = join(PROCESSED_DIR, `${slug}.json`)
    const debugPath = join(DEBUG_DIR, `${slug}-response.json`)
    
    // Modification 9: Resume Support
    if (existsSync(processedPath)) {
      const existing = JSON.parse(readFileSync(processedPath, 'utf8'))
      if (existing.status === 'processed') {
        console.log(`[${i+1}/${totalFiles}] ⏩ Skipped "${rawContent.title}" (already processed)`)
        skippedCount++
        continue
      }
    }

    console.log(`\n[${i+1}/${totalFiles}] ⚙️ Processing: "${rawContent.title}"`)
    
    // Modification 6: Language Detection before Gemma
    if (bengaliCharRatio(rawContent.content) < 0.05) {
      console.log(`  ❌ Failed: Content does not appear to be Bengali.`)
      failedCount++
      continue
    }

    // Mark as processing (Crash recovery)
    writeFileSync(processedPath, JSON.stringify({ ...rawContent, status: 'processing' }, null, 2))

    // Call Gemma
    const result = await enrichStory(rawContent.title, rawContent.content)
    tokensUsed += result.tokensUsed
    
    // Modification 2: Save raw debug response
    if (result.rawResponse) {
      writeFileSync(debugPath, JSON.stringify(result.rawResponse, null, 2))
    }

    if (!result.metadata) {
      console.log(`  ❌ Failed AI Generation: ${result.error}`)
      failedCount++
      continue
    }

    const ai = result.metadata

    // Modification 7: AI Validation
    if (
      bengaliCharRatio(ai.summary_bn) < 0.10 || 
      !isEnglish(ai.summary_en) || 
      !hasDevanagari(ai.summary_hi)
    ) {
      console.log(`  ❌ Failed Validation: Language constraints violated in summaries.`)
      failedCount++
      continue
    }

    // Prepare final processed JSON
    const finalObject = {
      id: rawContent.id,
      title: rawContent.title,
      slug: rawContent.slug,
      content: rawContent.content,
      
      // AI Enriched fields
      summary_bn: ai.summary_bn,
      summary_en: ai.summary_en,
      summary_hi: ai.summary_hi,
      confidence: ai.confidence,
      characters: ai.characters,
      keywords: ai.keywords,
      category: ai.category,
      cultural_importance: ai.cultural_importance,
      moral: ai.moral,
      reading_time: ai.reading_time,
      difficulty: ai.difficulty,
      age_group: ai.age_group,
      themes: ai.themes,
      locations: ai.locations,
      festival_association: ai.festival_association,
      related_titles: ai.related_titles,
      sample_questions: ai.sample_questions,
      search_terms: ai.search_terms,
      entities: ai.entities,
      
      citations: {
        book: rawContent.source_book,
        pages: rawContent.pages,
        language: rawContent.language
      },
      
      status: 'processed',
      checksum: ''
    }

    // Generate new checksum
    finalObject.checksum = generateChecksum(JSON.stringify(finalObject))

    // Save
    writeFileSync(processedPath, JSON.stringify(finalObject, null, 2))
    
    console.log(`  ✅ Success! Tokens used: ${result.tokensUsed}`)
    processedCount++

    // Modification 8: Rate Limiter (500ms delay)
    if (i < totalFiles - 1) {
      await sleep(500)
    }
  }

  // Generate Report
  const elapsedMs = Date.now() - startTime
  const mins = Math.floor(elapsedMs / 60000)
  const secs = Math.floor((elapsedMs % 60000) / 1000)
  
  // Gemini 2.5 flash is extremely cheap, rough estimate:
  const cost = ((tokensUsed / 1_000_000) * 0.15).toFixed(4)

  const report: ProcessReport = {
    book: bookName,
    total: totalFiles,
    processed: processedCount,
    failed: failedCount,
    skipped: skippedCount,
    processing_time: `${mins}m ${secs}s`,
    tokens_used: tokensUsed,
    estimated_cost: `$${cost}`,
    model: 'gemini-2.5-flash',
    completed_at: new Date().toISOString()
  }

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
  console.log(`\n🎉 Pipeline Finished! processed=${processedCount}, failed=${failedCount}, tokens=${tokensUsed}`)
}

run().catch(console.error)
