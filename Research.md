# Research Document — LokKatha AI
## India's Living Cultural Memory: Research & Feasibility Analysis

> **Document Version:** 1.0  
> **Date:** July 2026  
> **Purpose:** Technical, ethical, and domain research to inform the architecture and implementation of LokKatha AI — a multilingual, AI-powered cultural preservation platform for Indian oral traditions.

---

## Table of Contents

1. [Domain Research: The Crisis of Oral Knowledge in India](#1-domain-research-the-crisis-of-oral-knowledge-in-india)
2. [Existing Initiatives & Competitive Landscape](#2-existing-initiatives--competitive-landscape)
3. [Technical Research: ASR for Indian Languages](#3-technical-research-asr-for-indian-languages)
4. [Technical Research: LLMs & Gemma 4 for Indic Languages](#4-technical-research-llms--gemma-4-for-indic-languages)
5. [Technical Research: RAG & Vector Databases](#5-technical-research-rag--vector-databases)
6. [Ethical, Legal & Cultural Framework](#6-ethical-legal--cultural-framework)
7. [System Architecture Recommendations](#7-system-architecture-recommendations)
8. [Risk Assessment & Mitigation](#8-risk-assessment--mitigation)
9. [References](#9-references)

---

## 1. Domain Research: The Crisis of Oral Knowledge in India

### 1.1 The Scale of the Problem

India is home to over **1.4 billion people** speaking **22 officially recognised languages** and hundreds of dialects. A significant portion of traditional and local knowledge — agricultural practices, folk medicine, artisanal techniques, folklore, and family histories — exists only in oral form, passed down through generations. As older generations pass away, this knowledge is being lost at an unprecedented rate.

Key vulnerable domains include:
- **Traditional Ecological Knowledge (TEK):** Indigenous farming, water management, and biodiversity practices
- **Oral Folklore & Mythology:** Folk tales, songs, and epics that vary by region and caste
- **Artisanal Crafts:** Techniques of pottery, weaving, metalwork, and painting rarely documented
- **Local Histories:** Community memories of partition, migration, famine, and social movements
- **Linguistic Diversity:** Many tribal languages and dialects face extinction with no digital record

### 1.2 Why Documentation Fails

Despite government and NGO efforts, several structural barriers prevent effective preservation:

| Barrier | Description |
|---------|-------------|
| **Linguistic Diversity** | Over 60 languages spoken; most ASR and NLP tools are English-centric |
| **Low Digital Literacy** | Rural elders and field volunteers often lack technical training |
| **Infrastructure Gaps** | Intermittent connectivity, limited device access in remote areas |
| **No Standardised Protocols** | Lack of unified metadata, consent, and archival standards for oral history |
| **Funding & Sustainability** | Projects often start with grants but lack long-term maintenance |

### 1.3 The Opportunity

AI — specifically **ASR (Automatic Speech Recognition)**, **LLM-based translation/summarisation**, and **semantic search** — offers a scalable path to document, translate, and make accessible oral histories that were previously too labour-intensive to preserve. However, this must be done within a robust ethical framework that respects narrator agency and community sovereignty.

---

## 2. Existing Initiatives & Competitive Landscape

### 2.1 Government & Institutional Archives

**National Cultural Audiovisual Archive (NCAA)**  
Operated by the Indira Gandhi National Centre for the Arts (IGNCA), NCAA is a centralised repository for digitised ethnographic materials and audiovisual records of Indian cultural heritage. It provides a model for structured metadata but is not AI-powered and has limited community participation.

**Abhilekh Patal (National Archives of India)**  
A digital repository offering access to India's historical documents. While extensive, it focuses on written records rather than oral histories and lacks multilingual semantic search capabilities.

**Gyan Bharatam Mission**  
Launched for manuscript digitisation, with MoUs signed with over 40 institutions. It focuses on written manuscripts (Ayurveda, Unani, Siddha) rather than living oral traditions.

**Traditional Knowledge Digital Library (TKDL)**  
A CSIR-AYUSH initiative digitising traditional medicinal knowledge to prevent biopiracy. It demonstrates the value of structured digital preservation but is closed-access and focused on textual manuscripts, not oral narratives.

### 2.2 NGO & Community Projects

**Program for the Archiving of Science and Technology (PAST) — NCBS**  
A recent grant programme (2025–26) funding projects like "Pastoral Legacies: Digitizing Maldhari Heritage" which archives oral histories from nomadic pastoralists in Gujarat. This validates the demand for community-led oral history digitisation.

**Ancestral Knowledge & Science among North Maharashtra's Indigenous People**  
Documenting traditional ecological knowledge (TEK) held by Adivasi communities through oral traditions. This project highlights the intersection of environmental conservation and oral history.

### 2.3 Technology Gaps in Existing Solutions

| Feature | Existing Archives | LokKatha AI Opportunity |
|---------|-------------------|------------------------|
| AI-powered ASR for Indian languages | ❌ Rare / English only | ✅ Core feature |
| Automatic translation (EN ↔ BN ↔ HI) | ❌ Manual / absent | ✅ Automated pipeline |
| Semantic search over transcripts | ❌ Keyword only | ✅ Vector-based RAG |
| Community consent & access control | ⚠️ Varies | ✅ Built-in ethical framework |
| Offline-first field recording | ❌ Cloud-dependent | ✅ Designed for low connectivity |
| NGO analytics dashboard | ❌ Absent | ✅ Impact measurement tools |

---

## 3. Technical Research: ASR for Indian Languages

### 3.1 The Challenge

Indian languages present unique challenges for ASR:
- **Low-Resource Status:** Many languages lack extensive annotated audio-text datasets
- **Code-Switching:** Spontaneous Hindi-English (Hinglish) mixing is ubiquitous in urban and semi-urban speech
- **Dialectal Diversity:** Hindi alone has dozens of dialects (Bhojpuri, Rajasthani, Awadhi) that differ significantly from Standard Hindi
- **Phonetic Overlap:** Similar sounds across Dravidian and Indo-Aryan language families cause confusion in multilingual models

Research indicates that over **300 million people in India cannot read**, making ASR not just a convenience but a critical accessibility tool.

### 3.2 Whisper as the Baseline

**OpenAI Whisper** (released September 2022) is the current state-of-the-art open-source ASR model, trained on **680,000 hours** of multilingual data. It supports transcription and translation across nearly 100 languages.

**Performance on Indian Languages:**
- Whisper achieves baseline functionality for Hindi, Bengali, Tamil, Telugu, Gujarati, Marathi, and Kannada
- However, Word Error Rate (WER) is significantly higher for Indian languages compared to English
- Research shows that **prompt-tuning with language family information** and **custom tokenizers** can reduce WER by up to 15–20% for Indian languages
- For code-mixed Hindi-English speech, standard Whisper struggles with language switch points, though fine-tuning with synthetic data improves performance

**Key Research Findings:**
> "Whisper's effectiveness in Indian languages is hampered by deficiencies in tokenization. The tokenization process, which is crucial for ASR speed, affects low-resource languages more heavily. High-resource languages benefit from extensive token sets, whereas low-resource languages face slower inference times due to fewer tokens in the pre-trained Whisper tokenizer."

### 3.3 Recommended ASR Strategy

| Component | Recommendation | Rationale |
|-----------|---------------|-----------|
| **Base Model** | Whisper `large-v3` or `medium` | Best multilingual zero-shot performance |
| **Fine-Tuning** | Indic-specific datasets (Vistaar, CLSRIL-23, Common Voice) | Improves WER for Bengali, Hindi, Tamil, etc. |
| **Tokenizer Optimisation** | Custom BPE tokenizer for Indic scripts | Reduces inference time and improves accuracy |
| **Code-Switching** | On-the-fly data simulation + language prompts | Handles Hinglish and regional code-mixing |
| **Preprocessing** | Noise reduction (RNNoise), VAD (Voice Activity Detection) | Critical for field recordings with background noise |
| **Segmentation** | WhisperX for long-form audio | Accurate timestamping and speaker diarisation |

### 3.4 Datasets for Fine-Tuning

- **Vistaar:** Diverse benchmarks and training sets for Indian language ASR
- **CLSRIL-23:** Cross-lingual speech representations for Indic languages
- **Mozilla Common Voice:** Crowdsourced datasets for Hindi, Bengali, Tamil, and others
- **Google Fleurs:** Multilingual speech recognition benchmark including Indic languages
- **Kathbath:** Code-mixed and noisy speech corpus for Indian languages

---

## 4. Technical Research: LLMs & Gemma 4 for Indic Languages

### 4.1 Why Gemma 4?

**Google Gemma 4** (released 2026) is an open-weight model (Apache 2.0 licence) available in variants from 1B to 27B parameters. It is the designated target model for LokKatha AI for several reasons:

**Superior Indic Language Performance:**
- Direct comparisons show Gemma 4 outperforms GPT-4o-mini on Indian language tasks
- **Bengali:** Gemma 4 produces fluent, structured responses in proper Bengali script; GPT-4o-mini has been observed to fail entirely by echoing the prompt back
- **Hindi:** Gemma 4 correctly uses Devanagari script without prompting, understands formal vs. casual registers, and handles cultural nuance (e.g., translating "millions" to "करोड़ों" rather than "लाख")
- **Hinglish:** Both models handle code-switching well, but Gemma 4 captures emotional and poetic tone more naturally

**Google's Institutional Knowledge:**
> "Google has been building Indian language products for years — Google Translate, Google Search in Indic scripts, Google Assistant in Hindi. That corpus and institutional knowledge almost certainly shaped Gemma's training data in ways a model primarily optimised for English-language internet text would not replicate."

**Deployment Flexibility:**
- **1B/4B variants:** Can run on CPU or edge devices for offline field use
- **12B/27B variants:** Require GPU but offer superior reasoning for complex summarisation and translation
- Available via Hugging Face, Google AI Studio, Vertex AI, and local inference tools (Ollama, LM Studio)

### 4.2 Model Selection Matrix

| Use Case | Recommended Model | Hardware | Notes |
|----------|-------------------|----------|-------|
| **Offline field transcription** | Gemma 4 1B / 4B | Laptop / Raspberry Pi | Low latency, basic summarisation |
| **Server-side translation & tagging** | Gemma 4 12B | 16–24GB GPU | Balanced quality and speed |
| **Complex RAG Q&A** | Gemma 4 27B | 24GB+ GPU | Best reasoning, multi-hop queries |
| **API fallback** | Gemma 4 via Vertex AI | Cloud | Scalable, managed infrastructure |

### 4.3 Prompt Engineering for Cultural Preservation

The LLM prompt must be carefully designed to act as an **Indian cultural historian** rather than a generic assistant. Key prompt design principles:

1. **Persona Anchoring:** "You are an Indian cultural historian specialising in oral traditions..."
2. **Structured Output:** Enforce JSON schema for title, summary, translations, tags, and embeddings
3. **Cultural Context:** Request historical importance, regional significance, and connections to broader cultural movements
4. **Multi-Lingual Instruction:** Explicitly request translations in English, Bengali, and Hindi with register awareness (formal vs. folk)
5. **Embedding Generation:** Request a dense semantic description that can be vectorised for search

---

## 5. Technical Research: RAG & Vector Databases

### 5.1 Why RAG for Oral History?

Retrieval-Augmented Generation (RAG) is essential for LokKatha AI because:
- It grounds LLM answers in **actual recorded narratives**, preventing hallucination
- It enables **semantic search** across thousands of transcripts without exact keyword matching
- It supports **cross-lingual retrieval** — a query in English can retrieve relevant Bengali or Hindi transcripts via embedding similarity
- It allows **attribution** — every answer can cite the specific interview and timestamp it was derived from

### 5.2 ChromaDB as the Vector Store

**ChromaDB** is an open-source vector database (Apache 2.0) designed for AI applications. It is the recommended choice for LokKatha AI.

**Key Features:**
- **In-memory + Persistent Storage:** Fast queries with SQLite-backed persistence
- **Multi-modal Retrieval:** Dense vector search, sparse vector search (BM25, SPLADE), full-text search, and metadata filtering in a single query
- **Embedding Integration:** Native support for Hugging Face, OpenAI, Google, and custom embedding models
- **LangChain / LlamaIndex Compatible:** Seamless integration with RAG pipelines
- **Scalability:** Supports millions of records per collection; client-server mode for production

**Performance Benchmarks (ChromaDB Cloud):**
- Query latency @ 384 dim, 100k vectors: p50 = 20ms (warm), p99 = 57ms
- Write throughput: 30 MB/s per collection
- Collections per database: 1M
- Records per collection: 5M

**Comparison with Alternatives:**

| Feature | ChromaDB | Pinecone | Faiss | Weaviate |
|---------|----------|----------|-------|----------|
| Open Source | ✅ | ❌ | ✅ | ✅ |
| Self-Hosted | ✅ | ❌ | ✅ | ✅ |
| Sparse Vectors | ✅ | ❌ | ❌ | ⚠️ |
| Metadata Filtering | ✅ | ✅ | ⚠️ | ✅ |
| Ease of Use | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| Enterprise Scale | ⚠️ | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |

### 5.3 Embedding Strategy

For a multilingual archive, embedding selection is critical:

**Recommended Models:**
- **multilingual-e5-large** (Microsoft): Strong performance across 100+ languages, optimised for retrieval
- **LaBSE** (Google): Language-agnostic BERT sentence embedding, excellent for cross-lingual similarity
- **BGE-M3** (BAAI): Supports dense, sparse, and multi-vector representations simultaneously
- **Gemma 4-generated embeddings:** Use the model itself to generate semantic descriptions, then embed those

**Hybrid Search Approach:**
Combine dense vector search (semantic meaning) with sparse vector search (BM25 for exact keyword matches) and metadata filtering (language, region, date, cultural tags) for optimal retrieval quality.

### 5.4 RAG Pipeline Architecture

```
User Query → Query Embedding → ChromaDB Hybrid Search
                                              ↓
                    Retrieved Chunks (Top-K) + Metadata
                                              ↓
                    Prompt Engineering (Context + Query)
                                              ↓
                    Gemma 4 LLM → Generated Answer + Citations
```

**Chunking Strategy for Oral History:**
- Segment transcripts by **topic shifts** (detected via embedding similarity drops) rather than fixed token counts
- Preserve **speaker boundaries** — never split a speaker's turn mid-sentence
- Include **metadata in chunks:** speaker name, location, date, language, cultural tags
- Overlap chunks by 10–15% to maintain context across segment boundaries

---

## 6. Ethical, Legal & Cultural Framework

### 6.1 Informed Consent: The Foundation

Informed consent is both a **legal requirement** and an **ethical imperative** in oral history work. For LokKatha AI, consent must be:

- **Free:** Given without coercion, pressure, or financial exploitation
- **Prior:** Obtained before any recording begins
- **Informed:** Narrators must understand the full scope — how recordings will be stored, processed by AI, translated, shared, and archived
- **Ongoing:** Consent is not a one-time event; narrators must be able to withdraw or restrict access at any time

**Key Elements of the Consent Process:**
1. **Purpose & Scope:** Explain the AI processing (transcription, translation, semantic search) in accessible language
2. **Data Handling:** Clarify storage in PostgreSQL and ChromaDB, cloud vs. local, encryption standards
3. **Access & Privacy:** Who can search the archive? Will the narrator's name be public? Can segments be restricted?
4. **Commercial Use:** Explicitly state whether content may be used in products, books, or media
5. **Voice Cloning:** If voice synthesis is ever considered, this requires separate, explicit consent
6. **Withdrawal Rights:** Narrators can request deletion at any time; the system must support cascading deletion from both SQL and vector stores

### 6.2 Community Sovereignty & Indigenous Knowledge

Working with indigenous and marginalised communities requires additional safeguards:

- **Collective Consent:** In some communities, individual consent is insufficient; community elders or councils must approve the project
- **Cultural Protocols:** Sacred or restricted knowledge must never be recorded or must be flagged for restricted access
- **Copyright Ownership:** Narrators should retain copyright; the project should operate under a licence (e.g., Creative Commons BY-NC) rather than assignment
- **Benefit Sharing:** Communities must benefit from the archive — through access, education, or revenue sharing

**Principles from Indigenous Research Ethics:**
> "Indigenous people should be recognised as the primary guardians and interpreters of their cultures, arts and science... The right to learn and use indigenous knowledge can be acquired only in accordance with the laws or customary procedures of the indigenous persons concerned and with their free and informed consent."

### 6.3 Data Privacy & Security

- **Encryption:** AES-256 for data at rest; TLS 1.3 for data in transit
- **Anonymisation Options:** Allow narrators to use pseudonyms or request redaction of sensitive details
- **Access Control:** Role-based access (admin, researcher, public) with field-level restrictions
- **Geofencing:** For sensitive content, restrict access to specific IP ranges or require additional authentication
- **Audit Logs:** Track who accessed what content and when

### 6.4 AI-Specific Ethical Considerations

- **Hallucination Mitigation:** RAG grounding reduces but does not eliminate hallucination; always provide source attribution
- **Translation Fidelity:** AI translations may lose cultural nuance, idioms, and emotional tone; flag machine-translated content and enable community review
- **Bias in ASR:** Whisper and other models may perform worse on certain dialects, accents, or age groups; monitor WER by demographic and prioritise improvement
- **Voice Cloning:** The document mentions "elder voice cloning" as a mini-challenge — this is highly sensitive and requires separate ethical review, informed consent, and should never be deployed without community approval

---

## 7. System Architecture Recommendations

### 7.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    LOKKATHA AI PLATFORM                      │
├─────────────────────────────────────────────────────────────┤
│  FIELD LAYER          │  PROCESSING LAYER    │  ACCESS LAYER│
│  ─────────────────    │  ──────────────────  │  ───────────│
│  • Mobile/Web app     │  • Whisper ASR       │  • Search UI│
│  • Offline recorder   │  • Gemma 4 LLM       │  • RAG Q&A  │
│  • Audio upload       │  • Translation       │  • Admin    │
│  • Consent capture     │  • Embedding gen       │  • Analytics│
│                       │  • Metadata extraction │             │
├─────────────────────────────────────────────────────────────┤
│  STORAGE LAYER                                               │
│  • PostgreSQL (metadata, transcripts, consent)              │
│  • ChromaDB (embeddings, semantic search)                    │
│  • Object Storage (audio files, backups)                    │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Technology Stack

| Layer | Technology | Justification |
|-------|-----------|---------------|
| **Backend API** | FastAPI (Python) | High performance, async support, excellent for ML model serving |
| **Frontend** | Streamlit (MVP) / React (Production) | Streamlit for rapid prototyping; React for scalable UI |
| **ASR** | Whisper (OpenAI) + Fine-tuned variants | SOTA multilingual ASR; adaptable to Indian languages |
| **LLM** | Gemma 4 (1B–27B) | Superior Indic language support; open weights; local deployable |
| **Embeddings** | multilingual-e5-large / BGE-M3 | Optimised for cross-lingual retrieval |
| **Vector DB** | ChromaDB | Open source, hybrid search, LangChain compatible |
| **Relational DB** | PostgreSQL | Robust, supports JSONB for flexible metadata, widely supported |
| **Orchestration** | LangChain / LlamaIndex | Standard RAG pipeline abstractions |
| **Deployment** | Docker + Railway / Render / GCP Cloud Run | Portable, scalable, cost-effective |
| **Offline Mode** | Ollama + Local ChromaDB | Essential for fieldwork with no connectivity |

### 7.3 Offline-First Strategy

For fieldworkers in rural India with intermittent connectivity:

1. **Progressive Web App (PWA):** Record audio offline; sync when connected
2. **Local Whisper:** Run `whisper.cpp` or `faster-whisper` on lightweight hardware
3. **Local Gemma 4 4B:** Use Ollama or LM Studio for basic summarisation and tagging
4. **SQLite + Local ChromaDB:** Store recordings and embeddings locally; sync to central PostgreSQL/ChromaDB cloud instance when online
5. **Conflict Resolution:** Timestamp-based sync with manual review for conflicting edits

---

## 8. Risk Assessment & Mitigation

### 8.1 Technical Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **High WER for dialects** | High | High | Fine-tune on regional datasets; implement human-in-the-loop review |
| **LLM hallucination in summaries** | Medium | High | RAG grounding; source attribution; community review workflow |
| **Translation quality loss** | High | Medium | Flag MT content; enable community editor roles; use back-translation QA |
| **Vector DB scalability** | Medium | Medium | Start with ChromaDB; migrate to Pinecone/Weaviate if >5M records |
| **API rate limits / costs** | Medium | Medium | Cache responses; implement request queuing; use local models where possible |
| **Data loss** | Low | Critical | Automated backups; replicate across regions; version control for audio |

### 8.2 Ethical & Legal Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Consent violations** | Medium | Critical | Multi-layer consent forms; audio recording of verbal consent; audit trails |
| **Cultural appropriation** | Medium | High | Community advisory boards; restricted access flags; benefit-sharing agreements |
| **Privacy breaches** | Low | Critical | Encryption; pseudonymisation; access controls; regular security audits |
| **Voice cloning misuse** | Low | High | Separate consent process; never deploy without community approval; watermarking |
| **Biased AI outputs** | Medium | Medium | Monitor WER and translation quality by demographic; diverse training data |

### 8.3 Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| **Volunteer turnover** | High | Medium | Comprehensive documentation; simple UI; training videos |
| **Funding discontinuity** | Medium | High | Open-source community; grant diversification; freemium model for institutions |
| **Device theft/damage in field** | Medium | Medium | Encrypted devices; cloud sync; rugged hardware recommendations |
| **Low digital literacy** | High | Medium | Simplified UI; voice-guided interfaces; local language support |

---

## 9. References

### Academic & Technical Sources

1. Tripathi, K., Gothi, R., & Wasnik, P. (2024). *Enhancing Whisper's Accuracy and Speed for Indian Languages through Prompt-Tuning and Tokenization*. arXiv. — Demonstrates 15–20% WER reduction for Indian languages via custom tokenizers and language-family prompting.

2. Biswas, A., et al. (2025). *Adapting Whisper for low-resource Hindi-English Code-Mixed ASR*. INTERSPEECH. — Explores synthetic data generation and language prompt strategies for code-switching.

3. Bhogale, K., et al. (2023). *Vistaar: Diverse Benchmarks and Training Sets for Indian Language ASR*. INTERSPEECH. — Key dataset for fine-tuning Indian language ASR.

4. IIT Bombay CFILT. (2023). *Survey: Automatic Speech Recognition For Indian Languages*. — Comprehensive overview of ASR challenges and solutions for Indian languages.

5. DevSaquib. (2026). *I Tested Gemma 4 and GPT-4o-mini on Indian Language Tasks*. Dev.to. — Practical comparison showing Gemma 4's superiority in Bengali, Hindi, and Hinglish.

6. MindStudio. (2026). *What Is Google Gemma 4? The Apache 2.0 Open-Weight Model With Native Audio and Vision*. — Overview of Gemma 4 capabilities, licensing, and deployment options.

7. Davis, C. (2025). *A Comparative Study of WARC-GPT and a Custom Pipeline*. Code4Lib Journal. — RAG implementation patterns for archival collections.

8. SISSA. (2025). *Leveraging Knowledge Graph-Enhanced RAG and LLMs for Historical Archival Analysis*. — Advanced RAG architecture for historical documents.

### Ethical & Legal Sources

9. Oral History Association. *Guidelines for Social Justice Oral History Work*. — Framework for narrator-centered, power-sharing oral history practice.

10. National Park Service. *Considering Legal and Ethical Issues in Oral History*. — Standard reference for informed consent, copyright, and stewardship.

11. AIATSIS. (2020). *Guidelines for Ethical Research in Australian Indigenous Studies*. — Gold standard for indigenous knowledge protection and FPIC (Free, Prior, and Informed Consent).

12. Schellnack-Kelly, I.S. (2022). *Research ethics to consider when collecting oral histories*. Scielo. — Discussion of autonomy, collective consent, and indigenous knowledge rights.

13. Oral History Society (UK). *Is your oral history legal and ethical?* — Practical guide to consent forms, copyright, and clearance procedures.

14. Oral History Australia. *Ethics and university research*. — Guidance on anonymity, copyright, and sensitive topics.

### Institutional & Government Sources

15. PIB Delhi. (2026). *Digital Cultural Governance and Monitoring of Cultural Initiatives*. — Overview of government digital platforms: NCAA, Gyan Bharatam, Abhilekh Patal, TKDL.

16. NCBS Archives. (2026). *Program for the Archiving of Science and Technology (PAST) 2025-26*. — Grant programme supporting community oral history projects in India.

17. NIILM University. *Digital Preservation of Traditional Knowledge: Safeguarding Indigenous Heritage through Modern Tools*. — Analysis of TKDL, UNESCO, and global best practices.

### Technical Documentation

18. ChromaDB Documentation. *The open-source search infrastructure for AI*. — Official docs covering vector search, sparse search, metadata filtering, and deployment.

19. DataCamp. (2023). *Learn How to Use Chroma DB: A Step-by-Step Guide*. — Practical tutorial for RAG implementation with ChromaDB.

20. AltexSoft. (2026). *The Good and Bad of ChromaDB for RAG: Based on Our Experience*. — Production insights on hybrid search, BM25 integration, and limitations.

---

*End of Research Document*
