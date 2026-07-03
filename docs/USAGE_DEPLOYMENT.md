# Usage and Deployment

## Overview
This document describes how to use and deploy the LokKatha AI platform.

## Block Diagram
```mermaid
graph TD
    A[Field Recorder] --> B[Whisper ASR]
    B --> C[Gemma 4 Summary/Translation]
    C --> D[PostgreSQL]
    C --> E[ChromaDB]
    D --> F[API Server]
    E --> G[RAG Q&A]
    F --> G
```

## Architecture Diagram
```mermaid
graph LR
    subgraph Frontend
        UI[Web / Mobile UI]
    end
    subgraph Backend
        API[FastAPI]
        CE[Gemma 4 LLM]
        ASR[Whisper ASR]
    end
    subgraph Data
        SQL[(PostgreSQL)]
        VDB[(ChromaDB)]
    end
    UI -->|Query| API
    API -->|Call| CE
    API -->|Transcribe| ASR
    ASR -->|Store| SQL
    CE -->|Generate| SQL
    CE -->|Create Embeddings| VDB
    VDB -->|Retrieve| API
    API -->|Serve| UI
```

## Deployment Flowchart
```mermaid
flowchart LR
    Deploy[Deploy to Cloud] -->|Container| Docker
    Docker -->|Orchestrate| K8s
    K8s -->|Serve| WebUI
    K8s -->|Process| ASRWorker
    ASRWorker -->|Store| DB[(PostgreSQL)]
    K8s -->|Store Embeddings| VDB[(ChromaDB)]
```

## Usage Sequence Diagram
```mermaid
sequenceDiagram
    participant User
    participant Frontend as WebUI
    participant API
    participant ASR
    participant Gemma as Gemma4
    participant DB
    participant VDB

    User->>Frontend: Submit Query
    Frontend->>API: Send Query
    API->>VDB: Retrieve embeddings
    VDB-->>API: Return relevant chunks
    API->>Gemma: Generate answer
    Gemma-->>API: Return answer + citations
    API->>Frontend: Send response
    Frontend->>User: Show answer
```

## Timeline (Gantt)
```mermaid
gantt
    title Deployment Timeline
    dateFormat  YYYY-MM-DD
    section Planning
    Requirements        :a1, 2026-01-01, 7d
    Architecture Design :a2, after a1, 10d
    section Development
    ASR Integration     :b1, after a2, 14d
    Gemma Integration   :b2, after b1, 12d
    Database Setup      :b3, after b2, 5d
    section Deployment
    Containerization    :c1, after b3, 3d
    Cloud Deployment    :c2, after c1, 2d
```