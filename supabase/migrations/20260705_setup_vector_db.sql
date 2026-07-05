-- ==============================================================================
-- PHASE 5.1: VECTOR DATABASE PREPARATION
-- Configuration: Embedding Model Dimension = 768 (text-embedding-004)
-- ==============================================================================

-- 1. Enable the pgvector extension to work with embedding vectors
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Add Vector & Semantic Metadata Columns safely to the stories table
-- We use a fixed dimension of 768 for text-embedding-004
ALTER TABLE stories
  ADD COLUMN IF NOT EXISTS embedding vector(768),
  ADD COLUMN IF NOT EXISTS embedding_model text,
  ADD COLUMN IF NOT EXISTS embedding_version text,
  ADD COLUMN IF NOT EXISTS embedding_dimensions integer,
  ADD COLUMN IF NOT EXISTS embedding_status text,
  ADD COLUMN IF NOT EXISTS embedding_created_at timestamptz,
  ADD COLUMN IF NOT EXISTS search_document text;

-- 3. Create HNSW Vector Index optimized for Cosine Similarity
-- This is significantly faster for RAG lookups than IVFFLAT
CREATE INDEX IF NOT EXISTS stories_embedding_hnsw_idx 
  ON stories 
  USING hnsw (embedding vector_cosine_ops);

-- 4. Create Similarity Search RPC (match_stories)
-- Allows the Node.js backend to query vector distances seamlessly
CREATE OR REPLACE FUNCTION match_stories (
  query_embedding vector(768),
  match_threshold float,
  match_count int
)
RETURNS TABLE (
  id uuid,
  title text,
  summary text,
  content text,
  metadata jsonb,
  search_document text,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    stories.id,
    stories.title,
    -- We can extract summary depending on language. We'll return the en version if present or bn version.
    COALESCE(stories.translation_en, stories.summary, '') as summary,
    stories.transcript as content,
    stories.metadata,
    stories.search_document,
    1 - (stories.embedding <=> query_embedding) AS similarity
  FROM stories
  WHERE 1 - (stories.embedding <=> query_embedding) >= match_threshold
  ORDER BY stories.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
