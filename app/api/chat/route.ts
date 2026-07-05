import { NextRequest } from 'next/server'
import { ChatOrchestrator } from '../../../lib/chat/chatOrchestrator'
import { ChatMessage } from '../../../lib/chat/types'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const messages: ChatMessage[] = body.messages
    const debug: boolean = body.debug === true

    // Fallback if legacy `{ query }` is passed instead of `{ messages }`
    const legacyQuery = body.query
    const finalMessages = messages || (legacyQuery ? [{ role: 'user', content: legacyQuery }] : null)

    if (!finalMessages || finalMessages.length === 0) {
      return new Response(JSON.stringify({ error: 'Messages are required' }), { status: 400 })
    }

    const orchestrator = new ChatOrchestrator()
    const stream = await orchestrator.handleChatStream(finalMessages, debug)

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache, no-transform',
        'Connection': 'keep-alive',
      },
    })
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }
}
