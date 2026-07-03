# LokKatha AI — India's Living Cultural Memory

## 🌟 Overview
LokKatha AI is a multilingual, AI-powered platform designed to preserve India's endangered oral traditions, folklore, and traditional knowledge. By combining SOTA ASR (Whisper) and LLMs (Gemma 4), it transforms raw audio interviews into a structured, searchable, and interactive cultural archive.

## 📂 Project Structure
```text
lokkatha-ai/
├── app.py                 # Main FastAPI application
├── whisper_service.py      # ASR pipeline (Speech-to-Text)
├── gemma.py               # LLM logic for translation/summarization
├── embeddings.py          # Vectorization logic
├── database.py            # PostgreSQL/Supabase connection
├── rag.py                 # Retrieval-Augmented Generation logic
├── interview.py           # Interview management
├── prompts/               # System prompts for Gemma 4
├── uploads/               # Raw audio storage
├── docs/                  # Project Documentation
│   ├── README.md          # General Overview
│   ├── PRD.md             # Product Requirements
│   ├── TRD.md             # Technical Requirements
│   ├── THEORY.md          # Theoretical Framework
│   └── USAGE_DEPLOYMENT.md # Setup and Deployment
├── requirements.txt       # Python dependencies
└── README.md              # Root guide
```

## 🛠 High-Level Architecture
```mermaid
graph TD
    A[Field Volunteer] -->|Audio Record| B(Audio Upload)
    B --> C[Whisper ASR]
    C -->|Transcript| D[Gemma 4 LLM]
    D -->|Summary/Tags/Trans| E[(Supabase PostgreSQL)]
    D -->|Embeddings| F[(ChromaDB / pgvector)]
    G[End User] -->|Query| H[RAG Engine]
    H -->|Retrieve Context| F
    H -->|Context + Query| I[Gemma 4]
    I -->|Intelligent Answer| G
```

## 🗺 User Journey
```mermaid
journey
    title User Journey for Cultural Preservation
    section Recording
      Volunteer records elder: 5: Volunteer, Elder
      Upload to Platform: 4: Volunteer
    section AI Processing
      ASR Transcription: 3: System
      Multilingual Translation: 3: System
      Cultural Tagging: 4: System
    section Discovery
      User searches "Ancient Farming": 5: Researcher
      RAG provides cited answer: 5: System
```

## 📈 Development Roadmap (Gantt)
```mermaid
gantt
    title LokKatha AI Implementation Timeline
    dateFormat  YYYY-MM-DD
    section Core Pipeline
    ASR Implementation       :a1, 2026-07-04, 14d
    Gemma 4 Integration      :a2, after a1, 14d
    Supabase/Vector DB Setup  :a3, after a2, 10d
    section RAG & UI
    RAG Engine Development    :b1, after a3, 20d
    Frontend Development      :b2, after a3, 20d
    section Testing & Deployment
    Beta Testing              :c1, after b1, 15d
    Final Deployment         :c2, after c1, 7d
```

## 🔗 Quick Links
- [Product Requirements (PRD)](docs/PRD.md)
- [Technical Requirements (TRD)](docs/TRD.md)
- [Theoretical Framework (THEORY)](docs/THEORY.md)
- [Usage & Deployment](docs/USAGE_DEPLOYMENT.md)
