# 🎨 LokKatha AI — UI/UX Design System & Asset Master Specifications

> **Core Philosophy:** Traditional Indian Cultural Heritage meets Minimalist Modern Web UX.  
> **Anti-Pattern Constraint:** Must NOT look like a generic, cold corporate AI chatbot (e.g., plain blue/gray ChatGPT clones).  
> **Visual Inspirations:** Terracotta Temples, Palm-Leaf Manuscripts, Alpana/Rangoli Geometric Art, Warli Stick-Figure Storytelling, and Madhubani Border Art.  

---

## 🎨 1. Master Design Tokens & Color Palette

### Primary Palette: Warm Terracotta & Sacred Saffron
```css
:root {
  /* Primary Terracotta (Grounded Base) */
  --color-terracotta-dark: #5C2417;     /* Header, Footers, Primary Buttons */
  --color-terracotta-main: #8B4513;     /* Card Borders, Active Accents */
  --color-terracotta-light: #C85A32;    /* Hover States, Highlights */

  /* Sacred Saffron & Ochre (Warmth & Energy) */
  --color-saffron-main: #D96B27;       /* Primary CTA Buttons, Badges */
  --color-saffron-light: #F4A261;      /* Tag Highlights, Active Tabs */

  /* Aged Parchment (Reading Comfort) */
  --color-parchment-bg: #FDF8F0;       /* App Page Background */
  --color-parchment-card: #F9F1E6;     /* Narrative Card Fill */
  --color-parchment-border: #E8D8C8;   /* Subtle Divider Lines */

  /* Ink & Typography (Legibility) */
  --color-ink-deep: #2C2523;           /* Primary Body Text */
  --color-ink-muted: #6B5B52;          /* Secondary Subtitles, Metadata */
  --color-ink-light: #8C7A6B;          /* Timestamps, Captions */

  /* Accent Gold (Heritage Excellence) */
  --color-gold-accent: #DAA520;        /* Citation Pins, Star Badges */
}
```

---

## 📜 2. Traditional Indian Motif Integrations

| Art Form / Craft | Application in UI | CSS / Graphical Implementation |
| :--- | :--- | :--- |
| **Terracotta Temples** | Grounded card containers, dark warm header bars, rounded clay pill badges. | `border: 2px solid var(--color-terracotta-main); box-shadow: 0 4px 12px rgba(92, 36, 23, 0.08);` |
| **Palm-Leaf Manuscripts** | Audio transcript reading views, story summary cards. | Textured background pattern (`#FDF8F0`), serif font with subtle line height (`1.75`), left border accent stripe. |
| **Alpana / Rangoli** | Section dividers, loading indicators, modal backdrop corners. | Fine SVG line art geometric circles and floral radial patterns rendered in warm gold/white (`rgba(218, 165, 32, 0.3)`). |
| **Warli Art** | Empty states, onboarding illustrations, volunteer category badges. | Minimalistic white/ochre stick-figure icons representing people gathering around a tree or telling stories. |
| **Madhubani Art** | Highlighted quote boxes, featured story card headers, audio citation popovers. | Double-line geometric borders with subtle decorative leaf/flower corner joints. |

---

## ✒️ 3. Typography Hierarchy

- **Header / Cultural Display Font:** `Rozha One` or `Cinzel Decorative` (Google Fonts)
  - *Usage:* Page titles, hero headlines, story card headers.
- **Body & Interface Font:** `Outfit` or `Inter` (Google Fonts)
  - *Usage:* Transcripts, search bars, buttons, system feedback.
- **Indic Script Display:** `Noto Serif Devanagari` (Hindi) & `Noto Serif Bengali` (Bengali)

```css
h1, h2, h3, .brand-title {
  font-family: 'Rozha One', 'Cinzel Decorative', serif;
  color: var(--color-terracotta-dark);
}

body, input, button {
  font-family: 'Outfit', sans-serif;
  color: var(--color-ink-deep);
}
```

---

## 🦊 4. Brand Identity: Logo, Mascot & Taglines

### Logo Concept:
- **Visual:** A stylized traditional clay lamp (*Diya*) combined with soundwaves forming the petals of a lotus.
- **Colors:** Deep Terracotta background with Saffron and Gold flame/soundwave lines.

### Mascot: "Lok-Kaka" (The Wise Storytelling Uncle)
- **Design:** An open-source illustrated traditional elder wearing a simple white *Kurta* and warm smile, holding an ancient palm-leaf scroll that emits subtle digital glowing sparkles.
- **Role:** Guides users through onboarding, introduces search tips, and appears on empty state views.

### Official Taglines:
- **Primary:** *"LokKatha AI — India's Living Cultural Memory."*
- **Emotional:** *"When an elder passes away, a library burns. We build the digital archive."*
- **Action-Oriented:** *"Preserving India's Living Heritage, One Voice at a Time."*

---

## 🖥️ 5. Key Page Layout Wireframes

### A. Landing Page & Hero Section
```
┌───────────────────────────────────────────────────────────────────────────┐
│ 🕉️ LOKKATHA AI               Search  Archive  NGO Dashboard  [ Record Story ]│
├───────────────────────────────────────────────────────────────────────────┤
│                                                                           │
│   [ Alpana Art Motif ]                                                    │
│   Preserve India's Living Cultural Memory                                 │
│   "Every time an elder passes away, centuries of oral wisdom vanish."      │
│                                                                           │
│   ┌───────────────────────────────────────────────────────────────────┐   │
│   │ 🔍 Search oral stories in English, Bengali, or Hindi...         │   │
│   └───────────────────────────────────────────────────────────────────┘   │
│                                                                           │
│   Popular Tags: [TEK Farming] [Folk Songs] [Purulia History] [Monsoon]    │
│                                                                           │
├───────────────────────────────────────────────────────────────────────────┤
│ 🎙️ FEATURED STORY OF THE DAY                                              │
│ ┌───────────────────────────────────────────────────────────────────────┐ │
│ │ "The Echo of Ektara" — Baul Traditions of Purulia                     │ │
│ │ Narrator: Gurupada Das (74 yrs) | Location: Purulia, West Bengal      │ │
│ │ 🔊 Audio Player [▶ 01:42 / 03:15] ───●──────────────────              │ │
│ │ Summary: The single string of the Ektara represents human unity...    │ │
│ │ [ Read in English ]  [ Read in Bengali ]  [ Read in Hindi ]           │ │
│ └───────────────────────────────────────────────────────────────────────┘ │
└───────────────────────────────────────────────────────────────────────────┘
```

---

### B. Loading Animation State
- **Visual:** A radial geometric **Alpana / Rangoli motif** rotates smoothly in the center of the screen with a breathing saffron glow.
- **Sub-text Status Cycling:**
  1. *"Cleaning field background noise..."*
  2. *"Transcribing speech with Whisper ASR..."*
  3. *"Consulting Gemma 4 Cultural Historian..."*
  4. *"Generating cross-lingual translations..."*

---

### C. Empty Search State
- **Illustration:** A minimal Warli art stick-figure scene depicting an elder sitting under a banyan tree with empty scroll space.
- **Message:** *"No matching oral accounts found in our archive yet."*
- **Action CTA Button:** *"Be the first volunteer to record a story on this topic!"*

---

### D. Error Page (404 / 500)
- **Visual:** An ancient torn parchment scroll illustration with traditional Indian motif border.
- **Message (404):** *"This story seems to have drifted into ancient history (Page Not Found)."*
- **Message (500):** *"Our digital scribes encountered a hiccup. Gemma 4 is restoring order."*
- **CTA:** *"Return to Living Archive Home"*

---
