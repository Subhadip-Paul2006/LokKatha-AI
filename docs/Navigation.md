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
Recording → Transcribing → Gemma Thinking → Generating Summary → Translating → Saving
Each step: icon fades from `temple-stone` (pending) → `muted-gold` (active, subtle pulse) → `forest-green` (done, checkmark). This is a state machine — build it as a single component driven by a `status` enum, not six hardcoded screens.

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
Mobile:  <640px   — single column, hero illustration moves below heading/CTA, timeline goes vertical
Tablet:  640–1024px — 2-col grids, nav condenses to hamburger
Desktop: >1024px  — full layout as specified above

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
