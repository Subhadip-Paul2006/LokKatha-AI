/**
 * LokKatha AI — Knowledge Ingestion Pipeline: Utility Functions
 *
 * Pipeline-specific helpers only. Does NOT import from or affect lib/utils.ts
 * (the frontend Tailwind helper). Keeping these namespaces separate prevents
 * Next.js from bundling Node.js-only modules (crypto, fs) into the browser.
 */

import { createHash, randomUUID } from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

// ── Logging ────────────────────────────────────────────────────────────────

type LogLevel = 'info' | 'warn' | 'error' | 'success'

const LEVEL_ICON: Record<LogLevel, string> = {
  info:    '  ℹ',
  warn:    '  ⚠',
  error:   '  ✗',
  success: '  ✓',
}

/** Structured, level-prefixed console logger for the pipeline. */
export function log(level: LogLevel, message: string): void {
  const line = `${LEVEL_ICON[level]}  ${message}`
  if (level === 'error') console.error(line)
  else if (level === 'warn') console.warn(line)
  else console.log(line)
}

// ── Identity & Integrity ───────────────────────────────────────────────────

/** Generate a UUID v4 identifier (Node.js 15.6+ built-in). */
export function generateId(): string {
  return randomUUID()
}

/**
 * Compute a SHA-256 hex digest of a UTF-8 string.
 * Used for duplicate detection: same content = same checksum.
 */
export function generateChecksum(content: string): string {
  return createHash('sha256').update(content, 'utf8').digest('hex')
}

// ── File System ────────────────────────────────────────────────────────────

/** Create a directory and all missing parent directories (mkdir -p). */
export async function ensureDir(dirPath: string): Promise<void> {
  await mkdir(dirPath, { recursive: true })
}

/**
 * Serialise a value to pretty-printed JSON and write it to a file.
 * Creates any missing parent directories automatically.
 */
export async function writeJsonFile(filePath: string, data: unknown): Promise<void> {
  await ensureDir(path.dirname(filePath))
  await writeFile(filePath, JSON.stringify(data, null, 2), 'utf8')
}

// ── Bengali Transliteration ────────────────────────────────────────────────

/**
 * The virama (hasanta) — U+09CD.
 * When it follows a consonant, it suppresses the consonant's inherent vowel.
 */
const VIRAMA = '\u09CD'

/**
 * Bengali consonant → romanized base string (without inherent 'a').
 * The inherent 'a' is added by the transliteration algorithm based on context.
 */
const CONSONANT_MAP: Readonly<Record<string, string>> = {
  // Velar
  'ক': 'k',   'খ': 'kh',  'গ': 'g',   'ঘ': 'gh',  'ঙ': 'ng',
  // Palatal
  'চ': 'ch',  'ছ': 'chh', 'জ': 'j',   'ঝ': 'jh',  'ঞ': 'n',
  // Retroflex
  'ট': 't',   'ঠ': 'th',  'ড': 'd',   'ঢ': 'dh',  'ণ': 'n',
  // Dental
  'ত': 't',   'থ': 'th',  'দ': 'd',   'ধ': 'dh',  'ন': 'n',
  // Labial
  'প': 'p',   'ফ': 'f',   'ব': 'b',   'ভ': 'bh',  'ম': 'm',
  // Approximants & sibilants
  'য': 'j',   'র': 'r',   'ল': 'l',
  'শ': 'sh',  'ষ': 'sh',  'স': 's',   'হ': 'h',
  // Extended consonants
  'ড়': 'r',  'ঢ়': 'rh', 'য়': 'y',  'ৎ': 't',
}

/**
 * Bengali vowel characters (independent forms and diacritic marks) →
 * romanized string.
 */
const VOWEL_MAP: Readonly<Record<string, string>> = {
  // Independent vowels
  'অ': 'a',  'আ': 'aa', 'ই': 'i',  'ঈ': 'ee', 'উ': 'u',  'ঊ': 'oo',
  'ঋ': 'ri', 'এ': 'e',  'ঐ': 'oi', 'ও': 'o',  'ঔ': 'ou',
  // Vowel diacritic marks (matras)
  'া': 'a',  'ি': 'i',  'ী': 'ee', 'ু': 'u',  'ূ': 'oo',
  'ৃ': 'ri', 'ে': 'e',  'ৈ': 'oi', 'ো': 'o',  'ৌ': 'ou',
  // Nasalisation / anusvara / visarga
  'ং': 'n',  'ঃ': '',   'ঁ': 'n',
}

/** Characters that count as "vowels" for the coda-position detection rule. */
const VOWEL_CHARS = new Set<string>([
  // Independent vowels
  'অ', 'আ', 'ই', 'ঈ', 'উ', 'ঊ', 'ঋ', 'এ', 'ঐ', 'ও', 'ঔ',
  // Vowel diacritic marks
  'া', 'ি', 'ী', 'ু', 'ূ', 'ৃ', 'ে', 'ৈ', 'ো', 'ৌ',
])

function isVowelOrMark(ch: string | undefined): boolean {
  return ch !== undefined && VOWEL_CHARS.has(ch)
}

function isVowelMark(ch: string | undefined): boolean {
  // Vowel marks only (diacritics), not independent vowels
  if (!ch) return false
  const code = ch.codePointAt(0) ?? 0
  // U+09BE (ā) … U+09CC (au)  — Bengali vowel signs in Unicode
  return code >= 0x09be && code <= 0x09cc
}

function isWordBoundary(ch: string | undefined): boolean {
  if (!ch) return true
  const code = ch.codePointAt(0) ?? 0
  // Any character outside Bengali block or ASCII alphanumeric is a boundary
  return code < 0x0980 || code > 0x09ff
}

/**
 * Convert a Bengali string to an ASCII URL/filename slug.
 *
 * Algorithm:
 * 1. Transliterate each consonant to its romanized form.
 * 2. Add the inherent vowel 'a' after a consonant UNLESS:
 *    a. The next character is a virama (suppresses it).
 *    b. The next character is a vowel mark (explicit vowel replaces it).
 *    c. The next character is a word boundary (schwa deletion at word end).
 *    d. The consonant is in coda position: the previous character was a vowel
 *       AND the next character is another consonant (e.g. "lal" in "লাল").
 * 3. Transliterate vowel characters.
 * 4. Convert spaces to hyphens.
 * 5. Strip non-ASCII-alphanumeric characters and collapse hyphens.
 *
 * Verified against user examples:
 *   লালকমল নীলকমল → lalkamal-neelkamal
 *   সাত ভাই চম্পা  → sat-bhai-champa
 *   বুদ্ধু ভুতুম   → buddhu-bhutum
 */
export function bengaliToSlug(title: string): string {
  // [...title] handles multi-codepoint characters correctly (no surrogate split)
  const chars = [...title]
  let result = ''

  for (let i = 0; i < chars.length; i++) {
    const ch   = chars[i]
    const prev = chars[i - 1]
    const next = chars[i + 1]

    if (ch === VIRAMA) {
      // Consumed by look-ahead from the preceding consonant — skip
      continue
    }

    if (ch in CONSONANT_MAP) {
      result += CONSONANT_MAP[ch]

      // Determine whether to append the inherent vowel 'a'
      const suppressedByVirama     = next === VIRAMA
      const suppressedByVowelMark  = isVowelMark(next)
      const suppressedByBoundary   = isWordBoundary(next)
      // Coda position: this consonant closes a syllable that already has a vowel
      const prevWasVowel           = isVowelOrMark(prev)
      const nextIsConsonant        = next !== undefined && next in CONSONANT_MAP
      const isInCodaPosition       = prevWasVowel && nextIsConsonant

      if (
        !suppressedByVirama &&
        !suppressedByVowelMark &&
        !suppressedByBoundary &&
        !isInCodaPosition
      ) {
        result += 'a'
      }

    } else if (ch in VOWEL_MAP) {
      result += VOWEL_MAP[ch]
    } else if (ch === ' ' || ch === '\u00a0' || ch === '-') {
      result += '-'
    }
    // All other characters (punctuation, digits, unknown) are dropped
  }

  return result
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '')  // strip anything not slug-safe
    .replace(/-+/g, '-')          // collapse consecutive hyphens
    .replace(/^-|-$/g, '')        // trim leading/trailing hyphens
}

// ── Bengali content check (exported for validator and cleaner) ─────────────

/** U+0980 … U+09FF — the full Bengali Unicode block. */
const BN_START = 0x0980
const BN_END   = 0x09ff

/**
 * Return the fraction of characters in a string that are Bengali Unicode.
 * Returns 0 for empty strings.
 */
export function bengaliCharRatio(text: string): number {
  if (text.length === 0) return 0
  let count = 0
  for (const ch of text) {
    const cp = ch.codePointAt(0) ?? 0
    if (cp >= BN_START && cp <= BN_END) count++
  }
  return count / [...text].length
}
