# 🔧 Technical Requirements Document (TRD)
## LokKatha AI — The Engineer's Blueprint

> **Version:** 1.0 (Beginner-Friendly Edition)
> **Date:** July 2026
> **Audience:** Developers, AI Engineers, DevOps, and Curious Minds

---

## 📖 Table of Contents
1. [What is a TRD?](#1-what-is-a-trd)
2. [System Architecture Overview](#2-system-architecture-overview)
3. [C4 Model: Level 1 (Context)](#3-c4-model-level-1-context)
4. [C4 Model: Level 2 (Containers)](#4-c4-model-level-2-containers)
5. [C4 Model: Level 3 (Components)](#5-c4-model-level-3-components)
6. [Entity Relationship Diagram (Database)](#6-entity-relationship-diagram-database)
7. [Sequence Diagram: Recording Flow](#7-sequence-diagram-recording-flow)
8. [Sequence Diagram: RAG Query Flow](#8-sequence-diagram-rag-query-flow)
9. [Sequence Diagram: User Authentication](#9-sequence-diagram-user-authentication)
10. [Class Diagram (Object-Oriented View)](#10-class-diagram-object-oriented-view)
11. [Block Diagram (Pipeline View)](#11-block-diagram-pipeline-view)
12. [Multi-Layer Event Modeling](#12-multi-layer-event-modeling)
13. [Git Graph (Development History)](#13-git-graph-development-history)
14. [Technology Stack](#14-technology-stack)
15. [API Endpoints](#15-api-endpoints)
16. [Environment Variables](#16-environment-variables)
17. [Error Handling Strategy](#17-error-handling-strategy)
18. [Performance Requirements (XY Chart)](#18-performance-requirements-xy-chart)
19. [Security Architecture](#19-security-architecture)
20. [Glossary](#20-glossary)

---

## 1. What is a TRD?

A **TRD** (Technical Requirements Document) is the **blueprint** for building the app. While the PRD says **what** to build, the TRD says **how** to build it. Think of it as the instruction manual for LEGO: it shows you which pieces to use and how to connect them.

---

## 2. System Architecture Overview

Our system has **4 main layers**, like a 4-layer cake:

```mermaid
block-beta
    columns 1
    block:LAYER4
        L4["🌐 LAYER 4: ACCESS (Frontend UI)"]
    end
    block:LAYER3
        L3["⚙️ LAYER 3: PROCESSING (AI Models)"]
    end
    block:LAYER2
        L2["💾 LAYER 2: STORAGE (Databases)"]
    end
    block:LAYER1
        L1["📥 LAYER 1: INPUT (Audio/Text)"]
    end
    L4 --> L3
    L3 --> L2
    L2 --> L1
```

| Layer | Purpose | Examples |
|-------|---------|----------|
| **Layer 1: Input** | Takes in data | Microphone, file upload |
| **Layer 2: Storage** | Keeps data safe | PostgreSQL, ChromaDB |
| **Layer 3: Processing** | The brain that thinks | Whisper, Gemma 4 |
| **Layer 4: Access** | What users see and use | Web app, mobile app |

---

## 3. C4 Model: Level 1 (Context)

The simplest view: **Who** uses the system and **what** other systems does it talk to.

```mermaid
C4Context
    title System Context: Who Uses LokKatha AI?
    Person(volunteer, "👩‍🌾 Volunteer", "Records oral histories")
    Person(user, "🔍 User", "Searches and asks questions")
    Person(admin, "👨‍💼 Admin", "Manages the system")
    
    System(lokkatha, "🌟 LokKatha AI", "Saves and shares India's oral heritage")
    
    System_Ext(google, "🔍 Google AI", "Provides Gemma 4 LLM")
    System_Ext(supabase, "💾 Supabase", "Database and authentication")
    System_Ext(email, "📧 Email Service", "Sends notifications")
    
    Rel(volunteer, lokkatha, "Uploads audio", "HTTPS")
    Rel(user, lokkatha, "Searches and chats", "HTTPS")
    Rel(admin, lokkatha, "Manages content", "HTTPS")
    Rel(lokkatha, google, "Uses for AI", "API")
    Rel(lokkatha, supabase, "Stores data", "API")
    Rel(lokkatha, email, "Sends emails", "SMTP")
```

---

## 4. C4 Model: Level 2 (Containers)

The "boxes" inside our system and how they communicate.

```mermaid
C4Container
    title Container Diagram: Inside LokKatha AI
    Person(user, "👤 User", "Uses the app")
    
    System_Boundary(c1, "LokKatha AI") {
        Container(web, "🖥️ Web App", "Streamlit or React", "The interface users see")
        Container(api, "⚙️ API Server", "FastAPI (Python)", "The brain that processes requests")
        Container(worker, "🔄 Background Worker", "Celery + Redis", "Handles slow AI tasks")
        
        ContainerDb(postgres, "💾 Supabase", "PostgreSQL", "Stores users, interviews, transcripts")
        ContainerDb(chroma, "🔮 ChromaDB", "Vector DB", "Stores embeddings for search")
        ContainerDb(storage, "📁 File Storage", "Supabase Storage", "Holds audio files")
    }
    
    System_Ext(whisper, "🎤 Whisper", "OpenAI Whisper")
    System_Ext(gemma, "🧠 Gemma 4", "Google AI")
    
    Rel(user, web, "Uses", "HTTPS")
    Rel(web, api, "Sends requests", "JSON REST")
    Rel(api, worker, "Queues long tasks", "Redis")
    Rel(worker, whisper, "Transcribes audio", "Local function")
    Rel(worker, gemma, "Analyzes text", "API call")
    Rel(api, postgres, "Reads/writes", "SQL")
    Rel(api, chroma, "Searches vectors", "API")
    Rel(api, storage, "Stores files", "API")
    Rel(worker, postgres, "Saves results", "SQL")
    Rel(worker, chroma, "Stores embeddings", "API")
```

---

## 5. C4 Model: Level 3 (Components)

This zooms into the **API Server** to show its internal parts.

```mermaid
C4Component
    title Component Diagram: Inside the API Server
    Container(web, "Web App", "React/Streamlit")
    ContainerDb(db, "Database", "PostgreSQL")
    ContainerDb(vec, "Vector DB", "ChromaDB")
    System_Ext(ai, "AI Models", "Whisper + Gemma 4")
    
    Component(router, "🌐 API Router", "FastAPI routes", "Receives HTTP requests")
    Component(auth, "🔐 Auth Handler", "Supabase Auth", "Verifies users")
    Component(audio_ctrl, "🎤 Audio Controller", "Validates and stores", "Handles audio uploads")
    Component(transcribe_ctrl, "📝 Transcription Controller", "Calls Whisper", "Manages ASR")
    Component(analysis_ctrl, "🧠 Analysis Controller", "Calls Gemma 4", "Manages LLM")
    Component(search_ctrl, "🔍 Search Controller", "Queries Vector DB", "Manages search")
    Component(rag_ctrl, "💬 RAG Controller", "Combines search + LLM", "Manages Q&A")
    
    Rel(web, router, "HTTP requests", "JSON")
    Rel(router, auth, "Verify token", "")
    Rel(router, audio_ctrl, "Upload audio", "")
    Rel(router, transcribe_ctrl, "Get transcript", "")
    Rel(router, analysis_ctrl, "Analyze text", "")
    Rel(router, search_ctrl, "Search stories", "")
    Rel(router, rag_ctrl, "Ask question", "")
    
    Rel(audio_ctrl, db, "Save metadata", "SQL")
    Rel(audio_ctrl, vec, "Save file ref", "")
    Rel(transcribe_ctrl, ai, "Transcribe", "API")
    Rel(analysis_ctrl, ai, "Analyze", "API")
    Rel(analysis_ctrl, db, "Save results", "SQL")
    Rel(analysis_ctrl, vec, "Save embedding", "API")
    Rel(search_ctrl, vec, "Query", "API")
    Rel(rag_ctrl, search_ctrl, "Get context", "")
    Rel(rag_ctrl, ai, "Generate answer", "API")
```

---

## 6. Entity Relationship Diagram (Database)

How our data is organized in tables (like a giant spreadsheet with many sheets).

```mermaid
erDiagram
    USERS ||--o{ INTERVIEWS : "creates"
    USERS ||--o{ QUERY_LOGS : "asks"
    INTERVIEWS ||--|| CONSENTS : "requires"
    INTERVIEWS ||--|| TRANSCRIPTS : "produces"
    INTERVIEWS ||--o{ AUDIO_CHUNKS : "split into"
    TRANSCRIPTS ||--o{ TRANSLATIONS : "translated to"
    TRANSCRIPTS ||--o{ TAGS : "labeled with"
    TRANSCRIPTS ||--|| EMBEDDINGS : "vectorized as"
    TRANSCRIPTS ||--o{ CHUNKS : "chunked into"
    CHUNKS ||--|| EMBEDDINGS : "have"
    
    USERS {
        uuid id PK
        string email
        string full_name
        enum role "volunteer|researcher|admin"
        string preferred_language
        timestamp created_at
    }
    INTERVIEWS {
        uuid id PK
        uuid user_id FK
        uuid narrator_id FK
        string title
        text description
        string audio_url
        string location_name
        decimal latitude
        decimal longitude
        date interview_date
        string original_language
        timestamp created_at
    }
    NARRATORS {
        uuid id PK
        string display_name "May be pseudonym"
        integer age_range
        string community
        text bio
    }
    CONSENTS {
        uuid id PK
        uuid interview_id FK
        boolean audio_consent
        boolean translation_consent
        boolean public_visibility
        string signature_url
        timestamp signed_at
    }
    TRANSCRIPTS {
        uuid id PK
        uuid interview_id FK
        text raw_text
        text summary
        text historical_context
        string detected_language
        float confidence_score
    }
    TRANSLATIONS {
        uuid id PK
        uuid transcript_id FK
        enum language "en|hi|bn|ta|te"
        text translated_text
        float quality_score
    }
    TAGS {
        uuid id PK
        uuid transcript_id FK
        string label
        string category
    }
    EMBEDDINGS {
        uuid id PK
        uuid transcript_id FK
        uuid chunk_id FK
        vector embedding "768-dim vector"
        string model_name
    }
    CHUNKS {
        uuid id PK
        uuid transcript_id FK
        text content
        integer chunk_index
        integer start_time_seconds
        integer end_time_seconds
    }
    AUDIO_CHUNKS {
        uuid id PK
        uuid interview_id FK
        string chunk_url
        integer start_time
        integer end_time
    }
    QUERY_LOGS {
        uuid id PK
        uuid user_id FK
        text query_text
        text answer_text
        integer retrieval_count
        timestamp created_at
    }
```

---

## 7. Sequence Diagram: Recording Flow

What happens when a volunteer records an interview (step by step, time goes top to bottom).

```mermaid
sequenceDiagram
    autonumber
    actor V as 👩‍🌾 Volunteer
    participant App as 🖥️ Mobile App
    participant API as ⚙️ API Server
    participant DB as 💾 Supabase
    participant Storage as 📁 File Storage
    participant Queue as 🔄 Task Queue
    participant Whisper as 🎤 Whisper
    participant Gemma as 🧠 Gemma 4
    
    V->>App: 1. Open recording screen
    V->>App: 2. Tap "Record" button
    App->>App: 3. Request microphone permission
    App->>App: 4. Start recording audio
    V->>App: 5. Speak with elder
    V->>App: 6. Tap "Stop"
    App->>API: 7. Upload audio file (POST /upload)
    API->>API: 8. Validate file (size, format)
    API->>Storage: 9. Save audio file
    Storage-->>API: 10. Return file URL
    API->>DB: 11. Create interview record
    DB-->>API: 12. Return interview ID
    API->>Queue: 13. Queue "transcribe" task
    API-->>App: 14. Return success (interview_id)
    App-->>V: 15. Show "Processing..." message
    
    Note over Queue,Whisper: 🔄 Background Processing
    Queue->>Whisper: 16. Send audio for transcription
    Whisper-->>Queue: 17. Return transcript text
    Queue->>Gemma: 18. Send transcript for analysis
    Gemma-->>Queue: 19. Return summary + tags + translations
    Queue->>DB: 20. Save transcript and analysis
    Queue->>DB: 21. Save embeddings
    
    Note over V,App: 📱 User Notification
    API->>App: 22. Push notification: "Done!"
    App-->>V: 23. Show "Story saved!" message
```

---

## 8. Sequence Diagram: RAG Query Flow

What happens when a user asks a question (this is the magic part!).

```mermaid
sequenceDiagram
    autonumber
    actor U as 🔍 User
    participant App as 🖥️ Frontend
    participant API as ⚙️ API Server
    participant Vec as 🔮 ChromaDB
    participant DB as 💾 Supabase
    participant Gemma as 🧠 Gemma 4
    
    U->>App: 1. Type: "Tell me about monsoon farming"
    App->>API: 2. Send query (POST /ask)
    API->>API: 3. Validate query
    API->>API: 4. Convert query to embedding vector
    API->>Vec: 5. Search for similar embeddings (top 5)
    Vec-->>API: 6. Return matching chunks
    API->>DB: 7. Fetch full metadata for chunks
    DB-->>API: 8. Return narrator, location, full text
    API->>API: 9. Build context from chunks
    API->>Gemma: 10. Send: System prompt + Context + Question
    Note right of Gemma: 🧠 Gemma reads<br/>5 stories + question<br/>and writes answer
    Gemma-->>API: 11. Return generated answer with citations
    API->>DB: 12. Log this query for analytics
    API-->>App: 13. Return answer + sources
    App-->>U: 14. Display answer with clickable citations
```

---

## 9. Sequence Diagram: User Authentication

How users log in securely.

```mermaid
sequenceDiagram
    autonumber
    actor U as 👤 User
    participant App as 🖥️ Frontend
    participant API as ⚙️ API Server
    participant Auth as 🔐 Supabase Auth
    participant DB as 💾 Database
    
    U->>App: 1. Enter email and password
    App->>Auth: 2. Send login request
    Auth->>Auth: 3. Verify credentials
    Auth-->>App: 4. Return JWT token (valid for 24h)
    App->>App: 5. Store token securely
    App->>API: 6. Make request with token in header
    API->>API: 7. Verify JWT signature
    API->>DB: 8. Fetch user details
    DB-->>API: 9. Return user info
    API-->>App: 10. Return data
    
    Note over App,Auth: 🔄 Token Refresh
    App->>Auth: 11. Request new token (when old one expires)
    Auth-->>App: 12. Return new JWT token
```

---

## 10. Class Diagram (Object-Oriented View)

Shows the main "objects" in our code and how they relate. (Like blueprints for LEGO pieces.)

```mermaid
classDiagram
    class User {
        +uuid id
        +string email
        +string name
        +Role role
        +string language
        +login()
        +logout()
        +getProfile()
    }
    
    class Interview {
        +uuid id
        +uuid userId
        +uuid narratorId
        +string audioUrl
        +Location location
        +Date date
        +Language language
        +upload()
        +delete()
        +getMetadata()
    }
    
    class Narrator {
        +uuid id
        +string name
        +int ageRange
        +string community
        +getStories()
    }
    
    class Consent {
        +uuid id
        +uuid interviewId
        +boolean audioConsent
        +boolean translationConsent
        +boolean publicAccess
        +Date signedAt
        +verify()
        +revoke()
    }
    
    class Transcript {
        +uuid id
        +uuid interviewId
        +string rawText
        +string summary
        +string language
        +float confidence
        +transcribe()
        +analyze()
    }
    
    class Translation {
        +uuid id
        +uuid transcriptId
        +Language targetLang
        +string text
        +float quality
        +translate()
    }
    
    class Tag {
        +uuid id
        +uuid transcriptId
        +string label
        +string category
    }
    
    class Embedding {
        +uuid id
        +uuid transcriptId
        +float[] vector
        +string model
        +generate()
        +search(query)
    }
    
    class RAGEngine {
        +SearchEngine search
        +LLM llm
        +query(question)
        +retrieveContext()
        +generateAnswer()
    }
    
    class WhisperService {
        +string model
        +transcribe(audio)
        +detectLanguage()
    }
    
    class GemmaService {
        +string model
        +summarize(text)
        +translate(text, lang)
        +extractTags(text)
        +answer(context, question)
    }
    
    User "1" --> "*" Interview : creates
    Interview "1" --> "1" Narrator : features
    Interview "1" --> "1" Consent : requires
    Interview "1" --> "1" Transcript : produces
    Transcript "1" --> "*" Translation : has
    Transcript "1" --> "*" Tag : labeled with
    Transcript "1" --> "1" Embedding : represented by
    RAGEngine --> WhisperService : uses
    RAGEngine --> GemmaService : uses
    RAGEngine --> Embedding : searches
```

---

## 11. Block Diagram (Pipeline View)

Shows the data as it flows through the system, like a factory assembly line.

```mermaid
block-beta
    columns 5
    space:2 A[🎤 Audio File] space:2
    A --> B[🎙️ Whisper]
    B --> C[📝 Transcript]
    C --> D[🧠 Gemma 4]
    D --> E[📋 Summary]
    D --> F[🌍 Translations]
    D --> G[🏷️ Tags]
    D --> H[🧮 Embedding]
    E --> I[(💾 PostgreSQL)]
    F --> I
    G --> I
    H --> J[(🔮 Vector DB)]
    I --> K[🔍 Search]
    J --> K
    K --> L[💬 Answer]
```

---

## 12. Multi-Layer Event Modeling

Shows **what**, **how**, and **why** at each step of the recording pipeline.

```mermaid
flowchart TB
    subgraph "🟡 LAYER 1: WHAT HAPPENS (Events)"
        E1[📱 User clicks Record]
        E2[🎤 Audio captured]
        E3[📤 File uploaded]
        E4[📝 AI transcribes]
        E5[🧠 AI analyzes]
        E6[💾 Data saved]
    end
    
    subgraph "🔵 LAYER 2: HOW IT HAPPENS (Commands)"
        E1 --> C1[▶️ Start recording]
        C1 --> E2
        E2 --> C2[📦 Package audio]
        C2 --> E3
        E3 --> C3[🤖 Call Whisper]
        C3 --> E4
        E4 --> C4[🧠 Call Gemma 4]
        C4 --> E5
        E5 --> C5[💾 Insert into DB]
        C5 --> E6
    end
    
    subgraph "🟢 LAYER 3: WHY IT HAPPENS (Intent)"
        C1 --> I1[User wants to save memory]
        C2 --> I1
        C3 --> I2[Need text for search]
        C4 --> I3[Need summary and translations]
        C5 --> I4[Need to persist for future use]
    end
```

---

## 13. Git Graph (Development History)

How the code evolved over time, like chapters in a book.

```mermaid
gitGraph
    commit id: "🌱 Initial commit"
    branch develop
    checkout develop
    commit id: "📦 Add requirements.txt"
    commit id: "🎤 Whisper module"
    commit id: "🧠 Gemma 4 module"
    commit id: "💾 Supabase integration"
    commit id: "🔮 ChromaDB setup"
    commit id: "🔍 RAG engine"
    checkout main
    commit id: "v0.1-alpha" tag: "release"
    branch feature/upload
    checkout feature/upload
    commit id: "📤 Upload endpoint"
    commit id: "🖥️ Upload UI"
    checkout develop
    merge feature/upload
    branch feature/search
    checkout feature/search
    commit id: "🔍 Search endpoint"
    commit id: "🖥️ Search UI"
    checkout develop
    merge feature/search
    branch feature/chat
    checkout feature/chat
    commit id: "💬 Chat endpoint"
    commit id: "🖥️ Chat UI"
    checkout develop
    merge feature/chat
    checkout main
    merge develop tag: "v0.5-beta"
    commit id: "🚀 v1.0 launch!"
```

---

## 14. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Frontend (MVP)** | Streamlit | 1.30+ | Quick prototype |
| **Frontend (Prod)** | React + Next.js | 14+ | Production web app |
| **Backend API** | FastAPI | 0.110+ | High-performance Python API |
| **ASR Model** | OpenAI Whisper | large-v3 | Speech recognition |
| **LLM** | Google Gemma 4 | 4 (12B) | Translation, summarization |
| **Embeddings** | multilingual-e5-large | latest | Cross-lingual vectors |
| **Vector DB** | ChromaDB | 0.4+ | Vector storage |
| **Database** | Supabase (PostgreSQL) | 15+ | Relational data |
| **Cache** | Redis | 7+ | Speed up repeated queries |
| **Task Queue** | Celery | 5+ | Background AI processing |
| **Auth** | Supabase Auth | latest | User authentication |
| **Storage** | Supabase Storage | latest | Audio file storage |
| **Deployment** | Docker + Railway | latest | Easy cloud hosting |
| **Monitoring** | Sentry + Grafana | latest | Error tracking |

---

## 15. API Endpoints

The "menu" of things our API can do.

| Method | Endpoint | Purpose | Auth Required |
|--------|----------|---------|---------------|
| `POST` | `/auth/signup` | Create new account | ❌ |
| `POST` | `/auth/login` | Log in | ❌ |
| `POST` | `/interviews/upload` | Upload audio file | ✅ |
| `GET` | `/interviews` | List all interviews | ✅ |
| `GET` | `/interviews/{id}` | Get one interview | ✅ |
| `DELETE` | `/interviews/{id}` | Delete interview | ✅ (owner) |
| `POST` | `/search` | Semantic search | ✅ |
| `POST` | `/ask` | RAG question-answer | ✅ |
| `POST` | `/consent` | Submit consent form | ✅ |
| `GET` | `/tags` | Get all cultural tags | ✅ |
| `GET` | `/stats` | Get usage statistics | ✅ (admin) |

---

## 16. Environment Variables

These are like secret settings stored in a `.env` file.

```env
# === Database ===
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-anon-key-here
DATABASE_URL=postgresql://user:pass@host:5432/dbname

# === AI Models ===
GOOGLE_API_KEY=your-gemini-key
WHISPER_MODEL=large-v3
EMBEDDING_MODEL=multilingual-e5-large
GEMMA_MODEL=gemma-4-12b

# === Vector DB ===
CHROMA_DB_PATH=./chroma_db
CHROMA_COLLECTION=interviews

# === Storage ===
STORAGE_BUCKET=audio-files
MAX_FILE_SIZE_MB=500

# === Security ===
JWT_SECRET=your-secret-key
JWT_EXPIRY_HOURS=24

# === App Settings ===
APP_ENV=production
LOG_LEVEL=INFO
```

---

## 17. Error Handling Strategy

What we do when things go wrong.

```mermaid
flowchart TD
    Start([❌ Error occurs]) --> Catch[🪤 Caught by try-catch]
    Catch --> Type{What type<br/>of error?}
    
    Type -- 🔌 Network --> Retry[🔄 Retry 3 times]
    Retry --> Success{Worked?}
    Success -- Yes --> Done([✅ Continue])
    Success -- No --> Log1[📝 Log error]
    Log1 --> User1[👤 Show 'Try again']
    
    Type -- 🤖 AI Model --> Fallback[🔀 Use backup model]
    Fallback --> Done
    
    Type -- 💾 Database --> Log2[📝 Log error]
    Log2 --> User2[👤 Show 'Service down']
    User2 --> Alert[🚨 Alert admin]
    
    Type -- 🔐 Auth --> Log3[📝 Log attempt]
    Log3 --> User3[👤 Show 'Please log in']
    
    Type -- 📁 File --> Validate[✔️ Validate file]
    Validate --> User4[👤 Show clear error message]
    
    style Start fill:#ffcccc
    style Done fill:#ccffcc
```

---

## 18. Performance Requirements (XY Chart)

How fast should the system be as it grows?

```mermaid
xychart-beta
    title "System Performance: Speed vs. Number of Users"
    x-axis "Concurrent Users" [10, 50, 100, 500, 1000]
    y-axis "Response Time (ms)" 0 --> 2000
    line [200, 400, 600, 1000, 1500]
```

| Users | Search Time | Upload Time | Q&A Time |
|-------|-------------|-------------|----------|
| 10 | 200ms | 2s | 1.5s |
| 50 | 400ms | 3s | 2s |
| 100 | 600ms | 4s | 2.5s |
| 500 | 1000ms | 6s | 4s |
| 1000 | 1500ms | 8s | 5s |

---

## 19. Security Architecture

How we keep the data safe. Like a castle with many walls.

```mermaid
flowchart TB
    subgraph "🛡️ OUTER WALL: HTTPS"
        A[👤 User request] --> B[🔒 TLS 1.3 encryption]
    end
    subgraph "🛡️ MIDDLE WALL: Auth"
        B --> C{Valid JWT?}
        C -- No --> D[🚫 Reject 401]
        C -- Yes --> E[✅ Allow]
    end
    subgraph "🛡️ INNER WALL: Authorization"
        E --> F{Has permission?}
        F -- No --> G[🚫 Reject 403]
        F -- Yes --> H[✅ Proceed]
    end
    subgraph "🏰 TREASURE ROOM: Database"
        H --> I[(🔐 Encrypted at rest<br/>AES-256)]
    end
    
    style A fill:#e1f5ff
    style I fill:#fff4e1
    style D fill:#ffcccc
    style G fill:#ffcccc
```

### Security Layers Explained

| Layer | What It Does |
|-------|-------------|
| **HTTPS/TLS** | Scrambles data in transit so hackers can't read it |
| **JWT Auth** | Checks if the user is really who they say they are |
| **Role Check** | Checks if the user is allowed to do this action |
| **Encryption at Rest** | Scrambles data when stored so even if stolen, it's unreadable |
| **Audit Logs** | Keeps a record of who did what and when |
| **Rate Limiting** | Stops one user from making too many requests |

---

## 20. Glossary

| Term | Meaning |
|------|---------|
| **API** | Application Programming Interface - a way for programs to talk |
| **JWT** | JSON Web Token - a secure way to prove who you are |
| **TLS** | Transport Layer Security - the "S" in HTTPS |
| **AES-256** | A super strong encryption method (256-bit keys) |
| **C4 Model** | A way to draw software architecture in 4 levels of detail |
| **ERD** | Entity Relationship Diagram - shows how data tables relate |
| **PII** | Personally Identifiable Information - data that can identify someone |
| **GDPR** | General Data Protection Regulation - European privacy law |
| **WCAG** | Web Content Accessibility Guidelines - making apps usable for everyone |
| **DDOS** | Distributed Denial of Service - when hackers flood a server |
| **CDN** | Content Delivery Network - speeds up loading by using servers worldwide |

---

## 🎉 Conclusion

This TRD is our **engineering bible**. It will be updated as we learn and grow. Every developer joining the team should read this first!

**Remember:** A good architecture is like a good foundation for a house — build it right, and everything else stands strong. 🏗️

---

*Built with ❤️ by the LokKatha AI Engineering Team*
