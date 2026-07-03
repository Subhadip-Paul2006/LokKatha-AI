# LokKatha AI

## Project Summary
LokKatha AI is a multilingual platform for preserving India's oral cultural heritage using AI.

## Core Technologies
- Whisper ASR for transcription
- Gemma 4 for translation, summarization, tagging, and embeddings
- PostgreSQL for metadata
- ChromaDB for vector embeddings
- FastAPI backend
- React/Streamlit frontend

## Architecture Overview
```mermaid
graph LR
    A[Field Recording] --> B[Whisper ASR]
    B --> C[Gemma 4 Processing]
    C --> D[PostgreSQL]
    C --> E[ChromaDB]
    D --> F[API]
    E --> F
    F --> G[User Interface]
```

## Key Diagrams
- **Entity Relationship Diagram**
```mermaid
erDiagram
    INTERVIEW ||--o{ TRANSCRIPT : has
    TRANSCRIPT ||--o{ EMBEDDING : generates
    EMBEDDING ||--o{ CHROMA : stores
    INTERVIEW }|--|| METADATA : contains
```

- **C4 Diagram (Context)**
```mermaid
graph TD
    C4_Context[System Context]
    C4_Context -->|Users| USERS[Users]
    C4_Context -->|External| EXTERNAL[External Systems]
    C4_Context -->|AI| AI_Components[AI Components]
    AI_Components -->|Processing| LLM[Gemma 4]
    AI_Components -->|Storage| DB[(PostgreSQL)]
    AI_Components -->|Vectors| VDB[(ChromaDB)]
```

- **Mindmap**
```mermaid
mindmap
    root LokKatha AI
        Recording
            Audio Capture
            Consent Management
        Processing
            ASR
            Translation
            Summarization
            Embedding Generation
        Storage
            PostgreSQL
            ChromaDB
        Retrieval
            Hybrid Search
            RAG
        User Interaction
            Query Interface
            QA Interface
            Visualization
```