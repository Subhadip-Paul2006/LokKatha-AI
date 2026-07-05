'use client'

import { useCallback, useRef, useState } from 'react'

// ── Types ─────────────────────────────────────────────────────────────────────

type ExtractionMethod = 'pymupdf' | 'tesseract_ocr'

interface IngestResult {
  file_url: string
  filename: string
  size_bytes: number
  page_count: number
  extraction_method: ExtractionMethod
  extracted_text: string
  char_count: number
  ocr_unavailable: boolean
}

type UploadState = 'idle' | 'uploading' | 'done' | 'error'

// ── Constants ─────────────────────────────────────────────────────────────────

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? 'http://localhost:8000'

const MAX_SIZE_MB = 100
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024

// ── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1_048_576) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1_048_576).toFixed(2)} MB`
}

function MethodBadge({ method }: { method: ExtractionMethod }) {
  const isPymupdf = method === 'pymupdf'
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-0.5 text-xs font-semibold tracking-wide ${
        isPymupdf
          ? 'bg-forest-green/15 text-forest-green'
          : 'bg-clay-orange/15 text-clay-orange'
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isPymupdf ? 'bg-forest-green' : 'bg-clay-orange'}`}
      />
      {isPymupdf ? 'Native text (PyMuPDF)' : 'OCR — Tesseract bengali'}
    </span>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AdminImportPage() {
  const [state, setState] = useState<UploadState>('idle')
  const [result, setResult] = useState<IngestResult | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')
  const [dragging, setDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── File selection ──────────────────────────────────────────────────────────

  const handleFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      setErrorMsg('Only PDF files are accepted.')
      setState('error')
      return
    }
    if (file.size > MAX_SIZE_BYTES) {
      setErrorMsg(`File exceeds ${MAX_SIZE_MB} MB limit (${formatBytes(file.size)}).`)
      setState('error')
      return
    }
    setSelectedFile(file)
    setResult(null)
    setErrorMsg('')
    setState('idle')
  }, [])

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const onDrop = useCallback(
    (e: React.DragEvent<HTMLLabelElement>) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [handleFile],
  )

  // ── Upload ──────────────────────────────────────────────────────────────────

  const upload = async () => {
    if (!selectedFile) return
    setState('uploading')
    setErrorMsg('')
    setResult(null)

    const formData = new FormData()
    formData.append('file', selectedFile)

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/ingest/pdf`, {
        method: 'POST',
        body: formData,
      })

      const json = await res.json()

      if (!res.ok) {
        setErrorMsg(json.error ?? `Server error ${res.status}`)
        setState('error')
        return
      }

      setResult(json as IngestResult)
      setState('done')
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : 'Could not reach the server. Is the backend running?',
      )
      setState('error')
    }
  }

  const reset = () => {
    setState('idle')
    setSelectedFile(null)
    setResult(null)
    setErrorMsg('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const copyText = async () => {
    if (!result) return
    await navigator.clipboard.writeText(result.extracted_text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  const isUploading = state === 'uploading'

  return (
    <div className="min-h-screen bg-background paper-grain">
      {/* Header */}
      <header className="border-b border-border bg-paper-old/80 backdrop-blur-sm px-6 py-4 sticky top-0 z-20">
        <div className="mx-auto max-w-4xl flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-temple-stone mb-0.5">
              LokKatha AI — Admin
            </p>
            <h1 className="font-heading text-2xl text-ink leading-tight">
              Import Cultural Book
            </h1>
          </div>
          <span className="hidden sm:inline-flex items-center gap-2 rounded-full border border-border bg-palmleaf/60 px-3 py-1 text-xs text-temple-stone">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
              <circle cx="5" cy="5" r="4" />
            </svg>
            Phase 04 — Ingestion
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 sm:px-6 py-10 space-y-8 lk-rise">
        {/* Intro */}
        <div className="space-y-1">
          <h2 className="font-heading text-3xl text-ink">
            Upload a Bengali PDF
          </h2>
          <p className="text-temple-stone text-sm leading-relaxed max-w-xl">
            Upload a curated Bengali cultural book or oral heritage document. The
            system will store the original in Supabase and extract all readable
            text. Scanned documents are automatically processed using OCR.
          </p>
        </div>

        {/* Drop zone */}
        <label
          id="pdf-drop-zone"
          htmlFor="pdf-file-input"
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={onDrop}
          className={`flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed p-10 cursor-pointer transition-all duration-300 ${
            dragging
              ? 'border-clay-orange bg-clay-orange/8 scale-[1.01]'
              : selectedFile
                ? 'border-forest-green bg-forest-green/6'
                : 'border-border bg-paper-old hover:border-muted-gold hover:bg-palmleaf/40'
          }`}
        >
          {/* Icon */}
          <div className={`rounded-full p-4 transition-colors duration-300 ${
            selectedFile ? 'bg-forest-green/12' : 'bg-palmleaf'
          }`}>
            {selectedFile ? (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-forest-green">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <polyline points="16 13 12 17 8 13" />
                <line x1="12" y1="17" x2="12" y2="10" />
              </svg>
            ) : (
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
                className="text-temple-stone">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="12" y1="18" x2="12" y2="12" />
                <line x1="9" y1="15" x2="15" y2="15" />
              </svg>
            )}
          </div>

          {selectedFile ? (
            <div className="text-center space-y-1">
              <p className="font-semibold text-ink truncate max-w-xs">{selectedFile.name}</p>
              <p className="text-sm text-temple-stone">{formatBytes(selectedFile.size)}</p>
              <p className="text-xs text-forest-green font-medium">Ready to upload</p>
            </div>
          ) : (
            <div className="text-center space-y-1">
              <p className="font-semibold text-ink">
                {dragging ? 'Drop your PDF here' : 'Drag & drop a PDF, or click to browse'}
              </p>
              <p className="text-sm text-temple-stone">Maximum file size: 100 MB</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            id="pdf-file-input"
            type="file"
            accept=".pdf,application/pdf"
            onChange={onInputChange}
            className="sr-only"
          />
        </label>

        {/* Action row */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            id="upload-pdf-btn"
            onClick={upload}
            disabled={!selectedFile || isUploading}
            className="inline-flex items-center gap-2 rounded-xl bg-terracotta px-6 py-2.5 text-sm font-semibold text-paper-old shadow-paper transition-all hover:bg-terracotta-deep hover:shadow-paper-lg active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-muted-gold"
          >
            {isUploading ? (
              <>
                <svg className="lk-leaf-spin h-4 w-4" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-6.219-8.56" strokeLinecap="round" />
                </svg>
                Extracting…
              </>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
                  stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="17 8 12 3 7 8" />
                  <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
                Upload & Extract
              </>
            )}
          </button>

          {(selectedFile || state === 'error') && (
            <button
              id="reset-btn"
              onClick={reset}
              className="rounded-xl border border-border bg-paper-old px-4 py-2.5 text-sm text-temple-stone hover:text-ink hover:border-muted-gold transition-colors"
            >
              Clear
            </button>
          )}
        </div>

        {/* Error state */}
        {state === 'error' && errorMsg && (
          <div
            role="alert"
            className="rounded-xl border border-accent-red/30 bg-accent-red/8 px-4 py-3 text-sm text-accent-red lk-rise-sm"
          >
            <span className="font-semibold">Error — </span>{errorMsg}
          </div>
        )}

        {/* Result panel */}
        {state === 'done' && result && (
          <section
            aria-label="Extraction result"
            className="rounded-2xl border border-border bg-paper-old shadow-paper overflow-hidden lk-rise"
          >
            {/* Result header */}
            <div className="border-b border-border px-6 py-4 flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <h3 className="font-heading text-xl text-ink">{result.filename}</h3>
                <div className="flex flex-wrap items-center gap-3 text-xs text-temple-stone">
                  <span>{formatBytes(result.size_bytes)}</span>
                  <span className="text-border">·</span>
                  <span>{result.page_count} {result.page_count === 1 ? 'page' : 'pages'}</span>
                  <span className="text-border">·</span>
                  <span>{result.char_count.toLocaleString()} characters</span>
                </div>
              </div>
              <MethodBadge method={result.extraction_method} />
            </div>

            {/* OCR warning */}
            {result.ocr_unavailable && (
              <div className="mx-6 mt-4 rounded-lg border border-muted-gold/40 bg-muted-gold/8 px-4 py-3 text-sm text-brown-dark">
                <span className="font-semibold">OCR unavailable — </span>
                Tesseract is not installed on this server. The text below was extracted
                using PyMuPDF and may be sparse for scanned documents.
              </div>
            )}

            {/* Storage URL */}
            <div className="px-6 pt-4 pb-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-temple-stone mb-1.5">
                Stored at
              </p>
              <a
                href={result.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-clay-orange hover:underline break-all"
              >
                {result.file_url}
              </a>
            </div>

            {/* Extracted text */}
            <div className="px-6 pb-6 pt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold uppercase tracking-widest text-temple-stone">
                  Extracted Text
                </p>
                <button
                  id="copy-text-btn"
                  onClick={copyText}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-palmleaf/60 px-3 py-1 text-xs text-temple-stone hover:text-ink hover:border-muted-gold transition-colors"
                >
                  {copied ? (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Copied
                    </>
                  ) : (
                    <>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                      </svg>
                      Copy
                    </>
                  )}
                </button>
              </div>

              <pre
                id="extracted-text-output"
                className="max-h-[28rem] overflow-y-auto rounded-xl border border-border bg-cream p-4 text-sm leading-relaxed whitespace-pre-wrap break-words text-ink scroll-smooth"
                style={{ fontFamily: 'var(--font-bn-sans), var(--font-body), monospace' }}
              >
                {result.extracted_text || (
                  <span className="italic text-temple-stone">
                    No text was extracted. The document may be entirely image-based
                    and OCR is unavailable on this server.
                  </span>
                )}
              </pre>
            </div>
          </section>
        )}
      </main>

      {/* Subtle footer */}
      <footer className="border-t border-border mt-10 px-6 py-4 text-center text-xs text-temple-stone">
        LokKatha AI · Admin — PDF Ingestion · Phase 04
      </footer>
    </div>
  )
}
