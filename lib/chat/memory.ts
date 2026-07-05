import { ChatMessage } from './types'

export class ConversationMemory {
  /**
   * Trims the history to the last N messages to maintain context
   * without blowing up the token budget.
   */
  static getContextWindow(messages: ChatMessage[], maxHistory = 5): ChatMessage[] {
    if (!messages || messages.length === 0) return []
    
    // Always ensure the last message is the current user query
    // We'll take up to maxHistory messages from the end
    const recent = messages.slice(-maxHistory)
    return recent
  }

  /**
   * Synthesize a search query from the context window.
   * If the latest query has pronouns, we attach context from the previous query.
   */
  static extractSearchQuery(messages: ChatMessage[]): string {
    const recent = this.getContextWindow(messages, 3)
    if (recent.length === 0) return ''
    
    const lastMessage = recent[recent.length - 1].content

    // Naive co-reference resolution for hackathon speed
    // If the latest query is short or contains pronouns, append the previous user query
    const hasPronouns = /\b(he|she|it|they|this|that|after that|then)\b/i.test(lastMessage)
    if (hasPronouns && recent.length >= 3) {
      // Find the previous user message
      const prevUser = recent.slice(0, -1).reverse().find(m => m.role === 'user')
      if (prevUser) {
        return `${prevUser.content}. ${lastMessage}`
      }
    }

    return lastMessage
  }
}
