# Data Import Pipeline

This document describes Phase 4 of LokKatha AI: The Knowledge Extraction Pipeline.

## 1. The Challenge
Bengali folklore exists primarily in scanned PDFs, physical books, and unstructured web archives. We needed a reliable way to clean, chunk, and embed this data into Supabase.

## 2. Pipeline Steps

### A. OCR & Text Cleaning
We utilized Python-based OCR libraries to extract raw text from scanned archives.

### B. Semantic Chunking
Instead of splitting text by token count (e.g., every 500 words), we used a custom script to split text at natural narrative boundaries (chapters or individual stories). This ensures that a single embedding vector represents a complete, cohesive thought.

### C. AI Metadata Enrichment
Before embedding, we ran each chunk through a lightweight LLM script to extract:
- Title
- Characters
- Summary
- Region/Language

### D. Supabase Ingestion
Finally, the enriched JSON payload was sent to Supabase. Supabase automatically calculated the 768-dimensional `embedding` using a PostgreSQL trigger.

## 3. Versioning
Every imported document carries `import_version` and `pipeline_version` metadata. This allows us to safely re-run the pipeline in the future to upgrade summaries or embedding models without deleting user data.
