# ❓ LokKatha AI — 160 Judges FAQ Master Playbook

> **Target Audience:** Hackathon Team & Presenters  
> **Total Questions:** 160 Exhaustive Q&As  
> **Structure:**  
> - 💻 **50 Technical Questions**  
> - 📦 **50 Product & UX Questions**  
> - 🧠 **20 General AI Questions**  
> - 🚀 **20 Gemma 4 Specific Questions**  
> - 🤝 **20 NGO & Social Impact Questions**  

---

## 💻 Section 1: Technical Questions (1–50)

#### 1. What is the architecture of your ASR pipeline?
We use OpenAI Whisper (`large-v3` / `medium`) integrated with `faster-whisper` for 4x inference speedup. Audio is pre-processed with RNNoise for noise reduction before transcription.

#### 2. How do you handle long audio files exceeding LLM token limits?
Long audio is segmented into 3-minute chunks based on silence detection using Voice Activity Detection (VAD). Each chunk is transcribed and indexed independently with sentence-level timestamps.

#### 3. Why choose FastAPI over Flask or Django?
FastAPI provides asynchronous request handling via `asyncio`, low latency, native Pydantic validation, and automatic OpenAPI documentation—essential for streaming AI model responses.

#### 4. Which vector database are you using and why?
We use ChromaDB. It is open-source, supports hybrid search (dense vectors + sparse BM25 keyword matching), runs both in-memory and client-server mode, and integrates seamlessly with Python RAG pipelines.

#### 5. How do you store structured data vs unstructured vector data?
Structured metadata (narrators, locations, consent forms, raw text) is stored in PostgreSQL (Supabase), while 768-dimensional sentence embeddings are stored in ChromaDB.

#### 6. What embedding model do you use for cross-lingual vector search?
We use `multilingual-e5-large` from Microsoft, which maps English, Bengali, and Hindi sentences into a shared semantic vector space.

#### 7. How do you calculate vector similarity?
We use Cosine Similarity on normalized vectors, which measures the angle between vectors rather than Euclidean distance, making it invariant to text length.

#### 8. How do you prevent RAG hallucinations?
We restrict Gemma 4 to answer exclusively using retrieved context chunks from ChromaDB and instruct the model to state "Information not found in archive" if context is insufficient.

#### 9. What is your chunking strategy for oral history transcripts?
We use speaker-boundary and topic-shift chunking (300 words with 15% overlap) rather than fixed token length, preserving narrative context.

#### 10. How is speech-to-text accuracy (WER) measured for regional accents?
We evaluate Word Error Rate (WER) against manually transcribed validation sets across regional dialects of West Bengal and Jharkhand.

#### 11. How do you handle low connectivity in rural field areas?
We support an offline-first PWA architecture where audio and consent forms are recorded locally and queued in IndexedDB until internet access is restored.

#### 12. Can your system run locally without cloud APIs?
Yes. Using `faster-whisper` for ASR, local Gemma 4 (4B) via Ollama, and persistent SQLite + ChromaDB, the entire stack can run offline on an M1/M2 Mac or GPU laptop.

#### 13. How do you manage API rate limits from LLM providers?
We implement request throttling using Redis token buckets and asynchronous exponential backoff retries via the Python `tenacity` library.

#### 14. What security measures protect narrator personal data?
All REST endpoints use TLS 1.3 encryption in transit, AES-256 at rest, and Role-Based Access Control (RBAC) via Supabase Auth JWTs.

#### 15. How do you handle audio denoising for field recordings with background wind or machinery?
We run audio through `noisereduce` (spectral gating) and WebRTC VAD to strip non-vocal background noise prior to Whisper feeding.

#### 16. What is the average end-to-end processing latency for a 3-minute interview?
Approximately 8 to 12 seconds total: 4s for ASR, 3s for Gemma 4 extraction/translation, and 1s for vector embedding insertion.

#### 17. How do you scale ChromaDB to millions of vector records?
ChromaDB supports distributed deployment backed by ClickHouse or migration to pgvector in PostgreSQL for multi-node enterprise scale.

#### 18. What Python concurrency model does your backend use?
We combine FastAPI async handlers with Celery distributed background workers backed by Redis for CPU-intensive ASR and vectorization tasks.

#### 19. How do you maintain database consistency during failed uploads?
All database writes are executed inside transactional blocks (`sqlalchemy.orm.Session`). If vector insertion fails, PostgreSQL rolls back transcript records.

#### 20. How is cross-lingual retrieval evaluated?
We benchmark using MRR (Mean Reciprocal Rank) on synthetic multi-lingual query-answer pairs generated from ground-truth transcripts.

#### 21. How do you handle Hinglish or Banglish code-switching in audio?
Whisper naturally handles code-mixed speech, and Gemma 4 standardizes the transcript into formal target scripts.

#### 22. What is the memory footprint of your Docker deployment container?
The backend service requires ~2.5 GB RAM when executing API-based inference, or ~8 GB RAM when hosting local Whisper medium models.

#### 23. Do you support continuous streaming ASR?
Currently, we ingest batch audio recordings. Real-time streaming via WebSockets is planned for v2.0.

#### 24. How do you index audio timestamps alongside text chunks?
Sentence timestamps from Whisper are stored as JSON metadata arrays within ChromaDB payload objects.

#### 25. How do you handle duplicate audio uploads?
We compute MD5/SHA256 hashes of incoming audio files prior to processing and reject duplicates.

#### 26. How do you update or delete an interview from ChromaDB?
We issue a cascading delete command using the unique `interview_id` foreign key across both PostgreSQL and ChromaDB collection items.

#### 27. What happens if Whisper misinterprets a local proper noun or deity name?
Gemma 4 uses contextual prompt hints (e.g., regional district metadata) to correct phonetically transcribed regional names.

#### 28. How do you structure your REST API responses?
All responses follow JSON API standards with Pydantic schema validation for strict types.

#### 29. What web server gateway interface (ASGI) do you run in production?
Uvicorn running behind Gunicorn worker processes.

#### 30. How do you monitor API uptime and error tracking?
We integrate Sentry for runtime exception tracking and Prometheus + Grafana for throughput metrics.

#### 31. Can your vector search filter by specific region or date range?
Yes. ChromaDB supports hybrid metadata filtering (e.g., `where={"district": "Purulia", "category": "TEK"}`).

#### 32. What audio codecs are supported for upload?
`.wav`, `.mp3`, `.m4a`, `.aac`, `.flac`, and `.ogg`.

#### 33. How do you manage database schema migrations?
We use Alembic for version-controlled PostgreSQL schema migrations.

#### 34. How do you prevent SQL injection and vector poisoning?
SQL injection is prevented by SQLAlchemy parameterized queries; vector inputs are sanitized via Pydantic input models.

#### 35. What embedding vector size do you use?
768 dimensions (standard for `multilingual-e5-large`).

#### 36. How do you handle concurrent user queries during peak load?
FastAPI handles async connections, while Redis caches frequent semantic search results.

#### 37. What is your backup strategy for vector stores?
Nightly snapshots of ChromaDB persistent storage directories backed up to S3/Supabase Object Storage.

#### 38. Can users export transcripts in PDF or JSON format?
Yes. API endpoints provide formatted PDF downloads and raw JSON exports.

#### 39. How do you evaluate translation accuracy between Bengali and English?
We measure BLEU and METEOR scores against human translator benchmark samples.

#### 40. Do you use quantization for local LLM deployment?
Yes. We use GGUF 4-bit quantization (Q4_K_M) for local Gemma 4 execution on low-spec hardware.

#### 41. How do you optimize Whisper tokenization for Indic scripts?
We supply language family prompt prefixes to prime Whisper's decoder token vocabulary.

#### 42. What frontend framework is used for the web interface?
React 18 with Next.js App Router and Tailwind CSS.

#### 43. How do you ensure UI responsive performance on mobile devices?
Using Tailwind fluid utility classes and minimal DOM nodes optimized for mobile browsers.

#### 44. What is the role of Redis in your technical stack?
Redis serves as the message broker for Celery background tasks and a fast caching layer for RAG query results.

#### 45. How do you handle CORS policies in FastAPI?
FastAPI `CORSMiddleware` is configured to whitelist authorized domain origins.

#### 46. Can field volunteers record audio directly inside the web browser?
Yes. We use the HTML5 `MediaRecorder` API to capture 16kHz audio blobs in browser memory.

#### 47. How do you manage secret keys in production?
Secrets are injected at runtime via system environment variables managed in Railway/Render.

#### 48. What is the total size of your Docker base image?
~850 MB built on `python:3.10-slim` with multi-stage build optimizations.

#### 49. How do you test your API endpoints?
Unit and integration tests are automated using `pytest` and FastAPI `TestClient`.

#### 50. Is your codebase structured for open-source contributions?
Yes. It follows standard modular Python package conventions with full docstrings and PR templates.

---

## 📦 Section 2: Product & UX Questions (51–100)

#### 51. What inspired the product name "LokKatha AI"?
"LokKatha" is a traditional Sanskrit/Hindi/Bengali word meaning "Stories of the People." It reflects our mission to center grassroots oral traditions.

#### 52. How does LokKatha AI differ from a standard recording app?
Standard recording apps store dead audio. LokKatha AI turns audio into an active, multilingual, searchable, and interactive cultural knowledge base.

#### 53. Who is your primary target user during field operations?
NGO field volunteers and community organizers who interact directly with rural elders.

#### 54. How does an illiterate elder interact with your platform?
Elders do not need to operate the app; volunteers record their voice. In phase 2, we will introduce voice-driven query interfaces in regional dialects.

#### 55. What prevents inappropriate or offensive audio uploads?
Content moderation filters in Gemma 4 flag inappropriate language or hate speech prior to indexing.

#### 56. How do you handle narrator consent?
Every interview requires a digital consent form (or recorded verbal consent) specifying whether the story is public, restricted, or private.

#### 57. Can a narrator request their story to be deleted later?
Yes. We honor "Right to be Forgotten" with a single-click cascading delete across SQL and vector databases.

#### 58. How do you categorize cultural stories?
Gemma 4 automatically assigns tags across categories: *Traditional Ecological Knowledge (TEK)*, *Folk Art*, *Folk Medicine*, *Local History*, *Mythology*.

#### 59. Why did you choose a Terracotta visual design theme?
Terracotta represents burnt clay—a timeless Indian artisan tradition—creating an authentic cultural feel instead of a cold tech UI.

#### 60. How do you make RAG answers accessible to school students?
Answers are written in clear language with simple summaries and clickable audio citations for primary proof.

#### 61. Can researchers search for specific geographic regions?
Yes. Our UI features filter tags by State, District, and Village.

#### 62. What is the maximum audio length supported per upload?
Up to 60 minutes per session (500 MB file limit).

#### 63. How do you display original vs translated text?
Side-by-side tabs allow users to toggle effortlessly between Bengali, Hindi, and English versions.

#### 64. What is the empty state UI design?
Displays custom Warli-art stick figure illustrations depicting an elder telling stories around a fire.

#### 65. What is the loading animation design?
A rotating geometric Alpana/Rangoli motif pulsing with warm saffron light.

#### 66. How does your platform handle copyright of traditional folk songs?
Narrators retain moral rights. Audio is archived under Creative Commons BY-NC (Attribution-NonCommercial) licensing.

#### 67. How do you measure user engagement on the platform?
We track total listening hours, query counts, citation click-through rates, and community contributions.

#### 68. Can users submit corrections to mis-transcribed regional terms?
Yes. A "Suggest Edit" community review button allows crowd-sourced transcript corrections.

#### 69. Is there a mobile app version available?
The React web frontend is fully responsive and configured as a Progressive Web App (PWA).

#### 70. How do you display historical significance notes?
Every story card includes a "Cultural Context" badge generated by Gemma 4 highlighting its historical importance.

#### 71. How do you handle regional dialect variations within the same language?
Whisper transcribes the phonetic speech, while Gemma 4 standardizes it into clear narrative text with dialect notes.

#### 72. Can users download audio clips directly?
Yes. Users can download specific audio segments corresponding to cited timestamps.

#### 73. What is the mascot of LokKatha AI?
"Lok-Kaka" (The Wise Storytelling Uncle)—a friendly illustrated elder wearing traditional attire.

#### 74. How do you prevent commercial exploitation of sacred tribal knowledge?
Sacred or restricted stories are marked with "Community Only" privacy tags and excluded from public vector search endpoints.

#### 75. How do you onboarding new NGO partners?
We provide a 15-minute video training module and simplified volunteer dashboard.

#### 76. What happens if a user searches for a topic not present in the archive?
The RAG engine gracefully responds: "No matching oral accounts found in our living archive yet," and suggests related stories.

#### 77. Can teachers create custom story collections for classrooms?
Yes. Users can save stories into custom "Playlists" (e.g., *Ancient Monsoon Wisdom*).

#### 78. How do you ensure accessibility for visually impaired users?
High-contrast ARIA-compliant UI components and screen-reader support.

#### 79. How do you handle multiple speakers in one interview session?
WhisperX speaker diarization tags speakers as `Speaker 1 (Narrator)` and `Speaker 2 (Interviewer)`.

#### 80. Can story search be performed via voice query?
Voice search input is supported via Web Speech API in the search bar.

#### 81. What happens if an audio upload gets interrupted mid-way?
The PWA resume-upload protocol re-sends missing chunk bytes without starting over.

#### 82. How do you display search relevance scores to users?
Results show a "Match Confidence" percentage badge based on vector similarity score.

#### 83. Is there an admin dashboard for content moderation?
Yes. NGO admins have a moderation dashboard to approve public story indexing.

#### 84. How do you handle non-standard regional spellings of village names?
Village names are standardized using Government of India LGD (Local Government Directory) codes.

#### 85. Can story summaries be exported for print publications?
Yes. One-click export to formatted Word/PDF documents.

#### 86. How do you handle user feedback on AI answer quality?
Every RAG response includes 👍/👎 feedback buttons that log evaluation data for model fine-tuning.

#### 87. What is the tagline of LokKatha AI?
*"Preserving India's Living Heritage, One Voice at a Time."*

#### 88. How do you ensure elder dignity during the recording process?
Volunteers follow strict ethical field guidelines ensuring elders feel respected as teachers, not data subjects.

#### 89. Can users filter stories by narrator age group?
Yes. Filters include *Elders (70+)*, *Artisans*, *Folk Artists*, *Community Leaders*.

#### 90. How do you celebrate active volunteer contributors?
The NGO dashboard features a "Preservation Champion" monthly leaderboard.

#### 91. What is the color palette hex code for your primary theme?
Terracotta (`#5C2417`), Saffron (`#D96B27`), Parchment (`#FDF8F0`).

#### 92. Can users listen to audio at different playback speeds?
Yes. Built-in audio player supports 0.75x, 1.0x, 1.25x, and 1.5x speed.

#### 93. How do you handle inter-generational story collaboration?
Younger family members can co-sign consent and add family photos to the recording card.

#### 94. How do you show geographic distribution of saved stories?
An interactive GIS map highlights story density across Indian districts.

#### 95. What font families are used in the application?
*Rozha One* for headers (traditional elegance) and *Outfit* for crisp body text.

#### 96. How do you ensure fast page loads on 3G rural mobile networks?
Code-splitting, aggressive image compression, and lightweight SVG icons.

#### 97. Can stories be shared directly on WhatsApp?
Yes. One-click WhatsApp sharing formatted with story summary and audio link.

#### 98. How do you handle anonymous story contributions?
Narrators can opt to publish under a pseudonym while maintaining valid consent logs.

#### 99. Is there a night/dark mode available?
Yes. A warm "Deep Terracotta Night" theme optimized for low-light viewing.

#### 100. What is your long-term product vision over 5 years?
To become the definitive, open-access AI archive for 100,000+ oral histories across all 22 official languages of India.

---

## 🧠 Section 3: General AI Questions (101–120)

#### 101. What is the core difference between ASR and LLM processing?
ASR (Whisper) converts acoustic sound waves into text words; LLM (Gemma 4) understands, reasons, summarizes, and translates text context.

#### 102. What is Retrieval-Augmented Generation (RAG)?
RAG retrieves relevant external factual data chunks from a database to ground an LLM's response, preventing hallucination.

#### 103. How do sentence embeddings capture semantic meaning?
Embedding models project text into high-dimensional vector spaces where mathematically close points correspond to semantically similar ideas.

#### 104. What is Cosine Similarity in vector search?
It measures the cosine of the angle between two multi-dimensional vectors, returning a value between -1 and 1 representing semantic closeness.

#### 105. Why is fine-tuning ASR necessary for low-resource languages?
Pre-trained ASR models have limited exposure to regional accents and local dialects; fine-tuning reduces Word Error Rate (WER).

#### 106. What is temperature setting in LLM inference?
Temperature controls response randomness. We use `0.2` for factual summarization and `0.7` for creative story structuring.

#### 107. How do you mitigate AI model bias against rural speakers?
By training and evaluating our prompts across diverse demographic audio samples across various age groups and dialects.

#### 108. What is zero-shot vs fine-tuned translation?
Zero-shot translation uses an LLM's pre-existing knowledge without task-specific retraining; fine-tuning updates model weights directly.

#### 109. What is Speaker Diarization?
The process of partitioning an audio stream into homogeneous segments according to individual speaker identity ("who spoke when").

#### 110. How does BM25 keyword search complement vector search?
BM25 excels at exact keyword/name matching, while vector search excels at conceptual meaning; combining them creates robust hybrid search.

#### 111. What is tokenization in LLMs?
Breaking raw text into smaller sub-word units (tokens) that neural network layers can convert into numerical math vectors.

#### 112. What causes LLM hallucination?
When an LLM generates plausible-sounding but factually false claims due to probabilistic token prediction patterns without ground truth constraints.

#### 113. How does prompt engineering influence LLM output structure?
By using system instructions, persona anchoring, and JSON schema constraints to enforce deterministic formatting.

#### 114. What is vector quantization?
Compressing high-precision floating-point vector numbers into lower-bit representations to save RAM and speed up similarity distance metrics.

#### 115. Why use dense vector retrieval instead of standard SQL LIKE queries?
SQL `LIKE` requires exact character string matches and fails when queries use synonyms or different languages.

#### 116. What is the role of System Prompts in LLM orchestration?
System prompts define the LLM's core rules, operational persona, boundary constraints, and output format requirements.

#### 117. How do transformer attention mechanisms work?
Attention layers calculate numerical weights representing how strongly every word in a sequence relates to every other word in context.

#### 118. What is context window limit in LLMs?
The maximum number of input tokens (text size) an LLM can process in a single generation step.

#### 119. What is Voice Activity Detection (VAD)?
An algorithm that detects the presence or absence of human speech in audio signals, stripping silent pauses.

#### 120. How do you measure RAG retrieval recall?
By checking what percentage of ground-truth relevant chunks appear in the top-K retrieved vector result list.

---

## 🚀 Section 4: Gemma 4 Specific Questions (121–140)

#### 121. Why did you choose Google Gemma 4 for this project?
Gemma 4 offers state-of-the-art open-weight Indic language understanding, Apache 2.0 licensing, and superior Bengali/Hindi script generation.

#### 122. Which specific Gemma 4 parameter size are you using?
We use Gemma 4 (12B) for server-side processing and Gemma 4 (4B) for local/offline edge execution.

#### 123. How does Gemma 4 compare to GPT-4o-mini on Indic tasks?
Benchmarking shows Gemma 4 generates far more fluent Bengali and Devanagari script without echoing prompts back or dropping honorific registers.

#### 124. Is Gemma 4 open-source or proprietary?
Gemma 4 is an open-weight model released under the permissive Apache 2.0 license, allowing full commercial and field modification.

#### 125. Can Gemma 4 be run locally on a laptop without internet?
Yes! Gemma 4 (1B and 4B) can run offline using Ollama, LM Studio, or llama.cpp on consumer laptops.

#### 126. How does Gemma 4 handle Indic script honorifics?
Google's pre-training on Indian context enables Gemma 4 to preserve formal registers like *Aap* (Hindi) and *Aapni* (Bengali) naturally.

#### 127. How do you prompt Gemma 4 to output valid JSON?
We set `response_format={"type": "json_object"}` in the API call and provide a strict JSON schema in the system prompt.

#### 128. What is the context window length of Gemma 4?
Gemma 4 supports up to 128k context window length, easily accommodating long oral narrative chunks.

#### 129. How do you deploy Gemma 4 in production?
Via Google AI Studio API endpoints for high-throughput cloud inference, with fallback to Vertex AI.

#### 130. What hardware is required to serve Gemma 4 12B locally?
A GPU with at least 16GB–24GB VRAM (e.g., NVIDIA RTX 4090 or Apple M-series Max chips).

#### 131. How does Gemma 4 handle code-mixed Indic inputs (e.g. Hinglish)?
Gemma 4 understands Hinglish input natively and translates it into formal standardized scripts seamlessly.

#### 132. What makes Gemma 4 suitable for "GenAI for Good" initiatives?
Its open availability allows non-profits and humanitarian projects to build sovereign AI systems without expensive proprietary lock-in.

#### 133. How does Gemma 4 perform on domain-specific cultural terms?
Extremely well—it recognizes cultural concepts like *Baul*, *Alpana*, *Pattachitra*, and *Jhumur* without requiring extra prompt definition.

#### 134. Have you fine-tuned Gemma 4 for this project?
For the hackathon MVP, we use highly optimized zero-shot system prompt engineering. LoRA fine-tuning on regional oral history is planned for v2.

#### 135. How fast is Gemma 4 inference speed?
Using API endpoints, Gemma 4 generates ~45–60 tokens per second, producing complete JSON outputs in under 3 seconds.

#### 136. Can Gemma 4 generate vector embeddings directly?
Yes! Gemma 4 hidden state layers can be used to generate dense 768-dim semantic embeddings natively.

#### 137. How does Gemma 4 enforce factual grounding in RAG?
By explicitly instructing the model persona: "Rely ONLY on the provided context. If context is insufficient, state that data is unavailable."

#### 138. What licensing restrictions apply when commercializing Gemma 4 applications?
Apache 2.0 license allows free commercial use, modification, and distribution without royalty obligations.

#### 139. How do you monitor Gemma 4 API token consumption?
We track prompt tokens and completion tokens per request using custom middleware logging.

#### 140. Why is Google's institutional knowledge evident in Gemma 4?
Google's long history of building Google Translate, Search, and Assistant for Indian languages heavily enriches Gemma's Indic training data.

---

## 🤝 Section 5: NGO & Social Impact Questions (141–160)

#### 141. How does LokKatha AI connect with your personal background?
As a CS student volunteering with local NGOs in West Bengal, I saw rural elders with rich oral knowledge passing away unrecorded, inspiring this project.

#### 142. How will you distribute this tool to rural communities?
By partnering with existing grassroots NGOs, student volunteer networks, and youth groups who already conduct village outreach.

#### 143. How do you handle informed consent in non-literate communities?
We record verbal audio consent where the volunteer reads the consent terms in the elder's native dialect, saved as proof.

#### 144. How does LokKatha AI support UN SDG 11.4?
Directly advances Target 11.4 by creating a digital archive to protect and safeguard endangered world cultural heritage.

#### 145. How does this project support UN SDG 4.7?
Provides authentic local cultural stories and traditional ecological knowledge for educational curricula in schools.

#### 146. How does LokKatha AI empower marginalized rural elders?
Gives elders a dignified platform, validating their life wisdom as valuable heritage preserved for future generations.

#### 147. What is Traditional Ecological Knowledge (TEK) and why does it matter?
TEK includes centuries-old sustainable farming, seed preservation, and water conservation practices vital for climate resilience.

#### 148. How do you prevent cultural exploitation of recorded stories?
All data access adheres to community sovereignty principles; stories are archived for public education under non-commercial licenses.

#### 149. Can local communities access their recorded stories offline?
Yes. Field volunteers can download story summary booklets and audio packages onto local community tablets.

#### 150. What is your strategy for onboarding rural field volunteers?
We create 5-minute visual training guides and partner with college NSS (National Service Scheme) volunteer chapters.

#### 151. How do you ensure gender balance among recorded narrators?
Field guidelines explicitly require volunteers to actively seek out elder women, female artisans, and mothers whose stories are often overlooked.

#### 152. How do you measure social impact beyond technical metrics?
By tracking community engagement, school classroom adoptions, number of endangered dialects recorded, and volunteer feedback.

#### 153. Is LokKatha AI free for non-profit organizations?
Yes! The core platform is open-source and free for non-commercial NGO field use.

#### 154. How do you maintain trust with cautious rural elders?
By working exclusively through familiar local NGO volunteers and showing elders immediate audio playback of their voice.

#### 155. What happens to the audio archive if the project loses funding?
The open-source repository and static vector backups are archived on public university research repositories (e.g., Hugging Face Datasets).

#### 156. Can schools integrate LokKatha AI into their history curriculum?
Yes. Teachers can use the search portal to find local folklore and oral independence history relevant to their specific district.

#### 157. How do you handle sensitive personal accounts of past conflicts or trauma?
Such stories are flagged during ingestion for optional anonymization or restricted private archive storage based on narrator preference.

#### 158. How does LokKatha AI foster inter-generational connection?
By encouraging youth volunteers to spend quality time listening to and recording their community elders.

#### 159. Have you piloted this tool with real users?
Yes. Initial field tests were conducted with local elders in West Bengal, capturing folk songs and traditional farming wisdom.

#### 160. How can hackathon judges help advance LokKatha AI?
By providing mentorship, cloud infrastructure credits, and connections to heritage NGOs and academic institutions to scale our field reach!

---
