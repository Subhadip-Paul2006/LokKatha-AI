# LokKatha AI — Backend (FastAPI)

Python backend for **LokKatha AI**, an AI-powered cultural preservation platform.
This lives inside the monorepo at `backend/` alongside the Next.js frontend.

> **Phase 01** — Project scaffold complete. No AI/DB/upload features yet.

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Language | Python 3.12+ |
| Framework | FastAPI |
| Server | Uvicorn |
| Configuration | python-dotenv + pydantic-settings |
| Validation | Pydantic |
| Database (later) | Supabase PostgreSQL |
| Storage (later) | Supabase Storage |
| AI (later) | Google Gemma 4 |
| Speech (later) | faster-whisper |

---

## Project Structure

```
backend/
├── app/
│   ├── api/                  # HTTP route layer
│   │   ├── v1/               # Versioned endpoints
│   │   │   └── health.py     # GET / health check
│   │   └── router.py         # Aggregates all API routers
│   ├── core/                 # Cross-cutting infrastructure
│   │   ├── config.py         # Environment settings (Pydantic)
│   │   ├── logging.py        # Logging setup
│   │   ├── cors.py           # CORS middleware
│   │   └── lifespan.py       # Startup / shutdown events
│   ├── database/             # DB connections (Phase 02+)
│   ├── services/             # Business logic (Phase 02+)
│   ├── models/               # ORM models (Phase 02+)
│   ├── schemas/              # Pydantic DTOs (Phase 02+)
│   ├── prompts/              # Gemma prompt templates (Phase 03+)
│   ├── utils/                # Shared helpers
│   └── main.py               # App factory + Uvicorn entry
├── uploads/                  # Local audio staging (git-ignored)
├── tests/                    # Test suite
├── requirements.txt
└── .env                      # Local environment (git-ignored)
```

### Architecture Decisions

| Decision | Reason |
|----------|--------|
| `app/api/v1/` | API versioning from day one |
| `app/api/router.py` | Keeps `main.py` thin |
| `app/core/lifespan.py` | Modern FastAPI lifecycle |
| `app/core/config.py` | Single source of truth for env vars via Pydantic |
| `create_app()` factory | Enables DI and testability |

---

## Quick Start

```bash
# From the repo root
cd backend

# 1. Create virtual environment
python -m venv .venv
.venv\Scripts\activate        # Windows
source .venv/bin/activate     # macOS / Linux

# 2. Install dependencies
pip install -r requirements.txt

# 3. Configure environment
#    Copy .env template and set values (see below)

# 4. Run the server
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

Verify: `curl http://localhost:8000/`  
Expected: `{"status": "healthy", "project": "LokKatha AI"}`  
API Docs: http://localhost:8000/docs

---

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `APP_NAME` | `LokKatha AI` | Application display name |
| `APP_ENV` | `development` | `development` \| `staging` \| `production` |
| `DEBUG` | `false` | FastAPI debug mode |
| `LOG_LEVEL` | `INFO` | Logging verbosity |
| `HOST` | `0.0.0.0` | Bind address |
| `PORT` | `8000` | Bind port |
| `CORS_ORIGINS` | `http://localhost:3000` | Comma-separated allowed origins |
| `SUPABASE_URL` | — | Supabase project URL (Phase 02+) |
| `SUPABASE_ANON_KEY` | — | Supabase anon key (Phase 02+) |
| `SUPABASE_SERVICE_ROLE_KEY` | — | Service role key (Phase 02+) |
| `SUPABASE_DB_URL` | — | PostgreSQL connection string (Phase 02+) |

---

## Phase Roadmap

| Phase | Scope |
|-------|-------|
| **01 (current)** | Project init, health check, logging, CORS, lifecycle |
| **02** | Supabase DB models, storage, upload pipeline |
| **03** | faster-whisper transcription, Gemma 4 RAG |

---

## Development Notes

- All route handlers are **async**.
- Settings are cached via `get_settings()` and injected through `app.state.settings`.
- Startup / shutdown hooks live in `app/core/lifespan.py`.
- Run commands from the `backend/` directory so `.env` resolves correctly.
