/**
 * A fast, heuristic token estimator. 
 * Usually, 1 token is ~4 chars in English, or ~3 chars in Bengali.
 * We'll use 3.5 as a conservative average for the mixed archive.
 */
export function estimateTokens(text: string): number {
  if (!text) return 0
  return Math.ceil(text.length / 3.5)
}
