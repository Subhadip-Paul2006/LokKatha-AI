import { NextRequest, NextResponse } from 'next/server'
import { RAGOrchestrator } from '../../../lib/rag/orchestrator'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { query } = body

    if (!query) {
      return NextResponse.json({ error: 'Query is required' }, { status: 400 })
    }

    const orchestrator = new RAGOrchestrator()
    const { prompt, metrics, validationReport, contextBlocks } = await orchestrator.preparePrompt(query)

    return NextResponse.json({
      success: true,
      data: {
        prompt,
        metrics,
        validationReport,
        contextBlocks
      }
    })
  } catch (error: any) {
    console.error('RAG Orchestrator Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
