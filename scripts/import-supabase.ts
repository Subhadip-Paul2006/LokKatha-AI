import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { readdirSync, readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'
import * as readline from 'readline'
import { validateProcessedEntry, type ProcessedEntry } from '../lib/pipeline/validators'
import { SupabaseImporter } from '../lib/pipeline/supabaseImporter'
import { generateChecksum } from '../lib/pipeline/utils'

const PROCESSED_DIR = join(process.cwd(), 'knowledge', 'processed')
const REPORT_PATH = join(process.cwd(), 'knowledge', 'import-report.json')
const LOGS_DIR = join(process.cwd(), 'knowledge', 'logs')

if (!existsSync(LOGS_DIR)) {
  mkdirSync(LOGS_DIR, { recursive: true })
}

const today = new Date().toISOString().split('T')[0]
const LOG_FILE = join(LOGS_DIR, `${today}-import.log`)

function log(msg: string) {
  const timestamp = new Date().toISOString()
  const line = `[${timestamp}] ${msg}`
  console.log(line)
  writeFileSync(LOG_FILE, line + '\n', { flag: 'a' })
}

interface ImportReport {
  book: string
  pipeline_version: string
  stories: number
  inserted: number
  updated: number
  duplicates: number
  failed: number
  processing_time: string
  average_insert_time: string
  completed_at: string
}

async function askQuestion(query: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  return new Promise(resolve => rl.question(query, ans => {
    rl.close()
    resolve(ans)
  }))
}

async function run() {
  const isDryRun = process.argv.includes('--dry-run')
  const autoConfirm = process.argv.includes('--auto-confirm')

  log(`🚀 Starting Knowledge Import Pipeline... ${isDryRun ? '[DRY RUN]' : ''}`)
  const startTime = Date.now()

  let files: string[] = []
  try {
    files = readdirSync(PROCESSED_DIR).filter(f => f.endsWith('.json'))
  } catch {
    log(`Directory ${PROCESSED_DIR} not found.`)
    process.exit(1)
  }

  const totalFound = files.length
  if (totalFound === 0) {
    log('No processed files found. Exiting.')
    process.exit(0)
  }

  log(`Checking ${totalFound} files for validation and checksums...`)
  const validEntries: ProcessedEntry[] = []
  let bookName = 'Unknown'

  for (const file of files) {
    try {
      const raw = readFileSync(join(PROCESSED_DIR, file), 'utf8')
      const json = JSON.parse(raw)
      const valid = validateProcessedEntry(json)
      
      if (valid) {
        // Mod 13: Hash Verification
        const oldChecksum = valid.checksum
        valid.checksum = '' // Temporarily remove to recreate hash
        const expectedChecksum = generateChecksum(JSON.stringify(valid))
        valid.checksum = oldChecksum
        
        if (oldChecksum !== expectedChecksum) {
          log(`⚠️ Hash mismatch for ${file}. Rejecting.`)
          continue
        }

        validEntries.push(valid)
        bookName = valid.citations?.book || bookName
      }
    } catch (e) {
      // invalid json
    }
  }

  const totalValid = validEntries.length
  if (totalValid === 0) {
    log('No valid entries found after validation. Exiting.')
    process.exit(1)
  }

  log('Connecting to database to check for existing records (duplicates/updates)...')
  let importer: SupabaseImporter
  try {
    importer = new SupabaseImporter()
  } catch (err: any) {
    log(`Failed to initialize Supabase: ${err.message}`)
    process.exit(1)
  }

  // Mod 7: Check by Slug instead of UUID
  let existingMap = new Map<string, string>()
  try {
    const chunkSize = 100
    for (let i = 0; i < validEntries.length; i += chunkSize) {
      const chunk = validEntries.slice(i, i + chunkSize)
      const chunkMap = await importer.findExistingBySlug(chunk)
      chunkMap.forEach((val, key) => existingMap.set(key, val))
    }
  } catch (err: any) {
    log(`Failed to check database: ${err.message}`)
    process.exit(1)
  }

  const toInsert: any[] = []
  let newCount = 0
  let updateCount = 0

  for (const entry of validEntries) {
    const existingId = existingMap.get(entry.slug)
    if (existingId) {
      updateCount++
      toInsert.push(importer.mapToDbRecord(entry, existingId))
    } else {
      newCount++
      toInsert.push(importer.mapToDbRecord(entry))
    }
  }

  log('\n================================')
  log(`  Preview Report`)
  log('================================')
  log(`${totalFound} stories found`)
  log(`${totalValid} passed validation & checksum`)
  log(`${updateCount} existing (will be updated)`)
  log(`${newCount} new (will be inserted)`)
  log('================================\n')

  if (toInsert.length === 0) {
    log('Nothing to insert or update. Exiting.')
    process.exit(0)
  }

  if (isDryRun) {
    log('Dry run complete. No data was inserted.')
    process.exit(0)
  }

  if (!autoConfirm) {
    const ans = await askQuestion('Ready. Import? Y/N: ')
    if (ans.trim().toLowerCase() !== 'y') {
      log('Aborting import.')
      process.exit(0)
    }
  }

  log('\nCommencing batch import...')
  let successCount = 0
  let failedCount = 0
  const BATCH_SIZE = 20
  
  let batchStart = Date.now()
  let batchTimes: number[] = []

  // Mod 11: Soft Rollback
  for (let i = 0; i < toInsert.length; i += BATCH_SIZE) {
    const batch = toInsert.slice(i, i + BATCH_SIZE)
    const bStart = Date.now()
    log(`  Importing batch ${Math.floor(i / BATCH_SIZE) + 1} (stories ${i + 1}-${i + batch.length})...`)
    try {
      await importer.upsertBatch(batch)
      successCount += batch.length
      const ms = Date.now() - bStart
      batchTimes.push(ms)
      log(`  ✅ Batch success in ${ms}ms`)
    } catch (err: any) {
      log(`  ❌ Batch ${Math.floor(i / BATCH_SIZE) + 1} failed: ${err.message}`)
      log(`  ⚠️ Soft rollback: stories ${i + 1}-${i + batch.length} skipped. Continuing with next batch...`)
      failedCount += batch.length
    }
  }

  // Mod 12: Verify After Insert
  try {
    const dbCount = await importer.verifyCount()
    log(`\n🔍 Verification: The stories table now contains ${dbCount} total records.`)
  } catch (err: any) {
    log(`⚠️ Could not verify total count: ${err.message}`)
  }

  // Generate Report
  const elapsedMs = Date.now() - startTime
  const mins = Math.floor(elapsedMs / 60000)
  const secs = Math.floor((elapsedMs % 60000) / 1000)
  
  const avgInsert = batchTimes.length > 0 
    ? Math.floor(batchTimes.reduce((a, b) => a + b, 0) / batchTimes.length) 
    : 0

  const report: ImportReport = {
    book: bookName,
    pipeline_version: '4.4',
    stories: totalValid,
    inserted: newCount,
    updated: updateCount,
    duplicates: updateCount, // Assuming updates = duplicates that we are overriding
    failed: failedCount,
    processing_time: `${mins}m ${secs}s`,
    average_insert_time: `${avgInsert}ms per batch`,
    completed_at: new Date().toISOString()
  }

  writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2))
  log(`\n🎉 Import Finished! success=${successCount}, failed=${failedCount}`)
}

run().catch(e => log(`Fatal Error: ${e.message}`))
