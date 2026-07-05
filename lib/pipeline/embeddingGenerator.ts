import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { GoogleGenAI } from '@google/genai'

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
   * Generates a 768-dimensional vector using text-embedding-004
   */
  async generate(text: string, retries = 3): Promise<number[]> {
    let attempt = 0
    while (attempt < retries) {
      try {
        const response = await this.ai.models.embedContent({
          model: 'text-embedding-004',
          contents: text
        })

        if (!response.embeddings || response.embeddings.length === 0 || !response.embeddings[0].values) {
          throw new Error('API returned empty embedding array.')
        }

        return response.embeddings[0].values
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
