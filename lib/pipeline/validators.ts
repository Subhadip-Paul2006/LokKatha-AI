import { z } from 'zod'

export const ProcessedEntrySchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().min(1),
  summary_bn: z.string().min(1),
  summary_en: z.string().min(1),
  summary_hi: z.string().min(1),
  category: z.string().min(1),
  status: z.literal('processed'),
  checksum: z.string().min(1),
  // Additional metadata fields expected from Phase 4.3
  confidence: z.number().optional(),
  characters: z.array(z.string()).optional(),
  keywords: z.array(z.string()).optional(),
  cultural_importance: z.string().optional(),
  moral: z.string().nullable().optional(),
  reading_time: z.string().optional(),
  difficulty: z.string().optional(),
  age_group: z.string().optional(),
  themes: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  festival_association: z.string().nullable().optional(),
  related_titles: z.array(z.string()).optional(),
  sample_questions: z.array(z.string()).optional(),
  search_terms: z.array(z.string()).optional(),
  entities: z.any().optional(),
  citations: z.object({
    book: z.string().min(1),
    pages: z.array(z.number()).optional(),
    language: z.string().min(1)
  }).optional()
})

export type ProcessedEntry = z.infer<typeof ProcessedEntrySchema>

export function validateProcessedEntry(data: any): ProcessedEntry | null {
  try {
    return ProcessedEntrySchema.parse(data)
  } catch (error) {
    return null
  }
}
