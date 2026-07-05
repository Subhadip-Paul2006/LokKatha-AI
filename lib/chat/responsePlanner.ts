import { ValidationReport } from '../rag/types'

export type PlannedAction = 
  | 'GREETING'
  | 'INSUFFICIENT_CONTEXT'
  | 'PROMPT_INJECTION'
  | 'GENERATE'

export class ResponsePlanner {
  /**
   * Pre-evaluates the intent and RAG state to decide if we should
   * bypass Gemma and return a fast, deterministic response.
   */
  static planAction(query: string, report: ValidationReport): { action: PlannedAction, fastResponse?: string } {
    
    if (report.injection_detected) {
      return {
        action: 'PROMPT_INJECTION',
        fastResponse: "I'm sorry, but I can only answer questions related to the LokKatha cultural archive. How can I help you explore Bengali folklore today?"
      }
    }

    if (!report.prompt_valid || report.context_blocks === 0) {
      return {
        action: 'INSUFFICIENT_CONTEXT',
        fastResponse: "I couldn't find that information in the current LokKatha archive."
      }
    }

    const q = query.trim().toLowerCase()
    const greetings = ['hi', 'hello', 'hey', 'namaste', 'nomoshkar']
    if (greetings.includes(q)) {
      return {
        action: 'GREETING',
        fastResponse: "Nomoshkar! I am LokKatha AI, an archivist of Bengali and Indian folklore. You can ask me about characters like Lalkamal, stories like Saat Bhai Champa, or the morals of various tales. How can I help you today?"
      }
    }

    return { action: 'GENERATE' }
  }
}
