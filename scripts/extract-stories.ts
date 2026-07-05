/**
 * LokKatha AI — Knowledge Ingestion Runner
 *
 * Orchestrates the full Bengali PDF → structured knowledge-base pipeline:
 *
 *   1. Extract text from PDF (pdf-parse, page markers)
 *   2. Clean text (remove page numbers, headers, footers)
 *   3. Detect story boundaries (Bengali title heuristics)
 *   4. For each story sequentially:
 *        a. Generate slug, UUID, SHA-256 checksum
 *        b. Validate (7 checks)
 *        c. Write knowledge/raw/<slug>.json
 *        d. Append to index
 *   5. Write knowledge/index/stories-index.json
 *   6. Write knowledge/import-report.json
 *
 * Usage:
 *   npx tsx scripts/extract-stories.ts
 *   npx tsx scripts/extract-stories.ts --pdf books/TkakurmarJhuli.pdf
 *   npx tsx scripts/extract-stories.ts --pdf books/MyBook.pdf --book "My Book" --lang bn
 *
 * Flags:
 *   --pdf  <path>   Path to the source PDF       (default: books/TkakurmarJhuli.pdf)
 *   --book <name>   Human-readable book name      (default: derived from filename)
 *   --lang <code>   ISO 639-1 language code       (default: bn)
 *
 * No AI. No Supabase. No translation. Pure extraction and structured output.
 */

import path from 'node:path'

import { extractPdfText }  from '../lib/pipeline/pdfExtractor'
import { cleanText }       from '../lib/pipeline/textCleaner'
import { splitStories }    from '../lib/pipeline/storySplitter'
import { validateEntry }   from '../lib/pipeline/validator'
import {
  bengaliToSlug,
  ensureDir,
  generateChecksum,
  generateId,
  log,
  writeJsonFile,
} from '../lib/pipeline/utils'

import type { ImportReport, IndexEntry, StoryRecord } from '../lib/pipeline/types'

// ── Output directory layout ────────────────────────────────────────────────

const KNOWLEDGE_DIR = path.resolve('knowledge')
const RAW_DIR       = path.join(KNOWLEDGE_DIR, 'raw')
const INDEX_DIR     = path.join(KNOWLEDGE_DIR, 'index')
const INDEX_FILE    = path.join(INDEX_DIR, 'stories-index.json')
const REPORT_FILE   = path.join(KNOWLEDGE_DIR, 'import-report.json')

// ── CLI argument parser ────────────────────────────────────────────────────

interface CliArgs {
  pdf:  string
  book: string
  lang: string
}

function parseArgs(argv: string[]): CliArgs {
  const args = argv.slice(2)

  function flag(name: string): string | undefined {
    const idx = args.indexOf(name)
    return idx !== -1 && idx + 1 < args.length ? args[idx + 1] : undefined
  }

  const pdf  = flag('--pdf')  ?? 'books/TkakurmarJhuli.pdf'
  const lang = flag('--lang') ?? 'bn'

  // Derive a readable book name from the filename if not supplied
  const derivedBook = path
    .basename(pdf, '.pdf')
    .replace(/([a-z])([A-Z])/g, '$1 $2')   // "ThakurmarJhuli" → "Thakurmar Jhuli"
    .replace(/[_-]+/g, ' ')
    .trim()

  const book = flag('--book') ?? derivedBook

  return { pdf, book, lang }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function main(): Promise<void> {
  const { pdf, book, lang } = parseArgs(process.argv)

  // ── Banner ───────────────────────────────────────────────────────────────
  console.log()
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  LokKatha AI — Knowledge Ingestion Pipeline')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log(`  Source  : ${pdf}`)
  console.log(`  Book    : ${book}`)
  console.log(`  Language: ${lang}`)
  console.log(`  Output  : ${RAW_DIR}`)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log()

  // ── Prepare output directories ────────────────────────────────────────────
  await ensureDir(RAW_DIR)
  await ensureDir(INDEX_DIR)
  // Create placeholders for future pipeline stages
  await ensureDir(path.join(KNOWLEDGE_DIR, 'processed'))
  await ensureDir(path.join(KNOWLEDGE_DIR, 'embeddings'))

  // ── Import report scaffold ────────────────────────────────────────────────
  const report: ImportReport = {
    book,
    stories_detected: 0,
    stories_saved: 0,
    failed: 0,
    warnings: [],
    generated_at: new Date().toISOString(),
  }

  // ── Step 1: Extract text ──────────────────────────────────────────────────
  console.log('  Reading PDF...')
  const raw = await extractPdfText(pdf)
  console.log()

  // ── Step 2: Clean text ────────────────────────────────────────────────────
  console.log('  Cleaning text...')
  const cleaned = cleanText(raw)
  console.log()

  // ── Step 3: Detect story boundaries ──────────────────────────────────────
  console.log('  Splitting into stories...')
  const entries = splitStories(cleaned)
  report.stories_detected = entries.length
  console.log()

  if (entries.length === 0) {
    log('error', 'No entries produced. The PDF may be image-only or unreadable.')
    process.exit(1)
  }

  // ── Step 4: Sequential validate → save ───────────────────────────────────
  console.log(`  Processing ${entries.length} detected stories...`)
  console.log()

  const seenTitles    = new Set<string>()
  const seenChecksums = new Set<string>()
  const indexEntries: IndexEntry[] = []

  for (let i = 0; i < entries.length; i++) {
    const entry  = entries[i]
    const label  = `(${i + 1}/${entries.length})`

    console.log(`  Story detected ${label}: "${entry.title}"`)

    // Generate slug and checksum before validation
    const slug     = bengaliToSlug(entry.title) || `story-${i + 1}`
    const checksum = generateChecksum(entry.body)

    // Validate
    const result = validateEntry(entry, checksum, slug, seenTitles, seenChecksums)

    if (!result.valid) {
      log('warn', `  Skipped — ${result.reason}`)
      report.warnings.push(`[${label}] "${entry.title}": ${result.reason}`)
      report.failed++
      console.log()
      continue
    }

    // Mark as seen so duplicates are caught in later iterations
    const normTitle = entry.title.toLowerCase().replace(/\s+/g, ' ').trim()
    seenTitles.add(normTitle)
    seenChecksums.add(checksum)

    // Build the final record
    const id = generateId()

    const record: StoryRecord = {
      id,
      title:       entry.title,
      slug,
      content:     entry.body,           // "content" not "story" — schema is reusable
      source_book: book,
      language:    lang,
      pages:       entry.pages,
      status:      'raw',               // Phase 4.3 will update to "processed"
      checksum,
    }

    const filename   = `${slug}.json`
    const outputPath = path.join(RAW_DIR, filename)

    // Write individual story JSON (sequential — not batched in memory)
    await writeJsonFile(outputPath, record)

    log('success', `  Validated`)
    log('success', `  Saved → knowledge/raw/${filename}`)
    console.log()

    // Append to the index (built in memory, flushed after the loop)
    indexEntries.push({
      id,
      title:       entry.title,
      slug,
      language:    lang,
      source_book: book,
      filename,
    })

    report.stories_saved++
  }

  // ── Step 5: Write stories-index.json ─────────────────────────────────────
  await writeJsonFile(INDEX_FILE, indexEntries)
  log('success', `Index written → knowledge/index/stories-index.json (${indexEntries.length} entries)`)
  console.log()

  // ── Step 6: Write import-report.json ─────────────────────────────────────
  report.generated_at = new Date().toISOString()
  await writeJsonFile(REPORT_FILE, report)
  log('success', `Report written → knowledge/import-report.json`)

  // ── Summary ───────────────────────────────────────────────────────────────
  console.log()
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Import completed successfully')
  console.log(`  Detected : ${report.stories_detected}`)
  console.log(`  Saved    : ${report.stories_saved}`)
  console.log(`  Failed   : ${report.failed}`)
  if (report.warnings.length > 0) {
    console.log(`  Warnings : ${report.warnings.length}`)
    for (const w of report.warnings) {
      console.log(`    • ${w}`)
    }
  }
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log()
}

// ── Entry point ────────────────────────────────────────────────────────────

main().catch((err: unknown) => {
  console.error()
  console.error('  ✗  Pipeline failed:', err instanceof Error ? err.message : err)
  if (err instanceof Error && err.stack) {
    console.error(err.stack.split('\n').slice(1).map(l => `    ${l}`).join('\n'))
  }
  process.exit(1)
})
