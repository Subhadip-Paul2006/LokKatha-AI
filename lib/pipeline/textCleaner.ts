/**
 * LokKatha AI — Knowledge Ingestion Pipeline: Text Cleaner
 *
 * Cleans raw PDF-extracted text for story boundary detection.
 *
 * What is removed:
 *   • Page number lines (standalone digits, Bengali numerals, Roman numerals)
 *   • Repeated header/footer lines (same line on ≥ HEADER_FOOTER_THRESHOLD pages)
 *   • ASCII/Unicode control characters (preserves \n, \r, \t)
 *   • Excessive consecutive blank lines (collapsed to max 2)
 *
 * What is preserved:
 *   • All Bengali Unicode (U+0980–U+09FF) without modification
 *   • PAGE markers (\x00PAGE:N\x00) — stripped by the splitter, not here
 *   • Blank lines that separate paragraphs and story titles
 */

import type { CleanedText, RawExtraction } from './types'
import { log } from './utils'

// ── Configuration ──────────────────────────────────────────────────────────

/**
 * A line that appears on this many or more distinct pages is considered
 * a repeated header or footer and will be removed.
 */
const HEADER_FOOTER_THRESHOLD = 3

/** Maximum consecutive blank lines allowed in cleaned output. */
const MAX_BLANK_LINES = 2

// ── Regex patterns ─────────────────────────────────────────────────────────

/** PAGE marker — must be preserved during cleaning. */
const PAGE_MARKER_RE = /^\x00PAGE:\d+\x00$/

/**
 * Lines that are page numbers:
 *   • ASCII digits only
 *   • Bengali digits (U+09E6–U+09EF) only
 *   • Roman numerals (front-matter pages: i, ii, iii, iv …)
 *   • Digit-only lines with dashes/pipes (e.g. "— 12 —")
 */
const PAGE_NUMBER_LINE_RE = /^\s*[\d\u09E6-\u09EF\u2013\u2014|—–\-]+\s*$/
const ROMAN_NUMERAL_LINE_RE = /^\s*[ivxlcdmIVXLCDM]+\s*$/

/**
 * Control characters to strip.
 * Keeps \t (\x09), \n (\x0A), \r (\x0D).
 * Also keeps \x00 which is part of our PAGE markers (handled by line-level logic).
 */
const CONTROL_CHAR_RE = /[\x01-\x08\x0B\x0C\x0E-\x1F\x7F]/g

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Clean raw extracted PDF text, preserving Bengali content and PAGE markers.
 *
 * @param raw - Output from extractPdfText().
 * @returns Cleaned text ready for story boundary detection.
 */
export function cleanText(raw: RawExtraction): CleanedText {
  log('info', 'Cleaning extracted text...')

  let text = raw.text

  // 1. Strip unwanted control characters (keep page markers intact)
  text = stripControlChars(text)

  // 2. Identify and remove repeated header/footer lines across pages
  const repeatedLines = findRepeatedLines(raw.pageContents)
  if (repeatedLines.size > 0) {
    log('info', `  Removing ${repeatedLines.size} repeated header/footer line(s)`)
    text = removeMatchingLines(text, repeatedLines)
  }

  // 3. Remove standalone page-number lines
  text = removePageNumberLines(text)

  // 4. Normalise blank lines and trailing whitespace per line
  text = normaliseWhitespace(text)

  // 5. Apply same cleaning to per-page contents (used later for page attribution)
  const cleanedPageContents = new Map<number, string>()
  for (const [page, content] of raw.pageContents) {
    let c = stripControlChars(content)
    if (repeatedLines.size > 0) c = removeMatchingLines(c, repeatedLines)
    c = removePageNumberLines(c)
    c = normaliseWhitespace(c)
    cleanedPageContents.set(page, c)
  }

  log('info', `  Cleaning complete: ${text.length.toLocaleString()} characters`)

  return {
    text,
    pageCount: raw.pageCount,
    sourceFile: raw.sourceFile,
    pageContents: cleanedPageContents,
  }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function stripControlChars(text: string): string {
  // Replace control chars but leave \x00 so PAGE markers stay intact.
  // The regex above already excludes \x00 (\x01 is the start of the range).
  return text.replace(CONTROL_CHAR_RE, '')
}

/**
 * Scan all page texts and return any line that appears verbatim on at least
 * HEADER_FOOTER_THRESHOLD distinct pages (i.e. a running header or footer).
 */
function findRepeatedLines(pageContents: Map<number, string>): Set<string> {
  const linePageCount = new Map<string, number>()

  for (const content of pageContents.values()) {
    // Use a Set to count each unique line only once per page
    const uniqueLines = new Set(
      content.split('\n').map(l => l.trim()).filter(l => l.length > 2),
    )
    for (const line of uniqueLines) {
      linePageCount.set(line, (linePageCount.get(line) ?? 0) + 1)
    }
  }

  const repeated = new Set<string>()
  for (const [line, count] of linePageCount) {
    if (count >= HEADER_FOOTER_THRESHOLD) repeated.add(line)
  }
  return repeated
}

function removeMatchingLines(text: string, toRemove: Set<string>): string {
  return text
    .split('\n')
    .filter(line => {
      const t = line.trim()
      return !toRemove.has(t)
    })
    .join('\n')
}

function removePageNumberLines(text: string): string {
  return text
    .split('\n')
    .filter(line => {
      const t = line.trim()
      if (t === '') return true                    // preserve blank lines
      if (PAGE_MARKER_RE.test(t)) return true      // preserve PAGE markers
      if (PAGE_NUMBER_LINE_RE.test(t)) return false
      if (ROMAN_NUMERAL_LINE_RE.test(t)) return false
      return true
    })
    .join('\n')
}

function normaliseWhitespace(text: string): string {
  const lines = text.split('\n').map(l => l.trimEnd())

  const output: string[] = []
  let blankRun = 0

  for (const line of lines) {
    const isBlank = line.trim() === ''
    if (isBlank) {
      blankRun++
      if (blankRun <= MAX_BLANK_LINES) output.push(line)
    } else {
      blankRun = 0
      output.push(line)
    }
  }

  return output.join('\n').trim()
}
