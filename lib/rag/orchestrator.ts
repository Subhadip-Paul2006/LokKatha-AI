import { RAG_CONFIG } from './config/rag'
import { classifyQuery, getDynamicTopK } from './retriever/queryClassifier'
import { performHybridSearch } from './retriever/hybridSearch'
import { rankSources } from './retriever/ranking'
import { buildContextBlocks } from './context/contextBuilder'
import { PromptGuard } from './guardrails/promptGuard'
import { RAGQuery, RAGReport } from './types'

export class RAGOrchestrator {
  private guard: PromptGuard

  constructor() {
    this.guard = new PromptGuard(RAG_CONFIG)
  }

  /**
   * Main pipeline orchestrating Retrieval -> Context -> Guardrails
   */
  async preparePrompt(queryText: string) {
    const startTime = Date.now()

    // 1. Classifier
    const category = classifyQuery(queryText)
    const topK = getDynamicTopK(category, RAG_CONFIG.defaultTopK)
    
    const query: RAGQuery = {
      raw: queryText,
      normalized: queryText.toLowerCase().trim(),
      category
    }

    // 2. Hybrid Search (Vector + Keyword)
    const retrieved = await performHybridSearch(query, topK, RAG_CONFIG.similarityThreshold)

    // 3. Cultural Source Ranking
    const ranked = rankSources(retrieved)

    // 4. Context Builder
    const contextBlocks = buildContextBlocks(ranked)

    // 5. Prompt Guardrails
    const { prompt, report: validationReport } = this.guard.secureAndAssemble(queryText, contextBlocks)

    // 6. Metrics Generation
    const latency = Date.now() - startTime
    const metrics: RAGReport = {
      query: queryText,
      topK,
      retrieved: retrieved.length,
      averageSimilarity: retrieved.length > 0 
        ? retrieved.reduce((acc, r) => acc + r.similarity, 0) / retrieved.length 
        : 0,
      promptTokens: validationReport.estimated_tokens,
      latency: `${latency}ms`,
      timestamp: new Date().toISOString()
    }

    return { prompt, metrics, validationReport, contextBlocks }
  }

  /**
   * Mod 12: Streaming Ready (Async Generator design)
   * This is a stub for the final Gemma generation phase.
   */
  async *generateAnswer(queryText: string): AsyncGenerator<string, void, unknown> {
    const { prompt, validationReport } = await this.preparePrompt(queryText)
    
    if (!validationReport.prompt_valid) {
      yield "I couldn't find that information in the current LokKatha archive."
      return
    }

    // TODO: Await actual connection to Gemma and stream chunks
    // For now, simulating an async stream
    const simulatedResponse = "This is a simulated AI response based on the retrieved context."
    const chunks = simulatedResponse.split(' ')
    for (const chunk of chunks) {
      yield chunk + ' '
      await new Promise(r => setTimeout(r, 50))
    }
  }
}
