import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { GoogleGenAI } from '@google/genai'

// Model that works with @google/genai v2 SDK via the v1 endpoint.
// 'text-embedding-004' returns 404 on v1beta with this SDK version.
// 'gemini-embedding-exp-03-07' produces the same 768-dim vectors via v1.
const EMBEDDING_MODEL = 'gemini-embedding-exp-03-07'

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
   * Generates a 768-dimensional embedding vector.
   */
  async generate(text: string, retries = 3): Promise<number[]> {
    let attempt = 0
    while (attempt < retries) {
      try {
        const response = await this.ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: text,
        })

        // @google/genai v2: response.embeddings is an array of EmbeddingResult
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
        await this.sleep(3000 * attempt)
      }
    }
    throw new Error('Unreachable')
  }
}
