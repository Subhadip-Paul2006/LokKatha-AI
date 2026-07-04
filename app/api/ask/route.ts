import { generateText } from 'ai'

export const maxDuration = 30

// Display label "Gemma" is kept in the UI; the concrete model id lives here.
const MODEL_ID = 'google/gemma-4-31b-it'

export type AskAnswer = {
  title: string
  location: string
  answer: string
  excerpt: string
  keywords: string[]
  relatedQuestions: string[]
}

const SYSTEM = `You are the LokKatha AI librarian: a patient, warm village archivist devoted to India's oral and folk heritage — folk tales, songs, crafts, rituals, dialects, and the wisdom of elders.

Voice rules:
- Speak plainly and warmly, like a kind librarian, never like a chatbot.
- Never use phrases like "As an AI", "I'd be happy to help", or exclamation-heavy hype.
- Be concise and unhurried. Respect the storyteller and the tradition.
- Ground answers in India's cultural context. If a detail is uncertain, say so gently rather than inventing specifics.

Return ONLY a single JSON object (no markdown, no code fences) with exactly these keys:
{
  "title": "a short evocative title for this piece of memory",
  "location": "a plausible region/state in India this tradition belongs to, e.g. 'Bengal' or 'Bankura, West Bengal'",
  "answer": "2-4 short warm paragraphs of plain-language context (plain text, no markdown)",
  "excerpt": "one short quoted line of folk wisdom, saying, or oral testimony that fits the theme",
  "keywords": ["3-5 short lowercase tags"],
  "relatedQuestions": ["2-3 natural follow-up questions a curious visitor might ask"]
}`

function extractJson(text: string): AskAnswer | null {
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim()
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1) return null
  try {
    const parsed = JSON.parse(cleaned.slice(start, end + 1))
    return {
      title: String(parsed.title ?? 'A Fragment of Memory'),
      location: String(parsed.location ?? 'India'),
      answer: String(parsed.answer ?? ''),
      excerpt: String(parsed.excerpt ?? ''),
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.map(String).slice(0, 5) : [],
      relatedQuestions: Array.isArray(parsed.relatedQuestions)
        ? parsed.relatedQuestions.map(String).slice(0, 3)
        : [],
    }
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  let question = ''
  try {
    const body = await req.json()
    question = String(body?.question ?? '').trim()
  } catch {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  if (!question) {
    return Response.json({ error: 'Please ask a question.' }, { status: 400 })
  }

  try {
    const { text } = await generateText({
      model: MODEL_ID,
      system: SYSTEM,
      prompt: `A visitor asks the archive: "${question}"\n\nRespond with the JSON object described above.`,
      temperature: 0.7,
    })

    const parsed = extractJson(text)
    if (parsed) return Response.json(parsed satisfies AskAnswer)

    // Graceful fallback: still return warm prose in the expected shape.
    return Response.json({
      title: 'From the Archive',
      location: 'India',
      answer: text.trim(),
      excerpt: '',
      keywords: [],
      relatedQuestions: [],
    } satisfies AskAnswer)
  } catch (err) {
    console.log('[v0] /api/ask error:', err instanceof Error ? err.message : err)
    return Response.json(
      { error: 'The archive is resting. Please try asking again in a moment.' },
      { status: 500 },
    )
  }
}
