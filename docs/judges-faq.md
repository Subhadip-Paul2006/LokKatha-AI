# Judges FAQ (Hackathon Pitch Guide)

This document is designed to anticipate and answer technical and product questions from hackathon judges regarding LokKatha AI.

### 1. Why did you choose Google Gemma over OpenAI/Anthropic?
Google Gemma is an open-weights model built from the same research as the Gemini models. By using Gemma via Google AI studio, we optimized for:
1. **Speed & Efficiency**: Gemma 2.5 Flash is incredibly fast, allowing us to build a fluid, real-time storytelling UI.
2. **Cultural Nuance**: The model demonstrates a strong baseline understanding of Indic mythology, which when augmented with our RAG pipeline, produces highly accurate Bengali folklore narratives.

### 2. Why use a Retrieval-Augmented Generation (RAG) approach instead of fine-tuning?
Folklore is inherently diverse and regional. A single character (e.g., *Behula*) might have three different endings depending on the district of origin. 
- **Fine-tuning** merges these variations into one statistical average, destroying the anthropological truth.
- **RAG** allows us to inject the *exact* regional context into the prompt in real-time, preserving the exact source material and allowing us to cite our sources (Book, Page, Region) in the UI.

### 3. Why Supabase and pgvector?
Supabase provides an open-source PostgreSQL foundation. By using the `pgvector` extension, we were able to store our structured anthropological metadata (Era, Language, Region) right next to our high-dimensional embedding vectors. This allows us to perform Hybrid Search (semantic similarity + SQL metadata filtering) in a single database query, returning results in under 50ms.

### 4. How did you handle data extraction from old Bengali manuscripts?
Extracting text from scanned PDFs of 1907 manuscripts (like *Thakurmar Jhuli*) is difficult. We built a custom Python extraction pipeline (Phase 4 of the project) that:
1. Uses advanced OCR.
2. Chunks the text semantically (by paragraph/story, not just arbitrary token limits).
3. Uses an LLM to generate summaries and metadata for each chunk before embedding.

### 5. What happens if the API rate-limits during the demo?
We implemented **Demo Resilience Mode**. If the AI orchestration layer detects a timeout, API failure, or rate limit, the system gracefully falls back. Instead of crashing, it immediately serves the retrieved context from the Supabase database alongside a pre-curated fallback message, ensuring the UI experience remains uninterrupted.

### 6. What is the future scope of LokKatha AI?
1. **Multi-modal RAG**: Embedding the actual Terracotta and Palm-leaf illustrations so the AI can retrieve visual context.
2. **Voice AI**: We currently use Web Speech APIs, but future versions will use advanced TTS models trained on regional Bengali/Indic dialects.
3. **Crowdsourced Preservation**: Allowing rural storytellers to record audio directly into the app, which is then transcribed, embedded, and added to the living archive.
