import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { GoogleGenAI } from '@google/genai'

// 'embedding-001' is the universally available Google embedding model.
// It works on all Gemini API keys and produces 768-dimensional vectors,
// matching the Supabase pgvector schema.
const EMBEDDING_MODEL = 'embedding-001'

export class EmbeddingGenerator {
  private ai: GoogleGenAI

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is missing in environment variables.')
    }
    this.ai = new GoogleGenAI({ apiKey })
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Generates a 768-dimensional embedding vector using embedding-001.
   * Matches the dimension of vectors stored in Supabase.
   */
  async generate(text: string, retries = 3): Promise<number[]> {
    let attempt = 0
    while (attempt < retries) {
      try {
        const response = await this.ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: text,
        })

        const values = response.embeddings?.[0]?.values
        if (!values || values.length === 0) {
          throw new Error('API returned an empty embedding.')
        }

        return values
      } catch (err: any) {
        attempt++
        if (attempt >= retries) {
          throw new Error(`Embedding failed after ${retries} attempts: ${err.message}`)
        }
        await this.sleep(2000 * attempt)
      }
    }
    throw new Error('Unreachable')
  }
}
