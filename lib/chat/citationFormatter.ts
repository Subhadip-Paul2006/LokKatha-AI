import { ContextBlock, RetrievedStory } from '../rag/types'
import { ChatSource, RelatedStory } from './types'

export class CitationFormatter {
  static formatSources(blocks: ContextBlock[]): ChatSource[] {
    const unique = new Map<string, ChatSource>()
    
    for (const b of blocks) {
      const key = `${b.title}-${b.book}`
      if (!unique.has(key)) {
        unique.set(key, {
          title: b.title,
          book: b.book,
          similarity: b.similarity
        })
      }
    }
    
    return Array.from(unique.values())
  }

  static formatRelatedStories(retrieved: RetrievedStory[], usedBlocks: ContextBlock[]): RelatedStory[] {
    // Stories that were retrieved but maybe not used in the prompt context (due to token limits),
    // or stories that were used, but we just want to recommend other titles.
    const usedTitles = new Set(usedBlocks.map(b => b.title))
    const related: RelatedStory[] = []

    for (const r of retrieved) {
      if (!usedTitles.has(r.title) && related.length < 3) {
        related.push({
          title: r.title,
          similarity: r.similarity
        })
      }
    }
    
    return related
  }

  static generateSuggestedQuestions(sources: ChatSource[]): string[] {
    if (sources.length === 0) return []
    const topSource = sources[0]
    return [
      `Tell me more about ${topSource.title}`,
      `What is the moral of the story?`,
      `Are there similar stories in ${topSource.book}?`
    ]
  }

  static computeConfidence(blocks: ContextBlock[]): number {
    if (blocks.length === 0) return 0
    // Weighted average of similarity and AI-generated confidence from extraction
    const primary = blocks[0]
    const baseSim = primary.similarity
    const aiConf = primary.confidence || 0.8
    return parseFloat(((baseSim * 0.7) + (aiConf * 0.3)).toFixed(2))
  }
}
