# 🌟 LokKatha AI — India's Living Cultural Memory

> *"Every time an elder passes away in a village, a library burns to the ground. LokKatha AI ensures their voices live forever."*

[![Theme](https://img.shields.io/badge/Theme-GenAI%20for%20Good-orange.svg)](https://deepmind.google/gemma/)
[![Primary Model](https://img.shields.io/badge/Primary%20Model-Google%20Gemma%204-4285F4.svg)](https://ai.google.dev/gemma)
[![Build With Gemma](https://img.shields.io/badge/Google-Build%20with%20Gemma%20Hackathon-green.svg)](#)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Hackathon%20MVP-brightgreen.svg)](#)

---

## 📜 The Story Behind LokKatha AI

I am a Computer Science student. Alongside my algorithms and system design classes, I spend my weekends volunteering with a local NGO across rural and semi-urban communities. We host health awareness programs, blood donation camps, plastic-free drives, and education campaigns.

During these events, while sitting with elderly villagers, traditional artisans, farmers, folk singers, and temple priests, I realized something heartbreaking.

They carry living history in their memories—forgotten organic farming techniques that survived centuries of drought, folk songs sung only during specific harvest moons, oral accounts of local independence movements, traditional herbal remedies, and stories of community resilience. **None of it has ever been written down.**

Their children are moving to cities or absorbed in digital screens. Nobody is recording their voices. When these elders pass away, hundreds of years of cultural heritage vanish overnight.

```
       [ Rural Elder / Folk Singer / Artisan ]
                          │
            (Holds 100s of years of oral history)
                          │
               ❌ Unrecorded / Forgotten
                          │
             💀 Lost Forever Upon Passing
                          │
      ────────────────────┴────────────────────
     ▼                                         ▼
[ Without LokKatha AI ]                [ With LokKatha AI ]
  Cultural extinction                    Multilingual digital archive
  Knowledge gap                          Gemma 4 powered RAG Q&A
  Generational disconnect                Preserved for eternity
```

I refused to accept that technology must only accelerate the future while erasing the past. I believed Artificial Intelligence could be built to serve humanity's deeper roots—to listen, remember, translate, and pass the torch to future generations.

That belief became **LokKatha AI** — an AI-powered cultural preservation platform built on **Google Gemma 4**, designed to capture, transcribe, translate, index, and query India's endangered oral history.

---

## 🎯 Mission Statement

LokKatha AI is not just another chatbot. It is a **living digital sanctuary** for oral heritage.

- **Listen:** Capture raw field audio interviews from elders, artisans, and storytellers in native accents and dialects.
- **Transcribe:** Convert speech to text using Whisper ASR tuned for Indic phonetic nuances.
- **Translate & Understand:** Leverage **Google Gemma 4** to summarize narratives and translate seamlessly between **English, Bengali, and Hindi**, preserving cultural idioms and respect registers.
- **Index:** Extract cultural tags, historical context, traditional ecological knowledge (TEK), and generate vector embeddings.
- **Interact:** Enable researchers, students, and citizens to converse with preserved stories through natural language RAG (Retrieval-Augmented Generation).

---

## 🏛️ Cultural Design Aesthetics

LokKatha AI's interface is deliberately crafted to step away from cold, generic corporate AI interfaces. It draws inspiration from ancient Indian craftsmanship:

| Motif / Art Form | Design Element Inspired | Visual Expression in App |
| :--- | :--- | :--- |
| **Terracotta Temples** | Warm burnt-clay palette (`#8B4513`, `#C85A32`) | Card borders, grounded containers, warm accents |
| **Palm-Leaf Manuscripts** | Aged parchment texture (`#FDF6E3`, `#F4EAD5`) | Reading views, transcript panels, hero cards |
| **Alpana / Rangoli** | Fine white geometric line art | Section dividers, background motifs, loading spinners |
| **Warli Art** | Minimalistic stick-figure storytelling motifs | Category badges, empty state illustrations |
| **Madhubani** | Vibrant contrast borders & storytelling frames | Highlighted quotes, speaker badges, modal headers |

---

## 🛠️ System Architecture

```mermaid
flowchart TB
    subgraph FIELD ["🎙️ Field Capture Layer"]
        A[Field Volunteer / NGO Worker] -->|Record Audio / Upload| B[Web App / PWA Interface]
        B -->|Consent Form & Metadata| C[FastAPI Backend Gateway]
    end

    subgraph INGEST ["⚡ Ingestion & AI Processing Pipeline"]
        C -->|Raw Audio| D[Whisper ASR Engine]
        D -->|Raw Script| E[Gemma 4 LLM Processing Engine]
        
        subgraph GEMMA ["🧠 Gemma 4 Tasks"]
            E -->|1. Summarize| E1[Narrative Summary]
            E -->|2. Translate| E2[English, Bengali, Hindi]
            E -->|3. Tag| E3[Cultural & TEK Tags]
            E -->|4. Context| E4[Historical Significance]
        end
    end

    subgraph STORAGE ["💾 Dual-Storage Engine"]
        E1 & E2 & E3 & E4 --> F[(PostgreSQL / Supabase)]
        E -->|Dense Embeddings| G[(ChromaDB Vector Store)]
        C -->|Audio File| H[(Supabase Object Storage)]
    end

    subgraph DISCOVERY ["🔍 RAG Discovery & Interactive Q&A"]
        I[Citizen / Student / Researcher] -->|Ask Question in EN/BN/HI| J[RAG Engine]
        J -->|Semantic Hybrid Search| G
        G -->|Top-K Context Chunks| J
        J -->|Context + Query| K[Gemma 4 Reasoning Model]
        K -->|Attributed Answer + Audio Timestamp| I
    end

    style GEMMA fill:#fff3e0,stroke:#e65100,stroke-width:2px
    style FIELD fill:#e8f5e9,stroke:#2e7d32,stroke-width:2px
    style DISCOVERY fill:#e3f2fd,stroke:#1565c0,stroke-width:2px
```

---

## ✨ Key Features & Capabilities

- 🎙️ **Field Recording & Consent System:** Built-in digital consent protocol ensuring narrators retain rights and approve public indexing.
- 🎤 **Multi-dialect ASR (Whisper):** Robust speech-to-text handling background village noise, tractor hums, and regional accents.
- 🧠 **Gemma 4 Cultural Summarizer & Translator:** Translates nuanced regional dialects into standard **English, Bengali, and Hindi** without losing emotional tone or honorifics.
- 🏷️ **Cultural Knowledge Extractor:** Automatically tags stories into categories: *Traditional Ecological Knowledge (TEK)*, *Folk Medicine*, *Agri-wisdom*, *Independence History*, *Mythology*, *Craftsmanship*.
- 🔮 **Cross-Lingual RAG Semantic Search:** Ask in English (*"How did farmers handle flood season in Bengal before dams?"*) and receive answers synthesized from Bengali oral recordings with direct audio timestamps.
- 📊 **NGO Community Dashboard:** Tracks total hours of saved oral history, volunteer leaderboards, regional mapping, and endangered dialect coverage.

---

## 🚀 Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+ (for React Frontend)
- PostgreSQL / Supabase account
- Google Gemini / Gemma API Key (or local Gemma 4 weights via Ollama)

### 1. Repository Setup
```bash
git clone https://github.com/Subhadip-Paul2006/LokKatha-AI.git
cd LokKatha-AI
```

### 2. Backend Environment Setup
```bash
# Create virtual environment
python -m venv .venv

# Activate environment
# On Windows:
.venv\Scripts\activate
# On Linux/macOS:
source .venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### 3. Environment Variables (`.env`)
Create a `.env` file in the root directory:
```env
# Server
PORT=8000
APP_ENV=development

# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/lokkatha
SUPABASE_URL=https://your-supabase-id.supabase.co
SUPABASE_KEY=your-supabase-anon-key

# AI Configuration
GOOGLE_API_KEY=your_google_ai_studio_key
GEMMA_MODEL=gemma-4-12b
WHISPER_MODEL=medium

# Vector DB
CHROMA_DB_PATH=./chroma_db
```

### 4. Run Backend Server
```bash
uvicorn app:app --reload --port 8000
```
API Documentation will be live at `http://localhost:8000/docs`.

---

## 📚 Complete Project Documentation Index

All technical, product, theoretical, and strategic documentation is located in the [`docs/`](docs/) directory:

- 💡 [**Project Idea & Concept**](docs/IDEA.md) — Original project concept, goals, pipeline steps, and FAQ.
- 🔬 [**Research & Feasibility Analysis**](docs/RESEARCH.md) — Domain research, ASR/LLM/RAG technical analysis, ethical framework, and references.
- 🎨 [**Design System & Frontend Specification**](docs/DESIGN_SPEC.md) — Color system, typography, motion, page structure, and component mapping.
- 📋 [**Product Requirements Document (PRD)**](docs/PRD.md) — Product vision, user personas, functional specs & feature matrix.
- 🔧 [**Technical Requirements Document (TRD)**](docs/TRD.md) — Architectural blueprints, C4 models, ERDs, sequence diagrams.
- 📚 [**Theoretical Framework (THEORY)**](docs/THEORY.md) — ASR math, LLM tokenization, embedding mechanics, and RAG theory.
- 📘 [**Complete Project Explanation**](docs/PROJECT_EXPLANATION.md) — Problem statement, SDGs, API specifications, Gemma prompt design.
- 📊 [**Slide-by-Slide PPT Master Guide**](docs/PPT_STRUCTURE.md) — Full deck architecture with visual cues, colors, animations & speaker notes.
- 🎯 [**Hackathon Pitch Deck**](docs/PITCH_DECK.md) — Winning pitch structure, hook, business model, and closing statement.
- 🎬 [**Second-by-Second Demo Script**](docs/DEMO_SCRIPT.md) — Screen actions, speaker script, applause triggers, and API backup fallback.
- ❓ [**Judges FAQ Playbook (160 Q&As)**](docs/JUDGES_FAQ.md) — 50 Tech, 50 Product, 20 AI, 20 Gemma-specific & 20 Social Impact Q&As.
- 🖌️ [**UI/UX Design & Brand System**](docs/DESIGN_SYSTEM_UIUX.md) — Cultural motifs, wireframes, logo/mascot specs, empty/loading states.
- 💡 [**Hackathon Strategy & MVP Execution**](docs/HACKATHON_STRATEGY_PLAYBOOK.md) — Judge strategy, buzzwords, MVP prioritization & crash survival guide.

---

## 🌐 UN Sustainable Development Goals (SDGs) Alignment

| SDG | Target | LokKatha AI Contribution |
| :--- | :--- | :--- |
| **SDG 11: Sustainable Cities & Communities** | Target 11.4 | Strengthening efforts to protect and safeguard the world's cultural and natural heritage. |
| **SDG 4: Quality Education** | Target 4.7 | Ensuring learners acquire appreciation of cultural diversity and heritage contribution. |
| **SDG 10: Reduced Inequalities** | Target 10.2 | Empowering and promoting social inclusion of rural elderly and indigenous communities. |

---

## 🤝 Community & NGO Partnerships

LokKatha AI is designed as an **open-access tool for grassroots organizations**. If you represent an NGO working in rural education, tribal rights, or cultural preservation, please reach out to integrate LokKatha AI into your field operations.

---

## 📄 License

This project is open-sourced under the **Apache 2.0 License** in alignment with the spirit of Google Gemma's open-weight model release.

---

<p center="align">
  <i>Made with ❤️ by a student volunteer for India's unsung storytellers.</i>
</p>
