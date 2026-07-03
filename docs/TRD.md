# Technical Research Document (TRD) – LokKatha AI

## 1. Overview
This document details the technical research, architecture, and implementation plan for LokKatha AI, focusing on ASR, multilingual LLM pipelines, vector databases, and retrieval‑augmented generation.

## 2. High‑Level Architecture (C4 Diagram)
```mermaid
graph TD
    C4_Context[System Context]
    C4_Context -->|Users| Users[Users]
    C4_Context -->|External Systems| External[External Systems]
    C4_Context -->|AI Components| AI[AI Components]
    AI -->|Processing| LLM[Gemma 4 LLM]
    AI -->|Storage| DB[(PostgreSQL)]
    AI -->|Embeddings| VDB[(ChromaDB)]
    AI -->|Analytics| BI[Analytics Dashboard]
    Users -->|Query| API[FastAPI]
    API -->|Retrieve| VDB
    API -->|Generate Answer| LLM
    LLM -->|Answer| API
```

## 3. Component Diagram (Class Diagram)
```mermaid
classDiagram
    class Interview {
        +String id
        +String audioPath
        +String language
        +DateTime recordedAt
    }
    class Transcript {
        +String interviewId
        +String text
        +String pipelineVersion
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
        +JSON metadata
    }
    Interview "1" *-- "1" Transcript : has
    Interview "1" *-- "1" Summary : produces
    Interview "1" *-- "1" Embedding : generates
    Interview "1" *-- "1" Metadata : stores
    Transcript "1" *-- "1" Embedding : triggers
```

## 4. Entity‑Relationship Diagram
```mermaid
erDiagram
    INTERVIEW ||--o{ TRANSCRIPT : has
    INTERVIEW ||--o{ SUMMARY : produces
    INTERVIEW ||--o{ EMBEDDING : generates
    TRANSCRIPT ||--o{ EMBEDDING : generates
    SUMMARY ||--o{ TAGS : generates
    EMBEDDING ||--o{ CHROMA : stores
    INTERVIEW ||--o{ METADATA : contains
    METADATA ||--o{ LANGUAGE : maps
```

## 5. Data Flow – Large Advanced Flowchart
```mermaid
flowchart LR
    A[Field Recording] --> B[Audio Pre‑processing (VAD, Denoise)]
    B --> C[Whisper ASR]
    C --> D[Raw Transcript]
    D --> E[Cleaning & Normalization]
    E --> F[Gemma 4: Title, Summary, Translations, Tags]
    F --> G[Metadata Extraction]
    G --> H[PostgreSQL: Store Interview, Transcript, Summary]
    H --> I[Gemma 4: Generate Embedding Description]
    I --> J[Embedding Model: Create Vector]
    J --> K[ChromaDB: Index Vector]
    K --> L[Hybrid Search (Dense + BM25)]
    L --> M[RAG Pipeline: Retrieve + Prompt]
    M --> N[Gemma 4: Generate Answer + Citations]
    N --> O[User Interface]
    style A fill:#ffcc00,stroke:#b8860b
    style O fill:#e74c3c,stroke:#c0392b
```

## 6. Model Performance XY Chart
```mermaid
scatter
    title WER (%) vs Language Coverage
    "Hindi" : 12, 0.95
    "Bengali" : 15, 0.92
    "Tamil" : 18, 0.90
    "Telugu" : 20, 0.88
    "Marathi" : 22, 0.85
    "Gujarati" : 25, 0.84
    "Odia" : 28, 0.80
```

## 7. Performance Distribution (Pie Chart)
```mermaid
pie
    title Model Size Distribution
    "1B" : 10
    "4B" : 25
    "12B" : 40
    "27B" : 25
```

## 8. Multi‑Layer Event Modeling
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

## 9. Research Task Kanban
```mermaid
flowchart LR
    A[Literature Survey] --> B[Dataset Collection]
    B --> C[Model Fine‑tuning]
    C --> D[Embedding Strategy]
    D --> E[RAG Pipeline Design]
    E --> F[Benchmarking]
    F --> G[Documentation]
    style G fill:#2ecc71,stroke:#1e8449
```

## 10. Timeline (Gantt) – Research Phase
```mermaid
gantt
    title Research Phase Timeline
    dateFormat  YYYY-MM
    section Literature
    Survey Papers        :a1, 2026-01, 1mo
    section Data
    Dataset Curation     :a2, after a1, 2mo
    section Model Development
    Fine‑tune ASR        :a3, after a2, 1mo
    Fine‑tune Gemma      :a4, after a3, 2mo
    section Evaluation
    Benchmarking         :a5, after a4, 1mo
    section Documentation
    Write Technical Docs :a6, after a5, 1mo
```

## 11. Mindmap – Technical Stack
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