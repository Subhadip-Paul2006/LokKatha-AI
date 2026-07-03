# Technical Requirements Document (TRD) — LokKatha AI

## 1. System Architecture (C4 Model - Level 2)
```mermaid
C4Container
    title Container diagram for LokKatha AI
    Person(volunteer, "Volunteer", "Records oral history")
    Person(user, "Researcher", "Queries the archive")
    
    Container(frontend, "Frontend", "React/Streamlit", "User Interface")
    Container(api, "Backend API", "FastAPI", "Orchestrates ASR, LLM, and DB")
    
    ContainerDb(postgres, "Supabase", "PostgreSQL", "Stores transcripts, metadata, and users")
    ContainerDb(chroma, "ChromaDB", "Vector Store", "Stores semantic embeddings")
    
    Container(whisper, "Whisper Service", "OpenAI Whisper", "Speech-to-Text")
    Container(gemma, "Gemma 4 Engine", "LLM", "Summarization, Translation, RAG")

    Rel(volunteer, frontend, "Uploads audio", "HTTPS")
    Rel(user, frontend, "Searches archive", "HTTPS")
    Rel(frontend, api, "API Calls", "JSON/REST")
    Rel(api, whisper, "Sends audio", "gRPC/REST")
    Rel(api, gemma, "Sends text", "REST/Local")
    Rel(api, postgres, "Reads/Writes", "SQL")
    Rel(api, chroma, "Queries vectors", "API")
    Rel(gemma, chroma, "Retrieves context", "API")
```

## 2. Data Model (Entity Relationship Diagram)
```mermaid
erDiagram
    USER ||--o{ INTERVIEW : records
    INTERVIEW ||--|| CONSENT : has
    INTERVIEW ||--o{ TRANSCRIPT : generates
    TRANSCRIPT ||--o{ TAG : contains
    TRANSCRIPT ||--|| EMBEDDING : represented_by
    
    USER {
        uuid id PK
        string name
        string role
    }
    INTERVIEW {
        uuid id PK
        string audio_url
        datetime date
        string location
        uuid user_id FK
    }
    CONSENT {
        uuid id PK
        boolean granted
        string signature_url
        datetime timestamp
    }
    TRANSCRIPT {
        uuid id PK
        text raw_text
        text summary
        json translations
        uuid interview_id FK
    }
    TAG {
        uuid id PK
        string label
        uuid transcript_id FK
    }
    EMBEDDING {
        uuid id PK
        vector vec
        uuid transcript_id FK
    }
```

## 3. Sequence Diagram (RAG Query Flow)
```mermaid
sequenceDiagram
    participant U as User
    participant API as FastAPI
    participant VDB as ChromaDB
    participant LLM as Gemma 4
    participant DB as Supabase

    U->>API: Query "What are traditional farming methods in Bengal?"
    API->>VDB: Convert query to vector & search
    VDB-->>API: Return top-k relevant transcript chunks
    API->>DB: Fetch full metadata for these chunks
    DB-->>API: Return narrator info, dates, and full text
    API->>LLM: Prompt(Context + Query)
    LLM-->>API: Generate factual answer with citations
    API-->>U: Display Answer
```

## 4. Block Diagram (Processing Pipeline)
```mermaid
block-beta
    columns 4
    Audio[Audio Input] --> ASR[Whisper ASR]
    ASR --> LLM[Gemma 4]
    LLM --> DB[(Postgres)]
    LLM --> VDB[(Vector DB)]
    VDB --> RAG[RAG Engine]
    DB --> RAG
    RAG --> Out[Final Answer]
```
