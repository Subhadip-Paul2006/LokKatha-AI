/**
 * LokKatha AI — Knowledge Ingestion Pipeline: Shared Types
 *
 * Designed for extensibility: every type uses "content" (not "story")
 * and "KnowledgeEntry" (not "DetectedStory") so the pipeline can handle
 * stories, songs, poems, proverbs, riddles, and recipes without schema changes.
 *
 * Status lifecycle (managed by later phases):
 *   "raw" → "processed" → "embedded"
 */

// ── Extraction ─────────────────────────────────────────────────────────────

/**
 * Raw output from the PDF extractor, before any cleaning.
 * Page markers (\x00PAGE:N\x00) are embedded in `text` for provenance.
 */
export interface RawExtraction {
  /** Full document text with embedded PAGE markers for page tracking. */
  text: string
  /** Total number of pages in the source PDF. */
  pageCount: number
  /** Original filename (basename only) of the source PDF. */
  sourceFile: string
  /** Per-page raw text, keyed by 1-based page number. */
  pageContents: Map<number, string>
}

/** Cleaned, normalised text ready for story boundary detection. */
export interface CleanedText {
  /**
   * Cleaned document text. Still contains PAGE markers — the splitter
   * extracts and strips them when it builds each entry's pages[].
   */
  text: string
  /** Total page count (preserved from extraction). */
  pageCount: number
  /** Original source filename. */
  sourceFile: string
  /** Cleaned per-page texts (used as probes for page attribution). */
  pageContents: Map<number, string>
}

// ── Splitting ──────────────────────────────────────────────────────────────

/**
 * A single knowledge unit detected by the story splitter.
 *
 * Renamed from "DetectedStory" → "KnowledgeEntry" because the pipeline
 * will eventually ingest stories, songs, poems, proverbs, riddles,
 * festivals, historical articles, and recipes.
 */
export interface KnowledgeEntry {
  /** Detected heading/title (the boundary line that triggered this split). */
  title: string
  /** Full body text of the entry (no PAGE markers). */
  body: string
  /** 1-based page numbers from the source PDF that this entry spans. */
  pages: number[]
}

// ── Serialisation ──────────────────────────────────────────────────────────

/**
 * The final JSON record written to knowledge/raw/<slug>.json.
 *
 * Designed to be directly importable into Supabase in Phase 4.3
 * with no schema changes required.
 */
export interface StoryRecord {
  /** UUID v4 — the primary identifier for this knowledge unit. */
  id: string
  /** Detected Bengali title. */
  title: string
  /** ASCII slug derived from the title (= filename without .json). */
  slug: string
  /**
   * Full extracted text content.
   * Named "content" (not "story") so the schema works for any document type.
   */
  content: string
  /** Human-readable name of the source book or collection. */
  source_book: string
  /** ISO 639-1 language code. Default "bn" for Bengali. */
  language: string
  /** 1-based source PDF page numbers this entry spans. */
  pages: number[]
  /**
   * Processing status.
   * - "raw":      just extracted, no AI processing yet
   * - "processed": summarised / translated by Gemma (Phase 4.3)
   * - "embedded":  vector embedding generated (Phase 5)
   */
  status: 'raw' | 'processed' | 'embedded'
  /**
   * SHA-256 hex digest of the `content` field.
   * Used for duplicate detection on re-import.
   */
  checksum: string
}

// ── Index ──────────────────────────────────────────────────────────────────

/** One entry in knowledge/index/stories-index.json. */
export interface IndexEntry {
  /** UUID matching the StoryRecord in the corresponding JSON file. */
  id: string
  /** Bengali title. */
  title: string
  /** ASCII slug (= filename without .json). */
  slug: string
  /** ISO 639-1 language code. */
  language: string
  /** Source book/collection name. */
  source_book: string
  /** Filename of the individual story JSON (e.g. "lalkamal-neelkamal.json"). */
  filename: string
}

// ── Validation ─────────────────────────────────────────────────────────────

/** Result of validating a single KnowledgeEntry. */
export interface ValidationResult {
  /** Whether the entry passed all checks. */
  valid: boolean
  /** Human-readable reason for rejection (only set when valid=false). */
  reason?: string
}

// ── Reporting ──────────────────────────────────────────────────────────────

/**
 * Import report written to knowledge/import-report.json after the pipeline
 * completes. Captures counts, warnings, and a timestamp for auditability.
 */
export interface ImportReport {
  /** Human-readable source book name. */
  book: string
  /** Total entries detected by the splitter before validation. */
  stories_detected: number
  /** Entries successfully validated and written to disk. */
  stories_saved: number
  /** Entries that failed validation or caused write errors. */
  failed: number
  /** Warning messages collected during processing. */
  warnings: string[]
  /** ISO 8601 timestamp of when this import run completed. */
  generated_at: string
}
