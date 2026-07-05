export function createSemanticDocument(story: any): string {
  // We use a structured template to improve semantic retrieval quality
  const meta = story.metadata || {}
  const book = meta.book?.title || story.citations?.book || 'Unknown'
  
  const characters = meta.characters?.join(', ') || ''
  const themes = meta.themes?.join(', ') || ''
  const keywords = story.keywords?.join(', ') || ''
  
  return `Title:
${story.title}

Source:
${book}

Summary:
${story.summary || ''}

Characters:
${characters}

Themes:
${themes}

Keywords:
${keywords}

Cultural Importance:
${story.historical_importance || meta.culture?.historical_importance || ''}

Moral:
${meta.culture?.moral || ''}

Content:
${story.transcript || story.content || ''}`.trim()
}
