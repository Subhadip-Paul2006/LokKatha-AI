import { QueryCategory } from '../types'

export function classifyQuery(query: string): QueryCategory {
  const normalized = query.toLowerCase().trim()

  if (normalized.match(/\b(who|character|protagonist|villain|hero)\b/)) {
    return 'CHARACTER'
  }
  
  if (normalized.match(/\b(recommend|funny|sad|scary|tell me a story|read me)\b/)) {
    return 'RECOMMENDATION'
  }

  if (normalized.match(/\b(summarize|summary|about|plot of)\b/)) {
    return 'SUMMARY'
  }

  if (normalized.match(/\b(why|what|meaning|explain|history|culture|moral|lesson)\b/)) {
    return 'KNOWLEDGE'
  }

  return 'UNKNOWN'
}

export function getDynamicTopK(category: QueryCategory, defaultTopK: number): number {
  switch (category) {
    case 'CHARACTER': return 3 // Usually localized to specific stories
    case 'RECOMMENDATION': return 7 // Broad, we want many options
    case 'SUMMARY': return 2 // Highly specific to one or two stories
    case 'KNOWLEDGE': return 5 // Needs cross-referencing
    case 'UNKNOWN': return defaultTopK
  }
}
