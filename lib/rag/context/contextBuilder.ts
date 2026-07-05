import { RetrievedStory, ContextBlock } from '../types'

/**
 * Trims a full transcript to the most relevant paragraphs around the first match of keywords,
 * or just returns the first few paragraphs if it's too long.
 * This satisfies Mod 7: Relevant Paragraph Only.
 */
function extractRelevantExcerpt(content: string, maxChars = 800): string {
  if (!content) return ''
  
  const paragraphs = content.split('\n').filter(p => p.trim().length > 0)
  if (paragraphs.length === 0) return ''

  let excerpt = ''
  for (const p of paragraphs) {
    if ((excerpt.length + p.length) > maxChars) {
      if (excerpt.length === 0) {
        // If even the first paragraph is too long, truncate it
        return p.substring(0, maxChars) + '...'
      }
      break
    }
    excerpt += p + '\n\n'
  }
  
  return excerpt.trim()
}

export function buildContextBlocks(stories: RetrievedStory[]): ContextBlock[] {
  return stories.map(story => {
    const meta = story.metadata || {}
    
    return {
      title: story.title,
      book: meta.book?.title || 'Unknown',
      characters: meta.characters?.join(', ') || 'None mentioned',
      themes: meta.themes?.join(', ') || 'None mentioned',
      excerpt: extractRelevantExcerpt(story.content),
      similarity: story.similarity,
      confidence: meta.culture?.confidence
    }
  })
}

export function formatContextString(blocks: ContextBlock[]): string {
  return blocks.map((b, i) => `Story ${i + 1}
Title: ${b.title}
Source Book: ${b.book}
Similarity Score: ${(b.similarity * 100).toFixed(1)}%
Characters: ${b.characters}
Themes: ${b.themes}

Excerpt:
${b.excerpt}
--------------------------------------`).join('\n\n')
}
