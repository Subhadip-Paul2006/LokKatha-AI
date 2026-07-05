import { GoogleGenAI } from '@google/genai'

export class AnswerGenerator {
  private ai: GoogleGenAI

  constructor() {
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      throw new Error('GOOGLE_API_KEY is missing in environment variables.')
    }
    this.ai = new GoogleGenAI({ apiKey })
  }

  /**
   * Generates a streaming response from Gemma.
   * Includes a 30s timeout fallback.
   */
  async *generateStream(prompt: string): AsyncGenerator<string, void, unknown> {
    const model = process.env.GEMMA_MODEL || 'gemini-2.5-flash'
    
    // We implement a custom timeout wrapper for the stream
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Gemma API Timeout (30s)')), 30000)
    })

    try {
      const streamPromise = this.ai.models.generateContentStream({
        model,
        contents: prompt
      })

      // Race the initial stream connection against the timeout
      const stream = await Promise.race([streamPromise, timeoutPromise])

      for await (const chunk of stream) {
        if (chunk.text) {
          yield chunk.text
        }
      }
    } catch (error: any) {
      console.error('Answer Generation Error:', error)
      // Mod 7: Better Error Recovery. Instead of throwing, we yield a fallback message.
      yield "AI response unavailable at the moment. However, I have retrieved the most relevant cultural stories below."
    }
  }
}
