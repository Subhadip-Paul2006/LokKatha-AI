# System Architecture

LokKatha AI follows a robust, edge-compatible Retrieval-Augmented Generation (RAG) architecture built entirely on Next.js, Supabase, and Google Gemma.

## High-Level Architecture

```mermaid
graph TD
    User([User]) --> |Visits Landing Page| UI[Next.js Frontend]
    UI --> |Submits Question| API[/api/chat]
    
    subgraph Backend Orchestrator
        API --> Session[Chat Session Manager]
        Session --> Classifier[Query Classifier]
        Classifier --> |Generates Query Vector| Embed[Google Embedding API]
        Embed --> RAG[RAG Retrieval Engine]
    end

    subgraph Vector Database
        RAG --> |pgvector similarity search| Supabase[(Supabase PostgreSQL)]
        Supabase --> |Returns Top-K Stories| RAG
    end

    subgraph LLM Generation
        RAG --> Context[Context Builder]
        Context --> Guard[Prompt Guardrails]
        Guard --> Gemma[Google Gemma-2.5]
        Gemma --> |Streams Tokens SSE| API
    end

    API --> |event: token| UI
```

## Core Layers

### 1. Frontend Layer
- **Tech**: Next.js 15, React 18, Tailwind CSS v4, Lucide Icons.
- **Role**: Provides the immersive manuscript UI, maintains client-side `useSyncExternalStore` chat session, and handles Web Speech API TTS/STT.

### 2. Orchestration Layer (`/lib/chat`)
- **Tech**: Edge-compatible TypeScript.
- **Role**: Intercepts requests, evaluates intent (bypassing LLM for greetings/injections), builds contextual payload, and manages SSE streaming to the client.

### 3. Retrieval Layer (`/lib/rag`)
- **Tech**: Supabase JS Client, Google GenAI SDK.
- **Role**: Executes Hybrid Search (Semantic + Keyword) against the Supabase `stories` table using `pgvector`. Extracts optimized contextual chunks to fit within Gemma's context window.

### 4. Database Layer
- **Tech**: Supabase PostgreSQL with `pgvector`.
- **Role**: Stores highly structured cultural metadata (Region, Era, Language) alongside dense 768-dimensional vector embeddings of the Bengali literature corpus.
