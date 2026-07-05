/**
 * LokKatha AI — Knowledge Ingestion Pipeline: PDF Extractor
 *
 * Uses pdf-parse (already installed) to read the embedded text layer from a
 * Bengali PDF.  This is the Node.js equivalent of PyMuPDF: it reads character
 * streams directly — no OCR, no image rendering.
 *
 * Page tracking
 * ─────────────
 * The custom `pagerender` callback injects null-byte–delimited markers
 * (\x00PAGE:N\x00) into the text stream.  These markers survive the cleaning
 * stage (they contain no Bengali text and won't match any cleaning regex)
 * and are parsed by the story splitter to build accurate pages[] arrays
 * before being stripped from the final JSON content.
 */

import { readFile } from 'node:fs/promises'
import path from 'node:path'
import pdfParse from 'pdf-parse'

import type { RawExtraction } from './types'
import { log } from './utils'

/** Marker injected at the start of each page's text block. */
export const PAGE_MARKER_PREFIX = '\x00PAGE:'
/** Marker suffix — must not appear in normal PDF text. */
export const PAGE_MARKER_SUFFIX = '\x00'

/** Build a full page marker string for a given page number. */
export function makePageMarker(pageNum: number): string {
  return `${PAGE_MARKER_PREFIX}${pageNum}${PAGE_MARKER_SUFFIX}`
}

/**
 * Extract all text from a PDF file, injecting page provenance markers.
 *
 * @param filePath - Path to the PDF file (absolute or relative to CWD).
 * @returns RawExtraction — raw text with markers, per-page map, and metadata.
 * @throws If the file cannot be read or is not a valid PDF.
 */
export async function extractPdfText(filePath: string): Promise<RawExtraction> {
  const absolutePath = path.resolve(filePath)

  log('info', `Reading PDF: ${path.basename(absolutePath)}`)

  const buffer = await readFile(absolutePath)

  const pageContents = new Map<number, string>()
  let currentPage = 0  // incremented inside pagerender, which is called in order

  const options: Parameters<typeof pdfParse>[1] = {
    /**
     * Custom page renderer injected into pdf-parse / pdfjs-dist.
     * Called once per page, in document order.
     * Must return a string (or Promise<string>) that replaces the default
     * page text extraction for that page.
     */
    pagerender: async (pageData: any): Promise<string> => {
      currentPage++
      const pageNum = currentPage

      let pageText = ''
      try {
        // pdfjs TextContent items — each has a `str` and optional `hasEOL` flag
        const content = await (pageData.getTextContent as () => Promise<{
          items: Array<{ str: string; hasEOL?: boolean }>
        }>)()

        const parts: string[] = []
        let lastY: number | null = null
        for (const item of content.items) {
          if (typeof item.str === 'string') {
            const currentY = item.transform?.[5] ?? null
            if (lastY !== null && currentY !== lastY) {
              parts.push('\n')
            }
            parts.push(item.str)
            lastY = currentY
          }
        }
        pageText = parts.join('')
      } catch {
        // Image-only page — leave empty, OCR not used in this pipeline
        pageText = ''
      }

      pageContents.set(pageNum, pageText)

      // Return the page text prefixed with a page marker so we can track
      // which page each story segment came from after the text is combined.
      return `${makePageMarker(pageNum)}\n${pageText}\n`
    },
  }

  const parsed = await pdfParse(buffer, options)

  log('info', `Extracted ${parsed.numpages} pages · ${parsed.text.length.toLocaleString()} characters`)

  return {
    text: parsed.text,
    pageCount: parsed.numpages,
    sourceFile: path.basename(absolutePath),
    pageContents,
  }
}
