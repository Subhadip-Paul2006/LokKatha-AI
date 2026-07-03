# Product Requirements Document (PRD) – LokKatha AI

## 1. Vision & Goals
Create a multilingual, AI‑powered platform that records, transcribes, translates, summarizes, and makes searchable India's oral cultural heritage.

## 2. Target Personas
- **Volunteer Fieldworker** – records interviews in rural areas.
- **Researcher** – queries the knowledge base for specific topics.
- **Educator** – uses content for classroom material.
- **Community Representative** – ensures ethical use and access.

## 3. User Journey
```mermaid
journey
    title LokKatha AI User Journey
    section Recording
      Capture : 5s
      Consent : 10s
    section Processing
      Transcribe : 20s
      Translate & Summarize : 30s
      Embed : 15s
    section Storing
      Save Metadata : 5s
      Save Embedding : 5s
    section Querying
      Search : 10s
      Receive Answer : 5s
```

## 4. Feature Backlog (Kanban)
```mermaid
flowchart LR
    A[Record Audio] --> B[Upload & Transcribe]
    B --> C[Generate Summary & Tags]
    C --> D[Store in PostgreSQL]
    D --> E[Create Embedding]
    E --> F[Index in ChromaDB]
    F --> G[Enable RAG Q&A]
    G --> H[User Query Interface]
    style A fill:#2ecc71,stroke:#1e8449
    style H fill:#e74c3c,stroke:#c0392b
```

## 5. XY Chart – Language Usage Projection
```mermaid
pie
    title Projected Language Distribution (2026‑2028)
    "Hindi" : 45
    "Bengali" : 20
    "Bengali" : 15
    "Tamil" : 10
    "Telugu" : 7
    "Others" : 3
```

## 6. Roadmap (High‑Level Timeline)
```mermaid
gantt
    title LokKatha AI Roadmap
    dateFormat  YYYY-MM
    section Planning
    Market Research        :a1, 2026-01, 1mo
    section Development
    ASR Integration        :a2, after a1, 2mo
    Gemma Integration      :a3, after a2, 2mo
    Database Setup         :a4, after a3, 1mo
    section Launch
    MVP Release            :b1, after a4, 1mo
    section Growth
    Offline Mode           :b2, after b1, 2mo
    Multi‑Language Expansion :b3, after b2, 3mo
```

## 7. Success Metrics
- **Transactions per month** > 10,000
- **User satisfaction** > 4.5/5
- **Recordings archived** > 5,000 hrs within 12 months
- **Search accuracy** > 90% (precision@5)

## 8. Assumptions & Constraints
- Reliable internet for cloud deployment; offline mode planned for field use.
- Volunteers will complete consent forms before recording.
- Gemma 4 API quotas will be monitored to control cost.

## 9. Risks
- **Low WER for low‑resource dialects** – mitigated by fine‑tuning on regional datasets.
- **Ethical misuse of content** – mitigated by strict access controls and community oversight.