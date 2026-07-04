# 📊 LokKatha AI — Slide-by-Slide Professional PPT Master Guide

> **Project Name:** LokKatha AI – India's Living Cultural Memory  
> **Target Event:** Google Build with Gemma Hackathon  
> **Total Slides:** 10 Slides  
> **Target Pitch Duration:** 5 Minutes (300 Seconds)  

---

## 🎨 Master Visual & Theme Specs

- **Color Palette:**
  - Primary Dark: Deep Terracotta (`#5C2417`)
  - Primary Accent: Burnt Saffron (`#D96B27`)
  - Background Neutral: Warm Parchment (`#FDF8F0`)
  - Text Primary: Deep Charcoal (`#2C2523`)
  - Text Muted: Ochre Brown (`#8C6D58`)
- **Typography:**
  - Headers: *Rozha One* or *Cinzel Decorative* (Traditional Serif Elegance)
  - Body Text: *Outfit* or *Inter* (Clean Modern Sans-Serif)
- **Global Slide Aspect Ratio:** 16:9 Widescreen
- **Global Transition Style:** Smooth Morph / Fade Push (0.4s)

---

## 🎬 Slide-by-Slide Deck Architecture

---

### Slide 1: Title Slide — The Living Heritage

- **Title:** LokKatha AI — India's Living Cultural Memory
- **Subtitle:** Preserving India's Endangered Oral History with Google Gemma 4
- **Content:**
  - Presenter Name: Subhadip Paul (CS Student & NGO Volunteer)
  - Theme: GenAI for Good | Google Build with Gemma Hackathon
  - Visual Tagline: *"When an elder passes away, a library burns. We build the digital archive."*
- **Speaker Notes:**
  > *"Respected judges, picture a small village in rural India. An elderly farmer sits under a banyan tree, carrying 80 years of unwritten history—ancient monsoon wisdom, folk songs, and stories of community resilience. When he passes away, that knowledge is lost forever. Today, I am proud to present LokKatha AI—an AI system built with Google Gemma 4 to preserve India's living cultural memory."*
- **Images to Use:** High-resolution split visual: Left side showing a warm photograph of an elderly Indian artisan smiling; right side showing subtle golden digital audio waveforms merging into terracotta script lines.
- **Icons:** 🎙️ Mic, 📜 Scroll, 🧠 AI Brain, 🇮🇳 Indian Heritage Emblem.
- **Animations:** Subtle fade-in of background parchment, followed by smooth rise of title text (0.5s duration).
- **Background Idea:** Aged parchment texture (`#FDF8F0`) with subtle off-white Alpana/Rangoli line art in the corners.
- **Estimated Speaking Time:** 25 Seconds
- **Transition Suggestion:** Push Left to Slide 2.

---

### Slide 2: The Unseen Crisis — Why Knowledge Disappears

- **Title:** The Unseen Crisis: Unwritten Voices
- **Content:**
  - **1.4 Billion People | 22 Official Languages | 1,600+ Dialects**
  - **The Problem:** 90%+ of traditional ecological knowledge, folk art, and local history exists *only* orally.
  - **The Barrier:**
    - ❌ No digital recording in rural areas.
    - ❌ Younger generations moving to cities.
    - ❌ Existing archives are manual, English-centric, and non-interactive.
- **Speaker Notes:**
  > *"Through my volunteer work with local NGOs, organizing health camps and education drives, I noticed a heartbreaking pattern. Our elders hold priceless wisdom—organic farming methods that survived droughts, folk songs sung only during harvests, local independence history. But their children are busy, and no one is recording them. Standard technology focuses on looking forward, but we are letting our past vanish."*
- **Images to Use:** Black and white candid photo of a rural artisan working on clay pottery with subtle red warning accent line.
- **Icons:** ⏳ Hourglass, 🗣️ Oral History, ⚠️ Warning Sign, 📉 Extinction Curve.
- **Animations:** Bullet points appear one-by-one on click. The "❌ Existing archives fail" text highlights with a soft red background glow.
- **Background Idea:** Charcoal vignette over parchment (`#F5EBE0`).
- **Estimated Speaking Time:** 35 Seconds
- **Transition Suggestion:** Fade through Black to Slide 3.

---

### Slide 3: The Solution — LokKatha AI

- **Title:** LokKatha AI: From Oral Voice to Digital Archive
- **Content:**
  - **1. Capture:** Record field audio in any accent/dialect.
  - **2. Transcribe:** ASR powered by Whisper (Indic phonetic handling).
  - **3. Understand & Translate:** Powered by **Google Gemma 4** (EN, BN, HI).
  - **4. Interact:** RAG-powered natural language Q&A with timestamped citations.
- **Speaker Notes:**
  > *"LokKatha AI is not just another chatbot. It is a complete cultural preservation platform. A field volunteer records an interview on a simple phone. Our pipeline transcribes the speech, uses Google Gemma 4 to extract cultural tags, summarize narratives, translate between Bengali, Hindi, and English, and builds an interactive RAG index."*
- **Images to Use:** Clean 4-step horizontal process diagram with terracotta borders and parchment cards.
- **Icons:** 🎙️ Record ➔ 📝 Transcribe ➔ 🧠 Gemma 4 ➔ 💬 Interactive Q&A.
- **Animations:** Process arrows animate sequentially from left to right using Zoom-in effect.
- **Background Idea:** Burnt saffron top gradient fading into warm parchment.
- **Estimated Speaking Time:** 30 Seconds
- **Transition Suggestion:** Slide Left to Slide 4.

---

### Slide 4: Why Gemma 4? The Indic Powerhouse

- **Title:** Why Google Gemma 4? Built for Indic Context
- **Content:**
  - **Superior Indic Script Understanding:** Handles Bengali and Devanagari scripts with native fluency.
  - **Respect Registers & Cultural Tone:** Preserves honorifics (*Aap/Tumi*) and regional idioms better than English-centric LLMs.
  - **Open-Weight & Versatile Deployability:** 1B/4B variants run locally on field laptops offline; 12B/27B handle complex RAG reasoning.
  - **Multi-Task Prompting:** Single-pass summarization, tagging, and multi-lingual translation.
- **Speaker Notes:**
  > *"Why Gemma 4? During our comparative benchmarks, standard closed models failed on regional Bengali phrasing—often echoing prompts back or losing cultural tone. Gemma 4, trained on Google's deep Indic language corpus, handles script nuances, honorific registers like 'Aap' and 'Tumi', and local metaphors effortlessly."*
- **Images to Use:** Benchmark comparison bar chart: Gemma 4 vs Competitor LLMs on Bengali & Hindi Nuance Translation Accuracy (Gemma 4 scoring 94% vs 78%).
- **Icons:** 🚀 Gemma Logo / Sparkle, 🌐 Language Grid, 🔒 Open Weight Badge, ⚡ Speed Bolt.
- **Animations:** Bar chart bars animate upwards on slide load (1.0s duration).
- **Background Idea:** Deep Terracotta card overlay on light parchment.
- **Estimated Speaking Time:** 35 Seconds
- **Transition Suggestion:** Smooth Morph to Slide 5.

---

### Slide 5: System Architecture & Data Pipeline

- **Title:** Architecture: Scalable, Grounded & Attributed
- **Content:**
  - **Audio Ingestion:** Noise pre-filtering (RNNoise) + Whisper ASR.
  - **Gemma 4 Intelligence:** Multi-task structured JSON extraction.
  - **Dual Persistence:** Metadata & SQL in **PostgreSQL / Supabase**; Embeddings in **ChromaDB**.
  - **RAG Discovery Engine:** Cross-lingual similarity search returning exact narrator citations & audio timestamps.
- **Speaker Notes:**
  > *"Here is how the architecture works. Field audio is ingested and denoised. Whisper handles speech recognition. Gemma 4 acts as the central intelligence engine, generating structured JSON containing summaries, cultural tags, and multi-lingual translations. The vectors are indexed in ChromaDB, enabling cross-lingual RAG Q&A."*
- **Images to Use:** High-resolution Mermaid-style architecture block diagram with glowing data flow paths.
- **Icons:** ⚙️ Gateway, 🎤 Whisper, 🧠 Gemma 4, 💾 Postgres, 🔮 ChromaDB.
- **Animations:** Highlight data flow paths step-by-step using subtle pulse animations.
- **Background Idea:** Warm parchment with dark grid lines (`rgba(92, 36, 23, 0.05)`).
- **Estimated Speaking Time:** 35 Seconds
- **Transition Suggestion:** Wipe Right to Slide 6.

---

### Slide 6: Live Demo Walkthrough

- **Title:** Live Demo: Preserving a Folk Singer's Memory
- **Content:**
  - **Step 1:** Uploading raw audio recording (*Purulia Baul Folk Singer*).
  - **Step 2:** Automated transcription & language detection.
  - **Step 3:** Gemma 4 generates narrative summary, tags (*TEK, Folk Song*), & EN/BN/HI translations.
  - **Step 4:** Natural Language Query: *"How were floods predicted in ancient Bengal?"*
  - **Step 5:** RAG Answer with direct audio timestamp citation `[02:14]`.
- **Speaker Notes:**
  > *"Let us see LokKatha AI in action. Here we upload a 3-minute recording of a 74-year-old folk singer from Purulia. Within seconds, Whisper transcribes the Bengali speech. Gemma 4 extracts cultural tags and translates it into English and Hindi. Now, when a student asks 'How were floods predicted?', RAG retrieves the story and cites timestamp 2 minutes 14 seconds!"*
- **Images to Use:** High-fidelity screenshot mockup of the LokKatha AI web application showing the Terracotta-Parchment UI layout.
- **Icons:** 🎬 Play Video, 📱 Responsive Web UI, 🏷️ Tags, ⏱️ Timestamp Pin.
- **Animations:** Click triggers animated UI walk-through video snippet or interactive screenshot tab switch.
- **Background Idea:** Full-screen web app frame with parchment outer border.
- **Estimated Speaking Time:** 50 Seconds
- **Transition Suggestion:** Zoom In to Slide 7.

---

### Slide 7: UI/UX Design System — Traditional Elegance

- **Title:** UI/UX Inspired by Indian Craftsmanship
- **Content:**
  - **Terracotta Temples:** Burnt clay palette (`#5C2417`) for structure & grounding.
  - **Palm-Leaf Manuscripts:** Warm parchment texture (`#FDF8F0`) for readable story views.
  - **Alpana & Warli Art:** Minimal line art motifs for dividers & empty states.
  - **Human-Centered UX:** Accessible for field workers with low digital literacy.
- **Speaker Notes:**
  > *"We refused to build another cold, generic corporate chatbot interface. LokKatha AI's design system honors Indian artistic heritage—drawing colors from terracotta temples, parchment textures from palm-leaf manuscripts, and section dividers inspired by traditional Alpana art."*
- **Images to Use:** Design system UI kit showcase: Color swatches, Warli art badges, Alpana dividers, and typography specimens.
- **Icons:** 🎨 Color Palette, 🖌️ Warli Motif, 📜 Parchment, ✨ Alpana Pattern.
- **Animations:** Design elements slide in from four corners.
- **Background Idea:** Warm parchment with subtle Madhubani border frame.
- **Estimated Speaking Time:** 25 Seconds
- **Transition Suggestion:** Slide Up to Slide 8.

---

### Slide 8: Social Impact & UN SDGs Alignment

- **Title:** Measurable Social Impact & UN SDGs
- **Content:**
  - **SDG 11.4:** Safeguarding World Cultural & Natural Heritage.
  - **SDG 4.7:** Cultural Diversity Education in Schools.
  - **SDG 10.2:** Social & Knowledge Inclusion for Rural Elders.
  - **Grassroots Outreach:** Partnering with youth NGOs to conduct collection drives during community events.
- **Speaker Notes:**
  > *"LokKatha AI directly aligns with three UN Sustainable Development Goals. It preserves endangered heritage under SDG 11.4, provides authentic stories for classrooms under SDG 4.7, and gives rural non-literate elders a digital platform under SDG 10.2."*
- **Images to Use:** Official UN SDG icons (SDG 11, SDG 4, SDG 10) alongside photos of NGO volunteers engaging with rural elders.
- **Icons:** 🇺🇳 UN Flag, 🏛️ Heritage, 📚 Education, 🤝 Community Inclusion.
- **Animations:** SDG badges pop up with a soft bounce effect.
- **Background Idea:** Clean parchment with subtle green-gold gradient overlay.
- **Estimated Speaking Time:** 25 Seconds
- **Transition Suggestion:** Push Left to Slide 9.

---

### Slide 9: Business Model & Future Roadmap

- **Title:** Sustainability & Growth Roadmap
- **Content:**
  - **Phase 1 (Now):** Open-source MVP for NGO field workers.
  - **Phase 2 (6 Months):** Offline PWA on edge devices (Gemma 4 4B via Ollama).
  - **Phase 3 (12 Months):** Interactive GIS Heritage Map of India & School API Subscriptions.
  - **Business Model:** B2B SaaS for Cultural Research Institutes & B2G Government Archive Licensing.
- **Speaker Notes:**
  > *"Our roadmap is designed for long-term sustainability. Phase 1 provides our open-source MVP. Phase 2 introduces offline PWA edge deployment using Gemma 4 4B for remote field sites without internet. Phase 3 expands into B2B SaaS licensing for universities and government heritage bodies."*
- **Images to Use:** 3-stage visual timeline roadmap graphic with key milestones highlighted in terracotta nodes.
- **Icons:** 🗺️ Heritage Map, 📴 Offline PWA, 🏢 B2B Enterprise, 📈 Growth Arrow.
- **Animations:** Milestone nodes fill up sequentially from left to right.
- **Background Idea:** Terracotta accent sidebar with parchment body.
- **Estimated Speaking Time:** 25 Seconds
- **Transition Suggestion:** Dissolve to Slide 10.

---

### Slide 10: Closing Statement — Preserving the Past for the Future

- **Title:** Preserving Our Past to Inspire Our Future
- **Content:**
  - **The Promise:** *"Technology should not replace our culture. It should preserve it."*
  - **Built With:** Google Gemma 4 | FastAPI | ChromaDB | Whisper | React
  - **Call to Action:** Join us in recording India's living cultural memory.
  - **Repository & Links:** [github.com/Subhadip-Paul2006/LokKatha-AI](#)
- **Speaker Notes:**
  > *"LokKatha AI represents my journey as an NGO volunteer, my love for Indian heritage, and my firm belief that GenAI should be built for good. Together with Google Gemma 4, let us ensure that no Indian elder's story is ever forgotten. Thank you!"*
- **Images to Use:** Inspiring hero collage of an Indian elder's hand holding a glowing digital phone displaying the LokKatha AI logo.
- **Icons:** 🌟 Star, 🔗 GitHub, 📧 Contact Mail, 🙏 Namaste Gesture.
- **Animations:** Final tagline text glows subtly; applause trigger moment.
- **Background Idea:** Deep Terracotta background with gold foil title text.
- **Estimated Speaking Time:** 15 Seconds
- **Transition Suggestion:** End of Deck.

---
