import { RetrievedStory } from '../types'

export function rankSources(stories: RetrievedStory[]): RetrievedStory[] {
  return stories.sort((a, b) => {
    // 1. Primary Sort: Similarity Score
    // If difference is greater than a tiny epsilon, use similarity
    const simDiff = b.similarity - a.similarity
    if (Math.abs(simDiff) > 0.01) {
      return simDiff
    }

    // 2. Secondary Sort: Confidence Score
    const confA = a.metadata?.culture?.confidence || 0
    const confB = b.metadata?.culture?.confidence || 0
    const confDiff = confB - confA
    if (Math.abs(confDiff) > 0.05) {
      return confDiff
    }

    // 3. Tertiary Sort: Cultural Importance length (heuristic for quality)
    const cultA = (a.metadata?.culture?.historical_importance || '').length
    const cultB = (b.metadata?.culture?.historical_importance || '').length
    
    return cultB - cultA
  })
}
