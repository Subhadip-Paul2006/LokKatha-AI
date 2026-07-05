# Future Roadmap

LokKatha AI was built over the weekend for this hackathon, but our vision extends far beyond a proof of concept.

## 1. Voice AI & Dialect Preservation
Currently, we rely on the browser's native Web Speech API for Text-to-Speech (TTS). While functional, it lacks emotional cadence.
**Goal**: Integrate advanced TTS models fine-tuned on rural Indic dialects (Bhawaiya, Baul, Santhali) to recreate the true authentic voice of a village storyteller.

## 2. Multi-Modal Vision RAG
Bengali manuscripts are heavily illustrated with Patachitra and Terracotta art.
**Goal**: Embed images alongside text using Google Gemini's multimodal embeddings. This will allow a user to ask "Show me what Behula's raft looked like", and the system will retrieve the exact palm-leaf illustration from 1907.

## 3. Decentralized Archiving
Currently, the knowledge base is a static, curated list imported by our Python pipeline.
**Goal**: Build a "Contribute" portal where rural artists, grandmothers, and folklorists can upload audio recordings. The system will auto-transcribe, summarize, embed, and index their stories into the global public archive.

## 4. Educational API
**Goal**: Release the LokKatha RAG engine as an open API for schools and NGOs, allowing them to build cultural curriculum applications on top of our dataset.
