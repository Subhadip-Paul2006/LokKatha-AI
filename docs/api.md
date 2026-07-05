# LokKatha AI API Reference

The LokKatha AI backend orchestrates the entire Retrieval-Augmented Generation (RAG) pipeline through a single, unified POST endpoint. This reduces network roundtrips and simplifies frontend integration.

---

## POST `/api/chat`

Handles all AI interactions, including semantic retrieval, prompt guarding, and streaming SSE responses.

### Request payload

```json
{
  "messages": [
    {
      "role": "user",
      "content": "Tell me a story about Behula and Lakhinder."
    }
  ]
}
```

### Response Format (Server-Sent Events)

The API responds using the `text/event-stream` protocol.

#### 1. Start Event
Fired immediately upon request acceptance.
```text
event: start
data: {}
```

#### 2. Source/Context Event
Fired after `pgvector` retrieves semantic context from Supabase, but BEFORE the LLM begins generating text.
```text
event: source
data: {
  "title": "The Tale of Behula",
  "book": "Thakurmar Jhuli",
  "similarity": 0.89,
  "region": "Bengal",
  "category": "Mythology"
}
```

#### 3. Token Streaming Event
Fired sequentially as the Google Gemma model generates chunks.
```text
data: {"type":"token","text":"Behula "}
data: {"type":"token","text":"was "}
data: {"type":"token","text":"a "}
```

#### 4. Complete Event
Fired when the LLM stream concludes.
```text
event: complete
data: {}
```

#### 5. Error Event
Fired upon critical pipeline failures (e.g., Rate Limits).
```text
event: error
data: {"error": "Gemma API Timeout (30s)"}
```

---

## Architectural Note
Internal modules (`retriever.ts`, `contextBuilder.ts`, `promptGuard.ts`) are **NOT** exposed as public APIs. They act as server-side libraries consumed exclusively by `/api/chat`. This ensures maximum security and minimum latency.
