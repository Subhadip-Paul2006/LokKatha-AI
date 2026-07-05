export function validateEmbedding(embedding: number[], expectedDimensions = 768): boolean {
  // Must be an array
  if (!Array.isArray(embedding)) return false
  
  // Must match exact dimensions
  if (embedding.length !== expectedDimensions) return false
  
  // No NaNs, nulls, or non-finite numbers
  for (const val of embedding) {
    if (typeof val !== 'number' || !Number.isFinite(val) || Number.isNaN(val)) {
      return false
    }
  }
  
  return true
}
