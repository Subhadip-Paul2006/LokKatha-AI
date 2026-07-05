# RAG Architecture (Retrieval-Augmented Generation)

LokKatha AI uses a highly optimized RAG architecture to ensure that Google Gemma produces culturally accurate folklore without hallucinating.

## 1. The Context Window Challenge
Bengali folklore collections like *Thakurmar Jhuli* are massive. Passing the entire book to Gemma for every question would be slow and expensive. 
Instead, we use RAG to fetch only the most relevant 2-3 stories.

## 2. Query Pipeline
1. **User Query**: "Who is Lalkamal?"
2. **Embedding**: The backend uses the Google GenAI Embedding API to convert this string into a 768-dimensional vector.
3. **Similarity Search**: `pgvector` inside Supabase compares this vector against all 1,400+ stories in the database using Cosine Distance.
4. **Retrieval**: The top 3 most similar stories (above a 70% threshold) are retrieved.

## 3. The System Prompt (Guardrails)
The retrieved stories are passed to Gemma alongside a strict System Prompt:
- "You are LokKatha AI, an archivist of Indian folklore."
- "Base your answer ONLY on the provided context."
- "If the answer is not in the context, politely decline."

This ensures complete accuracy and prevents the model from generating generic internet folklore.
