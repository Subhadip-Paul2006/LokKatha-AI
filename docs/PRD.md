# Product Requirements Document (PRD) — LokKatha AI

## 1. Product Vision
To prevent the permanent loss of India's oral heritage by providing a tool that not only archives speech but understands and cross-references cultural context across languages.

## 2. Target Audience
- **Field Volunteers/NGOs:** Recording elders in rural areas.
- **Historians/Researchers:** Analyzing cultural patterns.
- **General Public:** Discovering their roots and traditional knowledge.

## 3. Functional Requirements
| ID | Feature | Description | Priority |
|----|---------|-------------|----------|
| FR1 | Audio Processing | Convert regional Indian dialects to text using Whisper | High |
| FR2 | AI Transformation | Summarize, translate (EN, HI, BN), and tag transcripts using Gemma 4 | High |
| FR3 | Semantic Search | Search for "Ancient irrigation" and find relevant stories regardless of language | High |
| FR4 | Interactive Q&A | Chat with the archive using RAG to get factual answers with citations | Medium |
| FR5 | Consent Mgmt | Digital signing and storage of informed consent forms | Critical |
| FR6 | Offline Mode | Ability to record and queue uploads for low-connectivity areas | Medium |

## 4. Non-Functional Requirements
- **Accuracy:** ASR Word Error Rate (WER) optimized for Indic languages.
- **Latency:** RAG responses under 3 seconds.
- **Ethical:** Strict adherence to indigenous data sovereignty.
- **Scalability:** Support for millions of archival segments.

## 5. User Flow (Advanced FlowChart)
```mermaid
flowchart TD
    Start([Start]) --> Record[Record Interview]
    Record --> Consent{Consent Obtained?}
    Consent -- No --> End([End])
    Consent -- Yes --> Upload[Upload Audio]
    Upload --> ASR[Whisper ASR Processing]
    ASR --> LLM[Gemma 4 Analysis]
    
    subgraph Analysis_Pipeline
        LLM --> Sum[Summarization]
        LLM --> Trans[Translation]
        LLM --> Tags[Cultural Tagging]
        LLM --> Emb[Embedding Generation]
    end
    
    Sum --> DB[(Supabase PostgreSQL)]
    Trans --> DB
    Tags --> DB
    Emb --> VDB[(Vector DB)]
    
    DB --> Search[Knowledge Base Search]
    VDB --> Search
    Search --> RAG[RAG + Gemma 4]
    RAG --> Answer([User Answer])
```

## 6. Project Kanban
```mermaid
kanban
  Todo
    - Implement Voice Cloning Consent
    - Heritage Map Integration
    - Mobile PWA Support
  In Progress
    - Whisper Fine-tuning
    - Gemma 4 Prompt Engineering
    - Supabase Schema Design
  Done
    - Idea Definition
    - Research Analysis
    - Tech Stack Selection
```
