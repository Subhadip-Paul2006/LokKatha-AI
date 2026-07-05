// Server Component — no 'use client' directive.
// `force-dynamic` tells Next.js / Vercel NOT to statically prerender this route.
// This is required because the client tree uses browser-only APIs:
//   - useSyncExternalStore (chatSession store in ConversationShell / AskLokKatha)
//   - sessionStorage (CinematicIntro)
//   - AudioContext (CinematicIntro ambient sound)
export const dynamic = 'force-dynamic'

import { HomeClient } from '@/components/home-client'

export default function Page() {
  return <HomeClient />
}
