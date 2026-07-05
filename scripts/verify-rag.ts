import { VectorHealth } from '../lib/vectorHealth'

async function run() {
  console.log('🔍 Running RAG Verification Checks...\n')
  
  const health = new VectorHealth()

  try {
    const hasRpc = await health.verifyRPC()
    if (hasRpc) {
      console.log('✅ pgvector enabled')
      console.log('✅ RPC match_stories works')
    } else {
      console.log('❌ RPC match_stories failed or pgvector extension is missing')
    }

    const hasIndex = await health.verifyIndex()
    if (hasIndex) {
      console.log('✅ index and vector columns exist')
    } else {
      console.log('❌ vector columns do not exist (migration pending)')
    }

    const counts = await health.verifyEmbeddingCount()
    console.log(`✅ ${counts.embedded} / ${counts.total} embeddings generated`)

  } catch (err: any) {
    console.error(`\n❌ Verification failed with fatal error: ${err.message}`)
    process.exit(1)
  }
}

run()
