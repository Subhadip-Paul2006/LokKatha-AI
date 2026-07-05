import { readFileSync } from 'fs'
import { join } from 'path'
import { ProcessedEntrySchema } from '../lib/pipeline/validators'

const raw = readFileSync(join(process.cwd(), 'knowledge', 'processed', 'chhota.json'), 'utf8')
const json = JSON.parse(raw)

try {
  ProcessedEntrySchema.parse(json)
  console.log('Valid!')
} catch (e: any) {
  console.error(e.errors)
}
