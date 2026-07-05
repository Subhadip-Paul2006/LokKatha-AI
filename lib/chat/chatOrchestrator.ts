import { ChatMessage, ChatMetrics, StructuredChatOutput } from './types'
import { ConversationMemory } from './memory'
import { getCachedChatResponse, setCachedChatResponse } from './responseCache'
import { ResponsePlanner } from './responsePlanner'
import { AnswerGenerator } from './answerGenerator'
import { CitationFormatter } from './citationFormatter'
import { RAGOrchestrator } from '../rag/orchestrator'

export class ChatOrchestrator {
  private rag: RAGOrchestrator
  private generator: AnswerGenerator

  constructor() {
    this.rag = new RAGOrchestrator()
    this.generator = new AnswerGenerator()
  }

  /**
   * Main pipeline to process a chat stream.
   * Mod 14: Cleanly encapsulates Memory -> RAG -> Planner -> Formatter -> Stream
   */
  async handleChatStream(messages: ChatMessage[], debug: boolean): Promise<ReadableStream> {
    const encoder = new TextEncoder()
    const startTime = Date.now()

    return new ReadableStream({
      start: async (controller) => {
        const sendEvent = (event: string, data: any) => {
          controller.enqueue(encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`))
        }

        try {
          sendEvent('start', {})

          // 1. Conversation Memory (Synthesize query)
          const searchQuery = ConversationMemory.extractSearchQuery(messages)
          if (!searchQuery) {
            sendEvent('complete', { error: 'Empty query' })
            controller.close()
            return
          }

          // 2. Cache Check
          const cached = getCachedChatResponse(searchQuery)
          if (cached) {
            sendEvent('token', { text: cached.answer })
            sendEvent('source', { 
              sources: cached.sources, 
              relatedStories: cached.relatedStories,
              suggestedQuestions: cached.suggestedQuestions,
              confidence: cached.confidence
            })
            sendEvent('complete', {})
            controller.close()
            return
          }

          // 3. RAG Pipeline
          const ragStart = Date.now()
          const ragResult = await this.rag.preparePrompt(searchQuery)
          const ragEnd = Date.now()

          // 4. Response Planner
          const plan = ResponsePlanner.planAction(searchQuery, ragResult.validationReport)
          let finalAnswer = ''

          if (plan.action !== 'GENERATE' && plan.fastResponse) {
            // Fast Path (Greeting, Injection, Insufficient Context)
            finalAnswer = plan.fastResponse
            const chunks = finalAnswer.split(' ')
            for (const chunk of chunks) {
              sendEvent('token', { text: chunk + ' ' })
            }
          } else {
            // Slow Path (Gemma)
            const gemmaStart = Date.now()
            const stream = this.generator.generateStream(ragResult.prompt)
            for await (const chunk of stream) {
              finalAnswer += chunk
              sendEvent('token', { text: chunk })
            }
            ragResult.metrics.gemmaMs = Date.now() - gemmaStart
          }

          // 5. Citation & Output Formatting
          const sources = CitationFormatter.formatSources(ragResult.contextBlocks)
          const relatedStories = CitationFormatter.formatRelatedStories(ragResult.retrieved, ragResult.contextBlocks)
          const suggestedQuestions = CitationFormatter.generateSuggestedQuestions(sources)
          const confidence = CitationFormatter.computeConfidence(ragResult.contextBlocks)
          
          sendEvent('source', {
            sources,
            relatedStories,
            suggestedQuestions,
            confidence
          })

          const totalMs = Date.now() - startTime
          
          // Mod 9 & 10: Metrics tracking
          const metrics: ChatMetrics = {
            embeddingMs: parseInt(ragResult.metrics.latency), // Assuming format 'Xms'
            retrievalMs: 0, // In a deeper implementation, hybridSearch would return granular metrics
            contextBuildMs: 0,
            gemmaMs: ragResult.metrics.gemmaMs || 0,
            totalMs
          }

          const structuredOutput: StructuredChatOutput = {
            answer: finalAnswer,
            sources,
            relatedStories,
            suggestedQuestions,
            confidence,
            ...(debug ? { metrics } : {})
          }

          // Set cache for future
          setCachedChatResponse(searchQuery, structuredOutput)

          sendEvent('complete', debug ? { debugInfo: ragResult.validationReport, metrics } : {})
        } catch (error: any) {
          console.error('Chat Orchestrator Fatal Error:', error)
          sendEvent('error', { message: error.message })
        } finally {
          controller.close()
        }
      }
    })
  }
}
