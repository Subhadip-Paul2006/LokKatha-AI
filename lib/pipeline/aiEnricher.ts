import dotenv from 'dotenv'
dotenv.config({ path: '.env.local' })
import { GoogleGenAI, Type } from '@google/genai'
import { z } from 'zod'
import { readFileSync } from 'fs'
import { join } from 'path'

// Ensure we have API key
const apiKey = process.env.GOOGLE_API_KEY
if (!apiKey) {
  throw new Error('GOOGLE_API_KEY is not set in environment.')
}
const ai = new GoogleGenAI({ apiKey })

/** 
 * Extended metadata schema combining Zod (for validation) and GoogleGenAI Types 
 * (though we will parse via Zod at the end) 
 */
export const StoryMetadataSchema = z.object({
  summary_bn: z.string(),
  summary_en: z.string(),
  summary_hi: z.string(),
  confidence: z.number(),
  characters: z.array(z.string()),
  keywords: z.array(z.string()),
  category: z.enum([
    'Fairy Tale', 'Folk Song', 'Legend', 'Mythology', 
    'Proverb', 'Historical Story', 'Festival', 'Riddle', 
    'Recipe', 'Children Story'
  ]).or(z.string()),
  cultural_importance: z.string(),
  moral: z.string().nullable(),
  reading_time: z.string(),
  difficulty: z.enum(['Easy', 'Medium', 'Advanced']).or(z.string()),
  age_group: z.enum(['Children', 'Teen', 'Adult', 'Family']).or(z.string()),
  themes: z.array(z.string()),
  locations: z.array(z.string()),
  festival_association: z.string().nullable(),
  related_titles: z.array(z.string()),
  sample_questions: z.array(z.string()),
  search_terms: z.array(z.string()),
  entities: z.object({
    people: z.array(z.string()),
    places: z.array(z.string()),
    animals: z.array(z.string()),
    objects: z.array(z.string()),
    mythical_creatures: z.array(z.string())
  })
})

export type StoryMetadata = z.infer<typeof StoryMetadataSchema>

/**
 * Loads prompt template
 */
function loadPrompt(): string {
  const promptPath = join(__dirname, 'prompts', 'enrichment-v1.md')
  return readFileSync(promptPath, 'utf8')
}

// Define the responseSchema using GoogleGenAI Type format so it's strictly enforced by the model.
const geminiResponseSchema = {
  type: Type.OBJECT,
  properties: {
    summary_bn: { type: Type.STRING },
    summary_en: { type: Type.STRING },
    summary_hi: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
    characters: { type: Type.ARRAY, items: { type: Type.STRING } },
    keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
    category: { type: Type.STRING },
    cultural_importance: { type: Type.STRING },
    moral: { type: Type.STRING, nullable: true },
    reading_time: { type: Type.STRING },
    difficulty: { type: Type.STRING },
    age_group: { type: Type.STRING },
    themes: { type: Type.ARRAY, items: { type: Type.STRING } },
    locations: { type: Type.ARRAY, items: { type: Type.STRING } },
    festival_association: { type: Type.STRING, nullable: true },
    related_titles: { type: Type.ARRAY, items: { type: Type.STRING } },
    sample_questions: { type: Type.ARRAY, items: { type: Type.STRING } },
    search_terms: { type: Type.ARRAY, items: { type: Type.STRING } },
    entities: {
      type: Type.OBJECT,
      properties: {
        people: { type: Type.ARRAY, items: { type: Type.STRING } },
        places: { type: Type.ARRAY, items: { type: Type.STRING } },
        animals: { type: Type.ARRAY, items: { type: Type.STRING } },
        objects: { type: Type.ARRAY, items: { type: Type.STRING } },
        mythical_creatures: { type: Type.ARRAY, items: { type: Type.STRING } }
      },
      required: ['people', 'places', 'animals', 'objects', 'mythical_creatures']
    }
  },
  required: [
    'summary_bn', 'summary_en', 'summary_hi', 'confidence', 'characters', 
    'keywords', 'category', 'cultural_importance', 'reading_time', 
    'difficulty', 'age_group', 'themes', 'locations', 'related_titles', 
    'sample_questions', 'search_terms', 'entities'
  ]
}

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

export interface EnrichmentResult {
  metadata: StoryMetadata | null
  rawResponse: any
  error?: string
  tokensUsed: number
}

/**
 * Enriches a raw story with metadata using Gemma/Gemini.
 */
export async function enrichStory(
  title: string, 
  content: string, 
  retries = 3
): Promise<EnrichmentResult> {
  const promptText = loadPrompt()
  const fullPrompt = `${promptText}\n\nTitle: ${title}\n\nStory Content:\n${content}`
  
  let attempt = 0
  
  while (attempt < retries) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          temperature: 0.2, // Deterministic generation
          responseMimeType: 'application/json',
          responseSchema: geminiResponseSchema
        }
      })
      
      const responseText = response.text
      if (!responseText) {
        throw new Error('Empty response from model.')
      }
      
      const rawJson = JSON.parse(responseText)
      
      // Perform Zod validation
      const parsed = StoryMetadataSchema.parse(rawJson)
      
      return {
        metadata: parsed,
        rawResponse: rawJson,
        tokensUsed: response.usageMetadata?.totalTokenCount ?? 0
      }
      
    } catch (err: any) {
      attempt++
      if (attempt >= retries) {
        return {
          metadata: null,
          rawResponse: null,
          error: err.message || String(err),
          tokensUsed: 0
        }
      }
      // Wait 5 seconds before retrying
      await sleep(5000)
    }
  }
  
  return { metadata: null, rawResponse: null, error: 'Failed', tokensUsed: 0 }
}
