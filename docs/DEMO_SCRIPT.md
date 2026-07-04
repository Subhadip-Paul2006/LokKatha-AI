# 🎬 LokKatha AI — Master Live Demo Script & Failover Playbook

> **Target Pitch Duration:** 90 Seconds Live Demo Block (Inside 5-Minute Pitch)  
> **Interface Theme:** Terracotta & Parchment Traditional Indian UI  
> **Backup Mode:** Pre-rendered Offline Cached Video + Local JSON Snapshot  

---

## ⏱️ Second-by-Second Demo Timeline

```
[00-15s] Upload & Consent  ➔  [15-35s] Whisper ASR & Language ID  ➔  [35-60s] Gemma 4 Summary/Tags/Trans  ➔  [60-80s] RAG Natural Q&A  ➔  [80-90s] Timestamp Citation Climax
```

---

## 📜 Complete Live Script & Action Sequence

| Time | On-Screen Action | Speaker Script | Stage Direction / Cue |
| :--- | :--- | :--- | :--- |
| **00:00 - 00:15** | Open `http://localhost:3000`. Show landing hero card with Terracotta motif. Click **"Record Oral Story"** button. Drag and drop `baul_folk_purulia.wav`. Digital consent checkbox checked. | *"Judges, let us watch LokKatha AI in action. I am a field volunteer in Purulia, West Bengal. I upload a 3-minute recording of 74-year-old traditional folk singer Gurupada Das."* | Point cursor smoothly to consent checkmark. Speak in calm, confident tone. |
| **00:15 - 00:30** | Click **"Process Story with Gemma 4"**. Loading spinner appears with Alpana geometric rotating art and status: *"Step 1: Noise Reduction ➔ Step 2: Whisper ASR Transcription..."* | *"The backend ingests the audio, cleans background village noise, and sends it to Whisper ASR. It automatically detects Bengali speech with high accuracy."* | **[PAUSE 2 SECONDS]** Let judges absorb the live loading animation. |
| **00:30 - 00:45** | Screen updates. Raw Bengali transcript displays on parchment background card alongside Gemma 4 status: *"Executing Gemma 4 Multi-Task Intelligence..."* | *"Now, Google Gemma 4 takes over as our cultural historian. Look at the speed and precision."* | Smile and glance at judges. |
| **00:45 - 01:00** | Structured result card animates onto screen: <br/>• Title: *"The Echo of Ektara: Baul Traditions of Purulia"* <br/>• Tags: `[TEK]`, `[Folk Songs]`, `[Spiritual Philosophy]` <br/>• Tabs: `English`, `Bengali`, `Hindi` translations. Click between `Hindi` and `English` tabs. | *"In a single pass, Gemma 4 generates a narrative summary, extracts cultural tags, and translates the story into English and Hindi—preserving respect registers like 'Aap' and original idioms."* | **👏 JUDGE APPLAUSE TRIGGER 1:** When switching from Bengali to smooth Hindi Devanagari translation card seamlessly. |
| **01:00 - 01:20** | Navigate to **"Interactive Heritage Q&A"** tab. Type in English: *"What is the spiritual meaning of the Ektara instrument in Baul songs?"* Press Enter. | *"Now, imagine a researcher or a school student who doesn't speak Bengali. They ask in English: 'What is the spiritual meaning of the Ektara instrument?'"* | Type deliberately so judges can read the query. |
| **01:20 - 01:30** | RAG response streams in real-time. Text answer appears with highlighted text: *"The single string of the Ektara represents the oneness of the human soul with the cosmos..."* <br/>A golden badge shows: `[Citation: Gurupada Das | Timestamp 01:42]`. Click badge ➔ audio player seeks to 01:42 and plays 5s audio clip. | *"RAG retrieves the exact vector chunk from ChromaDB, and Gemma 4 synthesizes an answer—citing Gurupada Das at timestamp 1 minute 42 seconds!"* | **👏 JUDGE APPLAUSE TRIGGER 2:** When clicking the timestamp badge and live audio plays from exact spot. |

---

## 🎯 High-Impact Feature Feature Sequence

1. **Demonstrate FIRST:** Multi-lingual Translation & Tag Extraction (Shows instant Gemma 4 visual magic).
2. **Demonstrate SECOND:** Cross-Lingual RAG Q&A (Shows technical depth and vector search capabilities).
3. **Demonstrate THIRD:** Timestamped Audio Citation (Proves zero hallucination and ground-truth storage).

---

## 🛑 What NOT to Do During Demo

- ❌ **Do NOT apologize** for minor styling glitches. Keep moving gracefully.
- ❌ **Do NOT spend more than 10 seconds** explaining file format requirements.
- ❌ **Do NOT run live fine-tuning** or heavy offline model loads during the pitch. Use warm pre-initialized API instances.

---

## 🚨 Backup Demo & Emergency Failover Strategy

### What if the internet fails or the API times out during live judging?

```
[ Primary: Live API Server ] ──(If Network Timeout > 3s)──► [ Fallback: Offline Local Cache ]
                                                                       │
                                                                       ▼
                                                          [ Run Pre-cached Video / Local JSON ]
```

1. **Hot-Key Fallback (`Ctrl + Shift + B`):** Program a hidden developer key in the React frontend that instantly loads pre-rendered API response JSON files stored in `public/demo_cache.json`.
2. **Offline Local Server Snapshot:** Keep an offline `uvicorn` instance running locally connected to SQLite + Local ChromaDB with pre-processed interviews so no external internet is required.
3. **Pre-recorded 1080p Video Backup:** Have a 90-second crisp screen recording (`demo_walkthrough.mp4`) open in VLC Media Player minimized on taskbar. If browser crashes, alt-tab instantly and say: *"Let me show you this recorded high-resolution walkthrough of our production pipeline!"*

---
