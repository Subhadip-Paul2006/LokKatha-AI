/**
 * LokKatha AI — Knowledge Ingestion Pipeline: Validator
 *
 * Validates a KnowledgeEntry before it is written to disk.
 *
 * Checks (in order):
 *   1. Title is not empty.
 *   2. Content is not empty.
 *   3. Content length ≥ MIN_CONTENT_LENGTH characters.
 *   4. Content contains a detectable fraction of Bengali Unicode.
 *   5. Title has not already been seen in this import run (duplicate title).
 *   6. Content SHA-256 has not already been seen (duplicate content).
 *   7. The generated slug is a valid non-empty filename string.
 *
 * The caller is responsible for maintaining seenTitles and seenChecksums
 * across the sequential processing loop so that duplicates are caught.
 */

import type { KnowledgeEntry, ValidationResult } from './types'
import { bengaliCharRatio } from './utils'

// ── Configuration ──────────────────────────────────────────────────────────

/** Body must contain at least this many characters. */
const MIN_CONTENT_LENGTH = 300

/**
 * At least this fraction of content characters must be Bengali Unicode.
 * A low threshold (10%) allows for mixed-script content (e.g. English titles).
 */
const MIN_BENGALI_RATIO = 0.10

// ── Public API ─────────────────────────────────────────────────────────────

/**
 * Validate a single KnowledgeEntry for this import run.
 *
 * @param entry        - The entry to validate.
 * @param checksum     - Pre-computed SHA-256 of entry.body (from generateChecksum).
 * @param slug         - Pre-computed ASCII slug (from bengaliToSlug).
 * @param seenTitles   - Mutable set of normalised titles already processed.
 * @param seenChecksums - Mutable set of checksums already processed.
 *
 * @returns ValidationResult with valid=true on success, or valid=false + reason.
 */
export function validateEntry(
  entry: KnowledgeEntry,
  checksum: string,
  slug: string,
  seenTitles: Set<string>,
  seenChecksums: Set<string>,
): ValidationResult {
  const title   = entry.title.trim()
  const content = entry.body.trim()

  // 1. Title must not be empty
  if (!title) {
    return { valid: false, reason: 'Title is empty' }
  }

  // 2. Content must not be empty
  if (!content) {
    return { valid: false, reason: 'Content is empty' }
  }

  // 3. Content length guard
  if (content.length < MIN_CONTENT_LENGTH) {
    return {
      valid: false,
      reason: `Content too short (${content.length} chars; minimum ${MIN_CONTENT_LENGTH})`,
    }
  }

  // 4. Bengali Unicode presence
  if (bengaliCharRatio(content) < MIN_BENGALI_RATIO) {
    return {
      valid: false,
      reason: `Content does not appear to contain Bengali text (${(bengaliCharRatio(content) * 100).toFixed(1)}% Bengali)`,
    }
  }

  // 5. Duplicate title detection
  const normalisedTitle = title.toLowerCase().replace(/\s+/g, ' ').trim()
  if (seenTitles.has(normalisedTitle)) {
    return { valid: false, reason: `Duplicate title: "${title}"` }
  }

  // 6. Duplicate content detection (by checksum)
  if (seenChecksums.has(checksum)) {
    return {
      valid: false,
      reason: `Duplicate content detected (checksum: ${checksum.slice(0, 12)}…)`,
    }
  }

  // 7. Slug must be a valid non-empty filename string
  if (!slug || slug === 'entry') {
    return {
      valid: false,
      reason: `Could not generate a valid filename slug from title "${title}"`,
    }
  }

  return { valid: true }
}
