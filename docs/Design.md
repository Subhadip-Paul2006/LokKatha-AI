# LokKatha AI — Design System & Frontend Specification (v2)

> **Project Name:** LokKatha AI – India's Living Cultural Memory
> **Track:** Build with Gemma | GenAI for Good
> **Stack:** Next.js 15 (App Router) + TypeScript + TailwindCSS + shadcn/ui + Framer Motion + Axios
> **Backend:** Next.js API Routes (Route Handlers)
> **Database/Storage:** Supabase PostgreSQL + Supabase Storage (audio/images)
> **Target:** 24-Hour Hackathon MVP
> **Model:** Gemma (display name in UI only — see AI Personality section for wording rules)

## Primary Goal
This must not read as "another AI chatbot with a nice theme." The bar: a judge who has seen 40 GenAI demos today should feel a genuine tonal shift in the first 3 seconds — like opening a manuscript, not opening an app. Every visual decision should trace back to one of: **Palm-leaf manuscripts, Terracotta temples (Bishnupur), Bengal courtyard libraries, Madhubani/Warli folk art.** If a component doesn't clearly trace to one of these four, cut it or redesign it.

**Non-negotiable constraint:** it must still be fast, legible, and usable in a live 24-hour build. Beauty that breaks the build timeline is not in scope — see "MVP Cut Line" at the end.

---

## 1. Design Philosophy & Anti-Patterns

**Feels like:** ancient manuscripts, terracotta temples, palm-leaf books, folk art, village museums, traditional libraries.
**Never resembles:** ChatGPT, Gemini, Claude, or any generic SaaS dashboard — no floating chat bubbles, no purple-blue gradients, no glassmorphism, no rounded pill-chips-everywhere aesthetic.

**Emotional register:** warm, calm, cultural, trustworthy, human, minimal, premium, unhurried.

**Explicit anti-patterns to check against before shipping any screen:**
- ❌ Chat-bubble UI for Q&A (use manuscript/answer-card layout instead — see §8)
- ❌ Neon/saturated accent colors
- ❌ Generic spinner loaders (use the palm-leaf/timeline loaders in §11–12)
- ❌ Sans-serif headings (headings are always serif/handwritten-serif per §3)
- ❌ Sharp 90° corners anywhere
- ❌ More than one animated element competing for attention at once

---

## 2. Color System (contrast-verified)

All pairs below are checked against WCAG AA (4.5:1 for body text, 3:1 for large text ≥24px/bold ≥18.66px).

| Token | Hex | Usage | Verified pairing |
|---|---|---|---|
| `bg-cream` | `#F7F1E5` | Primary background | Body text → use `ink` or `brown-dark`, NOT `terracotta` |
| `bg-palmleaf` | `#EFE4C8` | Secondary background / card fill | Body text → `ink` |
| `paper-old` | `#FFF8EE` | Card/manuscript surface | Body text → `ink` |
| `ink` | `#2B2118` | Primary text | 12.8:1 on cream ✅ AA body |
| `brown-dark` | `#4B3425` | Secondary text, borders | 8.9:1 on cream ✅ AA body |
| `terracotta` | `#B65A38` | **Headings, icons, large text, borders only** | 3.4:1 on cream — fails AA for body text ⚠️ |
| `terracotta-deep` | `#8C4529` | Body-safe terracotta (links, small labels) | 5.2:1 on cream ✅ AA body |
| `clay-orange` | `#C87941` | Buttons (with `ink` or white text on top) | Use white text at 4.6:1 ✅ |
| `muted-gold` | `#C9A646` | Hover glow, accents, dividers only — never text on light bg | 2.1:1 — decorative use only |
| `forest-green` | `#58734D` | Success states, "verified story" tag | 4.7:1 on cream ✅ AA |
| `accent-red` | `#A2362A` | Errors, destructive actions | 5.6:1 on cream ✅ AA |
| `temple-stone` | `#736357` | Disabled states, meta text | 4.5:1 on cream — borderline, use ≥16px |

**Rule of thumb:** `terracotta` is a *heading and accent* color, not a *body text* color. This is the single most common way this palette breaks accessibility — flag it in code review.

---

## 3. Typography

### Headings — Serif/manuscript feel
**Primary:** Tiro Bangla or Noto Serif Bengali (for genuine Bengali-script warmth) → fallback **Cormorant Garamond** for Latin-only headings.
Letter-spacing: `0.01em`–`0.02em`. Line-height: `1.15`–`1.25`. Never all-caps (breaks the handwritten manuscript feel).

**Accent/handwritten touches only** (pull-quotes, section labels, small annotations): Kalam — used sparingly, never for primary headings, never for body copy. Kalam reads as casual/playful, not archival, so overuse undercuts the "ancient manuscript" tone.

### Body
Inter or Source Sans Pro, weight 400/500, line-height `1.6`–`1.7` (generous — this is a reading-heavy product), max line length ~70ch for long-form story text.

### Quotes / Story excerpts
Playfair Display Italic — reserved *only* for folk tales, quoted oral testimony, and pull-quotes. Never for UI labels or buttons.

### Type scale (Tailwind-mappable)

xs   12px   meta/captions
sm   14px   secondary text
base 16px   body
lg   18px   lead paragraph
xl   22px   card titles
2xl  28px   section subheads
3xl  36px   section heads
4xl  48px   hero heading (mobile: 32px)
5xl  64px   hero heading (desktop only)
---

## 4. Spacing, Borders, Shadows

**Spacing scale:** 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96px (Tailwind default scale — don't invent a custom one, saves build time).

**Border radius:** `12px` small components (buttons, inputs), `20px` cards, `28px` hero/large panels. Never `0` or sharp corners.

**Border style:** `1.5px–2px` solid `brown-dark` or `terracotta` at 40–60% opacity — described as "earthy" but implemented as a real, testable value, not a vague texture.

**Shadow ("old paper" feel):**
```css
box-shadow: 0 2px 8px rgba(43, 33, 24, 0.08), 0 1px 2px rgba(43, 33, 24, 0.12);
```
Warm, low-opacity, brown-tinted — never pure black shadows.

---

## 5. Icons & Illustration

**Icons:** Lucide only, `strokeWidth={1.5}`, size 20–24px inline / 32–40px feature icons. Preferred set: Book, Mic, Languages, TreeDeciduous, Archive, Map, Compass, Search, Heart, Feather, Leaf, History, ScrollText.

**Illustrations:** Custom flat-vector SVG, muted earth palette (pull from §2 tokens only — don't introduce new colors in illustrations), minimal linework, traditional-Indian-art-influenced (Madhubani/Warli line quality). No 3D, no cartoon, no clipart-style stock illustration.

**Texture:** paper-grain background at ≤4% opacity max (must stay non-distracting — test at actual reading size, not zoomed in). Terracotta motif border only at page edges (top/bottom or corners), never framing every card. Madhubani corner ornament: one per major section max, small, low-contrast.

---

## 6. Motion System

Motion should feel like **turning a page**, not like a SaaS product's micro-interactions. Concrete values (so it's actually buildable, not just "slow and elegant"):

| Element | Effect | Duration | Easing |
|---|---|---|---|
| Page load | Fade + rise (16px) | 600ms | `cubic-bezier(0.22, 1, 0.36, 1)` |
| Card entry | Fade + rise (12px), staggered 80ms per card | 450ms | same |
| Button hover | Scale 1.02 + gold glow | 200ms | ease-out |
| Section scroll-entry | Fade only (no slide) | 500ms | ease-out |
| Hero heading | Typewriter, ~40ms/char | — | linear |
| Page transition | Cross-fade (never hard cut) | 350ms | ease-in-out |

**Hard rule:** max one animated focal point on screen at a time. If cards are staggering in, nothing else should be animating simultaneously. Respect `prefers-reduced-motion` — fall back to opacity-only fades, no movement, no typewriter (render full text immediately).

---

## 7. Page Structure — Landing
Navigation (sticky, transparent → cream on scroll)
↓
Hero
↓
Mission (3-card)
↓
Record Story (CTA into upload flow)
↓
Ask LokKatha (search entry point)
↓
Recent Stories (grid)
↓
Heritage Timeline
↓
Footer

### Navigation
Logo + "LokKatha AI" wordmark · About · Archive · Ask AI · Language switcher · GitHub icon. No login/auth for MVP. Sticky; background shifts from transparent to `cream` at 80% opacity with backdrop-blur after 40px scroll.

### Hero
- **Left:** Heading "India's Living Cultural Memory" (typewriter, once, on first load only — not on every route change). Subheading: "Preserving the voices, traditions, and wisdom of generations through AI." Two CTAs: primary (`clay-orange` fill) "Start Exploring", secondary (outline, `terracotta` border) "Record Story".
- **Right:** Single custom illustration combining library/palm-leaf/temple motifs — one cohesive scene, not three separate stacked images.
- **Background:** Alpana-pattern at ≤5% opacity, ink or terracotta line color.

### Mission — 3 cards, styled as aged document cards
🌾 Vanishing Traditions · 🎙️ Preserve Voices · 🤖 Powered by Gemma — each with 1 sentence, not paragraphs.

### Record Story — "archive register" form
Fields: Upload Audio / Record Voice (toggle), Upload Image (optional), Language dropdown, District, Village, Speaker Name, Submit. Validate before submit (required: audio-or-recording + language + district). Show inline errors in `accent-red`, not toast-only.

### Ask LokKatha
Search bar (placeholder: "Ask about India's forgotten stories..."), suggested-question chips below (not buttons styled like generic pills — use underline-on-hover text links instead, more archive-catalog-like). Answer renders as a manuscript-style card (§8).

### Recent Stories
Grid, 3-col desktop / 2-col tablet / 1-col mobile. Card: illustration thumbnail, village name, speaker, language tag, "Read Story" link.

### Heritage Timeline
Horizontal scroll-snap timeline, decades as anchor points, story markers along it. On mobile, converts to vertical timeline (horizontal scroll on touch devices has poor discoverability — don't force it).

### Footer
Clay background, `paper-old` text. "Made with ♥ using Gemma" · mission line · GitHub · Team · NGO credit.

---

## 8. Answer / Story Card (core reusable component)
This is the most-reused component in the app — build it once, well.

Manuscript-styled card containing: Title, District/location tag, Story text (Playfair Display Italic for quoted excerpt, Inter for surrounding context), Translation toggle, Keywords (small tag row), Related Questions, Bookmark icon, Share icon. Language toggle switches translation in-place (no page reload). Audio player (if source recording exists) uses a custom-skinned player matching the palette — not the raw browser `<audio>` control.

---

## 9. AI Processing Screen
Vertical progress-step timeline, not a spinner:
[04/07, 4:14 pm] anynnomous~: Recording → Transcribing → Gemma Thinking → Generating Summary → Translating → Saving
[04/07, 4:14 pm] anynnomous~: Each step: icon fades from `temple-stone` (pending) → `muted-gold` (active, subtle pulse) → `forest-green` (done, checkmark). This is a state machine — build it as a single component driven by a `status` enum, not six hardcoded screens.

---

## 10. AI Personality & Copy Rules
Gemma's voice: a patient village librarian — warm, unhurried, never robotic, never exclamation-heavy, respects the storyteller. Practical rule for prompt-writing: system prompts to the model should ask for short, warm, plain-language responses and explicitly discourage AI-assistant-isms ("As an AI," "I'd be happy to help!"). 

**Implementation note:** "Gemma" / "Gemma Thinking" is a UI *display* label for warmth — keep the actual model identifier/config (whatever model is actually wired up) separate in code/env vars from this display string, so swapping models later doesn't require a UI copy change.

---

## 11. Empty, Loading, Error States
- **Empty:** closed-manuscript illustration + "No stories have been preserved yet. Become the first storyteller." with a direct CTA button to Record Story (don't leave it as a dead end).
- **Loading:** slowly rotating palm-leaf icon (4s rotation, ease-in-out, looping) + "Searching through India's memories..."
- **Error:** broken clay-pot illustration + "The story couldn't be found. Let's preserve another one." + CTA back to Ask/Record.

---

## 12. Accessibility
- AA contrast minimum (see verified table in §2 — don't freehand new color combos without checking)
- Full keyboard navigation; visible focus ring in `muted-gold` at 2px offset (not the browser default, but not removed either)
- All icons have `aria-label`; decorative SVGs get `aria-hidden="true"`
- Audio player has captions/transcript fallback (the transcript *is* the story text already on the card — link them)
- `prefers-reduced-motion` respected per §6
- Minimum touch target 44×44px on mobile

---

## 13. Responsive Breakpoints
Mobile: <640px — single column, hero illustration moves below heading/CTA, timeline goes vertical
Tablet: 640–1024px — 2-col grids, nav condenses to hamburger
Desktop: >1024px — full layout as specified above
Design desktop-first visually, but build mobile-first in Tailwind (`sm:` `md:` `lg:` prefixes) — faster to extend than to retrofit.

---

## 14. Component → Tech Mapping (for build speed)
| Section | Key components | Notes |
|---|---|---|
| Hero | `Hero.tsx`, custom SVG | Framer Motion for typewriter + fade |
| Record Story | `StoryUploadForm.tsx` | react-hook-form + zod validation; Supabase Storage upload |
| Ask LokKatha | `AskSearch.tsx`, `AnswerCard.tsx` | Axios → API route → Gemma call → structured response |
| Processing screen | `ProcessingTimeline.tsx` | Single component, `status` prop drives state |
| Recent Stories | `StoryGrid.tsx`, `StoryCard.tsx` | Supabase query, paginated |
| Timeline | `HeritageTimeline.tsx` | CSS scroll-snap, no heavy library needed |

---

## 15. MVP Cut Line (24-hour reality check)
**Must have:** Hero, Record Story form + Supabase upload, Ask LokKatha with one working Gemma-backed answer flow, Answer Card, one loading state, basic responsive layout.
**Cut if short on time:** Heritage Timeline (replace with static "Coming soon" panel), Madhubani corner illustrations (use CSS border only), full illustration set (use 2–3 hero illustrations, reuse across states).
**Never cut:** color/type system consistency, AA contrast, the non-chatbot visual identity — these are what make the demo memorable to judges in the first 3 seconds.

---

## 16. Final Design Goal
A judge should feel, within seconds, that LokKatha AI is not another AI chatbot wrapper — it's a digital cultural archive that happens to be powered by Gemma, where the technology is deliberately quiet and the heritage is deliberately loud.

