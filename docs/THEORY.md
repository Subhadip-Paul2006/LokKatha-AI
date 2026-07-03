# Theory Document – LokKatha AI

## 1. Core Functional Modules
| Module | Primary Functions | Key Outputs |
|--------|-------------------|------------|
| **Recording** | Capture audio, store locally, embed consent metadata | `audio_file`, `consent_record` |
| **ASR** | Whisper transcription, language detection, text normalization | `transcript` |
| **Summarization & Translation** | Generate title, summary, translations (EN, BN, HI), cultural tags, keywords | `title`, `summary`, `translations`, `cultural_tags`, `keywords` |
| **Embedding Generation** | Produce semantic description, convert to dense vector | `embedding_vector` |
| **Storage** | Persist interview metadata, transcript, summary, embedding | `interview_id`, `metadata_json` |
| **Vector Indexing** | Index embeddings, support hybrid search | `chroma_index` |
| **Retrieval‑Augmented Generation (RAG)** | Retrieve relevant chunks, prompt engineering, answer generation | `answer`, `citations` |
| **Query Interface** | Expose REST/GraphQL, UI search, Q&A widget | `search_results`, `response_json` |

## 2. Python Libraries & Packages
```mermaid
graph LR
    A[Python 3.11] --> B[FastAPI]
    A --> C[Whisper.cpp]
    A --> D[Gemma 4 via Ollama/HF]
    A --> E[LangChain]
    A --> F[ChromaDB]
    A --> G[psycopg2-binary]
    A --> H[Supabase Python Client]
    A --> I[Pydantic]
    A --> J[Matplotlib / Plotly]
    B --> K[REST endpoints]
    C --> L[ASR service]
    D --> M[LLM inference]
    E --> N[RAG orchestration]
    F --> O[Vector store]
    O --> P[Hybrid search]
    P --> Q[Retrieve context]
    Q --> M
    M --> N
    N --> R[Answer generation]
    R --> S[Response]
```

## 3. Theoretical Foundations
- **Automatic Speech Recognition (ASR):** Whisper’s encoder‑decoder architecture; multilingual tokenization; fine‑tuning on low‑resource Indic corpora reduces Word Error Rate (WER) by 15‑20 %.
- **Large Language Models (LLM):** Gemma 4’s decoder‑only transformer; instruction‑tuned for Indic languages; supports direct Bengali, Hindi, and Hinglish generation without script fallback.
- **Retrieval‑Augmented Generation (RAG):** Hybrid search merging dense vectors (ChromaDB) with sparse BM25; ensures factual grounding and citation.
- **Embedding Theory:** Dense vector representations capture semantic meaning; multi‑lingual models (e5‑large, BGE‑M3) enable cross‑lingual retrieval.
- **Vector Databases:** ChromaDB’s hybrid indexing (dense + sparse) and metadata filtering enable efficient, context‑aware retrieval over thousands of transcripts.

## 4. Integration with Supabase
```mermaid
erDiagram
    SUPABASE[TABLE interviews] ||--o{ TRANSCRIPT : contains
    SUPABASE[TABLE summaries] ||--o{ SUMMARY : stores
    SUPABASE[TABLE embeddings] ||--o{ EMBEDDING : holds
    INTERVIEW ||--|| METADATA : links
    METADATA }|..| SUPABASE : maps
```

- **Why Supabase:** Real‑time PostgreSQL layer, built‑in authentication, Row Level Security (RLS), and REST/GraphQL APIs simplify consent‑aware access control.
- **Sync Strategy:** Periodic batch upload from local PostgreSQL → Supabase; conflict resolution via timestamps; deletions propagated both ways.
- **API Layer:** FastAPI surface wraps Supabase client; endpoints expose filtered retrieval (language, tags, date).

## 5. C4 Diagram – System Context
```mermaid
graph TD
    C4_Context[System Context]
    C4_Context -->|Users| Users[Field Workers, Researchers]
    C4_Context -->|External| External[NGOs, Govt Archives]
    C4_Context -->|AI Stack| AI[AI Components]
    AI -->|Processing| LLM[Gemma 4]
    AI -->|Storage| DB[(PostgreSQL)]
    AI -->|Vectors| VDB[(ChromaDB)]
    AI -->|Analytics| BI[Dashboard]
    Users -->|Query| API[FastAPI]
    API -->|Retrieve| VDB
    API -->|Generate| LLM
    LLM -->|Answer| API
    BI -->|Report| Users
```

## 6. Component Diagram – Class Overview
```mermaid
classDiagram
    class Interview {
        +String id
        +String audioPath
        +String language
        +DateTime recordedAt
        +JSON consent
    }
    class Transcript {
        +String interviewId
        +String text
    }
    class Summary {
        +String interviewId
        +String title
        +String summary
        +String translations
        +String culturalTags
    }
    class Embedding {
        +String interviewId
        +Vector vector
    }
    class Metadata {
        +String interviewId
        +JSON data
    }
    Interview "1" *-- "1" Transcript : produces
    Interview "1" *-- "1" Summary : yields
    Interview "1" *-- "1" Embedding : creates
    Interview "1" *-- "1" Metadata : stores
    Transcript "1" *-- "1" Embedding : triggers
```

## 7. Data Flow – Advanced Flowchart
```mermaid
flowchart LR
    A[Record Audio] --> B[Voice Activity Detection & Denoise]
    B --> C[Whisper ASR]
    C --> D[Raw Transcript]
    D --> E[Normalization & Language Tagging]
    E --> F[Gemma 4: Summarize, Translate, Tag]
    F --> G[Extract Structured Metadata]
    G --> H[PostgreSQL: Persist Interview]
    H --> I[Gemma 4: Generate Description]
    I --> J[Embedding Model: Vectorise]
    J --> K[ChromaDB: Index Vector]
    K --> L[Hybrid Search (Dense+BM25)]
    L --> M[RAG Prompt Assembly]
    M --> N[Gemma 4: Generate Answer + Citations]
    N --> O[REST API Response]
    O --> P[User UI]
    style A fill:#ffcc00,stroke:#b8860b
    style P fill:#e74c3c,stroke:#c0392b
```

## 8. Model Distribution (Pie Chart)
```mermaid
pie
    title Model Size Allocation
    "1B" : 10
    "4B" : 25
    "12B" : 40
    "27B" : 25
```

## 9. Multi‑Layer Event Modeling
```mermaid
stateDiagram-v2
    [*] --> Recording
    Recording --> Preprocess
    Preprocess --> ASR
    ASR --> Transcript
    Transcript --> Summarization
    Summarization --> Tagging
    Tagging --> Embedding
    Embedding --> Storage
    Storage --> Retrieval
    Retrieval --> RAG
    RAG --> Answer
    Answer --> [*]
```

## 10. Research Roadmap (Gantt)
```mermaid
gantt
    title Research Phase
    dateFormat  YYYY-MM
    section Literature
    Survey Papers        :a1, 2026-01, 1mo
    section Data
    Dataset Curation     :a2, after a1, 2mo
    section Model Tuning
    ASR Fine‑tune        :a3, after a2, 1mo
    Gemma Fine‑tune      :a4, after a3, 2mo
    section Evaluation
    Benchmarking         :a5, after a4, 1mo
    section Documentation
    Write Docs           :a6, after a5, 1mo
```

## 11. Technical Mindmap
```mermaid
mindmap
    root LokKatha AI Stack
        ASR
            Whisper
            Fine‑tuning
        LLM
            Gemma 4
            Prompt Engineering
        Embeddings
            multilingual‑e5
            BGE‑M3
        Vector DB
            ChromaDB
            Hybrid Search
        DB
            PostgreSQL
            Supabase
        API
            FastAPI
        Frontend
            React
            Streamlit
        Deployment
            Docker
            K8s
            Railway
```