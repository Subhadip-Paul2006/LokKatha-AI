# LokKatha AI Bug Report

This document reports all resolved and unresolved bugs found during the production audit.

---

## Discovered Bugs

### 1. Hydration Prerender Error in `useSyncExternalStore`
* **Severity**: High (Blocked production builds)
* **Location**: [`components/chat/ConversationShell.tsx`](file:///d:/LOKKOTHA%20AI/components/chat/ConversationShell.tsx#L12-L22) and [`components/ask-lokkatha.tsx`](file:///d:/LOKKOTHA%20AI/components/ask-lokkatha.tsx#L8-L13)
* **Description**: Call to `useSyncExternalStore` lacked a third argument `getServerSnapshot`. Prerendering failed with: `Error: Missing getServerSnapshot, which is required for server-rendered content.`
* **Steps to Reproduce**: Run `npm run build`
* **Recommended Fix**: Provide server snapshot fallbacks (`() => []` and `() => false`).
* **Status**: **RESOLVED** (Fixed in codebase)

---

### 2. Missing `transform` Property in PDF Extractor Type Cast
* **Severity**: Medium (Blocked TS compilation)
* **Location**: [`lib/pipeline/pdfExtractor.ts`](file:///d:/LOKKOTHA%20AI/lib/pipeline/pdfExtractor.ts#L64-L68)
* **Description**: Casting the returns of `getTextContent` failed to include `transform?: number[]`, causing a compiler warning and error when accessed at line 73.
* **Steps to Reproduce**: Run `npx tsc --noEmit`
* **Recommended Fix**: Add `transform?: number[]` to the items type array interface.
* **Status**: **RESOLVED** (Fixed in codebase)

---

### 3. Missing `stories` Database Schema on Supabase Production Instance
* **Severity**: High (Blocked runtime search)
* **Location**: Supabase Postgres Connection
* **Description**: Running the RAG verification check failed because the public schema did not contain the table `stories` or the `match_stories` RPC function.
* **Steps to Reproduce**: Run `npm run verify-rag`
* **Recommended Fix**: Execute the migrations defined in `supabase/migrations/20260705_setup_vector_db.sql` on the Supabase dashboard.
* **Status**: **PENDING MIGRATION** (Schema documented, requires DB administrator execution)

---

### 4. Lack of Input Validation in Chat API
* **Severity**: Low
* **Location**: [`app/api/chat/route.ts`](file:///d:/LOKKOTHA%20AI/app/api/chat/route.ts#L44-L49)
* **Description**: Empty user queries or whitespace strings were forwarded directly to the vector embedder, causing API errors.
* **Steps to Reproduce**: Submit an empty string query in the chat input.
* **Recommended Fix**: Add `.trim() === ''` check in the route.
* **Status**: **RESOLVED** (Fixed in codebase)
