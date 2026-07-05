# 🌟 LokKatha AI — India's Living Cultural Memory

> *"Every time an elder passes away in a village, a library burns to the ground. LokKatha AI ensures their voices live forever."*

[![Theme](https://img.shields.io/badge/Theme-GenAI%20for%20Good-orange.svg)](https://deepmind.google/gemma/)
[![Primary Model](https://img.shields.io/badge/Primary%20Model-Google%20Gemma-4285F4.svg)](https://ai.google.dev/gemma)
[![Build With Gemma](https://img.shields.io/badge/Google-Build%20with%20Gemma%20Hackathon-green.svg)](#)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](LICENSE)
[![Status](https://img.shields.io/badge/Status-Hackathon%20Submission-brightgreen.svg)](#)

---

## 📸 Screenshots & Demo

![LokKatha AI Demo Placeholder](https://via.placeholder.com/800x450.png?text=Demo+GIF+Placeholder)

*Capture of the beautiful manuscript interface and semantic RAG search in action.*

---

## 🏛️ What is LokKatha AI?

LokKatha AI is a **Retrieval-Augmented Generation (RAG)** platform built to digitally archive and resurrect India's dying oral history and folklore. Built entirely on **Next.js**, **Google Gemma**, and **Supabase**, it allows users to semantically converse with ancient Bengali manuscripts (like *Thakurmar Jhuli*).

It does not generate fake mythology. Every answer is strictly grounded in genuine, digitized anthropological texts, proving its cultural integrity.

---

## 🛠️ Architecture

LokKatha AI uses a highly optimized Next.js Edge architecture.

```mermaid
graph TD
    User([User]) --> |Queries| API[/api/chat]
    API --> Embed[Google Embedding API]
    Embed --> RAG[pgvector Similarity Search]
    RAG --> Supabase[(Supabase)]
    Supabase --> |Top-K Stories| Context[Context Builder]
    Context --> Gemma[Google Gemma]
    Gemma --> |Streams Response| User
```

For an in-depth look, see [`docs/architecture.md`](docs/architecture.md).

---

## 🚀 Setup & Installation

### 1. Repository Setup
```bash
git clone https://github.com/Subhadip-Paul2006/LokKatha-AI.git
cd LokKatha-AI
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Variables
Create a `.env.local` file:
```env
GOOGLE_API_KEY=your_gemini_api_key
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the Dev Server
```bash
npm run dev
```
Visit `http://localhost:3000` to interact with LokKatha AI.

---

## 📚 Technical Documentation

Explore our exhaustive open-source documentation:
- 🏛️ [**Architecture**](docs/architecture.md) — Mermaid diagrams and layer specs.
- 🗄️ [**Database & Vector Search**](docs/database.md) — `pgvector` SQL schema.
- 🔌 [**API Reference**](docs/api.md) — SSE streaming specs.
- 🧠 [**RAG Engine**](docs/rag.md) — How we prevent hallucination.
- 🐍 [**Import Pipeline**](docs/pipeline.md) — How we extract old PDFs.
- 🔮 [**Future Scope**](docs/future.md) — Multimodal and Voice models.
- ⚖️ [**Judges FAQ**](docs/judges-faq.md) — Critical pitch Q&A.

---

## 👨‍💻 Judge Mode (Developer Telemetry)

During evaluation, you can activate the hidden **Judge Mode** telemetry. 
Press `Ctrl + Shift + D` while interacting with the chat to reveal exact milliseconds for Vector Retrieval, Prompt generation, and database matching thresholds inline within every message.

---

## 📄 License
This project is open-sourced under the **Apache 2.0 License**.

---
<p align="center">
  <i>Built for the Google Gemma Hackathon to preserve what truly matters.</i>
</p>
