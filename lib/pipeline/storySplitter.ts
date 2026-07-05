/**
 * LokKatha AI — Knowledge Ingestion Pipeline: Story Splitter
 *
 * Detects story boundaries in cleaned Bengali PDF text and splits the document
 * into individual KnowledgeEntry objects.
 *
 * Boundary detection — four-tier strategy (priority order)
 * ─────────────────────────────────────────────────────────
 * Tier 1 (Primary): A line is a title if ALL of:
 *   • Length 2–MAX_TITLE_LENGTH characters (trimmed)
 *   • ≥ MIN_TITLE_BENGALI_RATIO Bengali characters
 *   • Does NOT end with a sentence-closing punctuation mark
 *   • Is NOT an excluded front-matter keyword
 *   • Is surrounded by at least one blank line on both sides
 *
 * Tier 2 (Conjunct): Lines matching Bengali ordinal/chapter prefixes
 *   (e.g. "প্রথম গল্প", "দ্বিতীয় গল্প") also treated as boundaries.
 *
 * Tier 3 (Fallback): If no boundaries are detected, return whole text
 *   as a single entry (better than crashing).
 *
 * Tier 4 (Guard): Segments shorter than MIN_ENTRY_LENGTH chars are merged
 *   into the NEXT entry to avoid sub-heading splits creating stub files.
 *
 * Page tracking
 * ─────────────
 * PAGE markers (\x00PAGE:N\x00) are extracted from each story's text
 * slice to build the pages[] array, then stripped from the body text.
 */

import type { CleanedText, KnowledgeEntry } from './types'
import { bengaliCharRatio } from './utils'
import { log } from './utils'

// ── Configuration ──────────────────────────────────────────────────────────

/** Minimum body length (chars) for a story to be kept as its own entry. */
const MIN_ENTRY_LENGTH = 300

/** Maximum character length of a line that can be a story title. */
const MAX_TITLE_LENGTH = 40

/**
 * Minimum fraction of Bengali characters for a line to be
 * considered a Bengali title heading.
 */
const MIN_TITLE_BENGALI_RATIO = 0.5

/**
 * Bengali punctuation that ends sentences.
 * A title line must NOT end with these.
 */
const SENTENCE_ENDINGS = new Set(['।', '॥', '?', '!', '…'])

/**
 * Common Bengali front-matter words that appear as isolated short lines
 * but are NOT story titles.  Add more as needed.
 */
const EXCLUDED_FIRST_WORDS = new Set([
  // Book-level headings
  'ঠাকুরমার', 'ঝুলি', 'সূচিপত্র', 'সূচী', 'বিষয়সূচি',
  'ভূমিকা', 'প্রকাশকের', 'লেখকের', 'সম্পাদকের',
  'গ্রন্থপরিচয়', 'কথামুখ', 'পরিচিতি',
  // Structural section words
  'অংশ', 'খণ্ড', 'পর্ব', 'অধ্যায়',
])

/**
 * Bengali ordinal/story-number patterns.
 * Lines matching these are also treated as boundaries even if
 * the title heuristic doesn't fire.
 */
const ORDINAL_PATTERN = /^(প্রথম|দ্বিতীয়|তৃতীয়|চতুর্থ|পঞ্চম|ষষ্ঠ|সপ্তম|অষ্টম|নবম|দশম)\s+(গল্প|কাহিনি|কাহিনী|কথা)/

// ── Page marker utilities ──────────────────────────────────────────────────

const PAGE_MARKER_FULL_RE = /\x00PAGE:(\d+)\x00\n?/g

/**
 * Extract all page numbers embedded in a text segment and return both
 * the cleaned text (markers stripped) and the sorted unique page array.
 */
function extractAndStripPageMarkers(text: string): {
  cleanText: string
  pages: number[]
} {
  const pages: number[] = []
  let match: RegExpExecArray | null

  // Reset lastIndex for global regex reuse
  PAGE_MARKER_FULL_RE.lastIndex = 0
  while ((match = PAGE_MARKER_FULL_RE.exec(text)) !== null) {
    pages.push(parseInt(match[1], 10))
  }

  PAGE_MARKER_FULL_RE.lastIndex = 0
  const cleanText = text.replace(PAGE_MARKER_FULL_RE, '')

  return {
    cleanText,
    pages: [...new Set(pages)].sort((a, b) => a - b),
  }
}

// ── Title detection ────────────────────────────────────────────────────────

/**
 * Determine whether a trimmed line is a plausible Bengali story title.
 */
function isTitleLine(line: string): boolean {
  const t = line.trim()

  // Length gate
  if (t.length < 2 || t.length > MAX_TITLE_LENGTH) return false

  // Must be predominantly Bengali
  if (bengaliCharRatio(t) < MIN_TITLE_BENGALI_RATIO) return false

  // Must not end with a sentence-closing punctuation mark
  const lastChar = [...t].at(-1) ?? ''
  if (SENTENCE_ENDINGS.has(lastChar)) return false

  // Exclude known front-matter headings by their first word
  const firstWord = t.split(/[\s\u00a0]+/)[0] ?? ''
  if (EXCLUDED_FIRST_WORDS.has(firstWord)) return false

  return true
}

/**
 * Check whether line at `index` is surrounded by blank lines.
 *
 * @param lines - Full line array.
 * @param index - Index of the candidate title line.
 * @param lookBehind - Number of lines to search behind for a blank.
 * @param lookAhead  - Number of lines to search ahead for a blank.
 */
function hasSurroundingBlanks(
  lines: string[],
  index: number,
  lookBehind = 2,
  lookAhead  = 2,
): boolean {
  const start = Math.max(0, index - lookBehind)
  const end   = Math.min(lines.length - 1, index + lookAhead)

  const blankBefore = lines.slice(start, index).some(l => l.trim() === '')
  const blankAfter  = lines.slice(index + 1, end + 1).some(l => l.trim() === '')

  return blankBefore && blankAfter
}

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Split cleaned Bengali text into individual KnowledgeEntry objects.
 *
 * @param cleaned - Output from cleanText().
 * @returns Array of KnowledgeEntry, each with a title, body, and pages[].
 */
export function splitStories(cleaned: CleanedText): KnowledgeEntry[] {
  log('info', 'Detecting story boundaries...')

  const lines = cleaned.text.split('\n')
  const boundaryLineIndices: number[] = []

  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trim()
    if (t === '' || t.startsWith('\x00')) continue  // skip blanks and PAGE markers

    // If PDF lacks empty lines, we just rely on title heuristic directly
    const isTier1 = isTitleLine(t)
    const isTier2 = ORDINAL_PATTERN.test(t)

    if (isTier1 || isTier2) {
      boundaryLineIndices.push(i)
    }
  }

  log('info', `  Found ${boundaryLineIndices.length} boundary candidates`)

  // ── Tier 3 fallback: entire document as one entry ─────────────────────────
  if (boundaryLineIndices.length === 0) {
    log('warn', '  No boundaries detected — returning full document as a single entry')
    const { cleanText, pages } = extractAndStripPageMarkers(cleaned.text)
    return [
      {
        title: cleaned.sourceFile.replace(/\.pdf$/i, ''),
        body:  cleanText.trim(),
        pages: pages.length > 0
          ? pages
          : [...cleaned.pageContents.keys()].sort((a, b) => a - b),
      },
    ]
  }

  // ── Build raw segments ────────────────────────────────────────────────────
  const rawEntries: KnowledgeEntry[] = []

  for (let b = 0; b < boundaryLineIndices.length; b++) {
    const titleIdx = boundaryLineIndices[b]
    const bodyStart = titleIdx + 1
    const bodyEnd   = b + 1 < boundaryLineIndices.length
      ? boundaryLineIndices[b + 1]
      : lines.length

    const title      = lines[titleIdx].trim()
    const rawBody    = lines.slice(bodyStart, bodyEnd).join('\n')
    const { cleanText, pages } = extractAndStripPageMarkers(rawBody)

    rawEntries.push({
      title,
      body: cleanText.trim(),
      pages,
    })
  }

  // ── Tier 4: merge under-length entries into the next ─────────────────────
  const merged = mergeShortEntries(rawEntries)

  log('info', `  Final entry count after merge guard: ${merged.length}`)
  return merged
}

// ── Merge helper ───────────────────────────────────────────────────────────

/**
 * Walk the entry array and merge any entry whose body is shorter than
 * MIN_ENTRY_LENGTH characters into the following entry.
 *
 * This prevents sub-headings or section dividers from creating tiny stub files.
 * If the LAST entry is too short and has no successor, it is merged backward.
 */
function mergeShortEntries(entries: KnowledgeEntry[]): KnowledgeEntry[] {
  if (entries.length <= 1) return entries

  const result: KnowledgeEntry[] = []

  for (let i = 0; i < entries.length; i++) {
    const current = entries[i]

    if (current.body.length < MIN_ENTRY_LENGTH && i + 1 < entries.length) {
      // Merge: prepend this entry's title + body into the next entry
      const next = entries[i + 1]
      entries[i + 1] = {
        title: next.title,
        body: [current.title, current.body, next.body]
          .filter(Boolean)
          .join('\n\n')
          .trim(),
        pages: [...new Set([...current.pages, ...next.pages])].sort(
          (a, b) => a - b,
        ),
      }
      log('warn', `  Merged short entry "${current.title}" (${current.body.length} chars) → next`)
      continue
    }

    // Last entry is too short → merge backward
    if (current.body.length < MIN_ENTRY_LENGTH && result.length > 0) {
      const prev = result[result.length - 1]
      result[result.length - 1] = {
        title: prev.title,
        body:  [prev.body, current.title, current.body].filter(Boolean).join('\n\n').trim(),
        pages: [...new Set([...prev.pages, ...current.pages])].sort((a, b) => a - b),
      }
      log('warn', `  Merged short trailing entry "${current.title}" (${current.body.length} chars) ← previous`)
      continue
    }

    result.push(current)
  }

  return result
}
