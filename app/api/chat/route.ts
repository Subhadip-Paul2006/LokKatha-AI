import { NextRequest } from 'next/server'
import { ChatOrchestrator } from '../../../lib/chat/chatOrchestrator'
import { ChatMessage } from '../../../lib/chat/types'

// Simple in-memory rate limiter to protect against denial of service (DoS)
const rateLimitCache = new Map<string, { count: number; resetAt: number }>()
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 15 // 15 requests per minute

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const record = rateLimitCache.get(ip)
  
  if (!record || now > record.resetAt) {
    rateLimitCache.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW })
    return false
  }
  
  record.count++
  return record.count > MAX_REQUESTS
}

export async function POST(req: NextRequest) {
  // Extract client IP address safely
  const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || '127.0.0.1'

  if (checkRateLimit(ip)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please slow down.' }), 
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    )
  }

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

    const lastMessage = finalMessages[finalMessages.length - 1]
    if (!lastMessage.content || lastMessage.content.trim() === '') {
      return new Response(JSON.stringify({ error: 'Message content cannot be empty' }), { status: 400 })
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
