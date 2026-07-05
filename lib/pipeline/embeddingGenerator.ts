import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { GoogleGenAI } from '@google/genai'

// @google/genai v2 defaults to v1beta, but text-embedding-004 only exists
// on the v1 endpoint. We pass httpOptions.apiVersion = 'v1' to the embedding
// client so the embedContent call routes correctly.
const EMBEDDING_MODEL = 'text-embedding-004'

export class EmbeddingGenerator {
  private ai: GoogleGenAI

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is missing in environment variables.')
    }
    // Force v1 API for this client — required for text-embedding-004
    this.ai = new GoogleGenAI({
      apiKey,
      httpOptions: { apiVersion: 'v1' },
    })
  }

  private sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Generates a 768-dimensional embedding vector using text-embedding-004.
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
