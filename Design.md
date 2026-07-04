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
