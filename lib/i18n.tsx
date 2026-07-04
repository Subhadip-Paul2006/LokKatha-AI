'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

export type Lang = 'en' | 'bn'

/** Canonical language values for the Record form (kept stable across locales). */
export const LANGUAGE_VALUES = [
  'Bengali',
  'Hindi',
  'Santali',
  'Odia',
  'Assamese',
  'Maithili',
  'Bhojpuri',
] as const

type Dict = {
  /** Label shown on the nav toggle (the language you switch TO). */
  toggleLabel: string
  switchAria: string
  nav: { about: string; archive: string; ask: string; github: string }
  hero: {
    badge: string
    title: string
    subtitle: string
    explore: string
    record: string
  }
  mission: {
    eyebrow: string
    heading: string
    cards: { title: string; body: string }[]
  }
  record: {
    eyebrow: string
    heading: string
    subtitle: string
    upload: string
    recordVoice: string
    uploadPlaceholder: string
    tapToRecord: string
    sampleCaptured: string
    language: string
    district: string
    villageOpt: string
    speakerOpt: string
    selectLanguage: string
    languageLabels: string[]
    districtPlaceholder: string
    villagePlaceholder: string
    speakerPlaceholder: string
    submit: string
    errSource: string
    errLanguage: string
    errDistrict: string
    processing: string
    doneHeading: string
    doneText: string
    recordAnother: string
  }
  steps: {
    recording: string
    transcribing: string
    thinking: string
    summary: string
    translating: string
    saving: string
  }
  ask: {
    eyebrow: string
    heading: string
    subtitle: string
    placeholder: string
    ask: string
    try: string
    suggestions: string[]
    loading: string
    errorHeading: string
    errorSuffix: string
    tryAgain: string
  }
  answer: { followThread: string; bookmark: string; removeBookmark: string; share: string }
  stories: {
    eyebrow: string
    heading: string
    explore: string
    read: string
  }
  timeline: { eyebrow: string; heading: string; subtitle: string }
  footer: {
    desc: string
    github: string
    team: string
    partner: string
    madeWithPre: string
    madeWithPost: string
    tagline: string
    loveLabel: string
  }
  data: {
    stories: {
      id: string
      title: string
      village: string
      district: string
      speaker: string
      language: string
      excerpt: string
    }[]
    timeline: { decade: string; title: string; note: string }[]
  }
}

const en: Dict = {
  toggleLabel: 'বাংলা',
  switchAria: 'Switch to Bengali',
  nav: { about: 'About', archive: 'Archive', ask: 'Ask AI', github: 'GitHub' },
  hero: {
    badge: 'A digital archive powered by Gemma',
    title: 'India\u2019s Living Cultural Memory',
    subtitle:
      'Preserving the voices, traditions, and wisdom of generations through AI — one story, one village, one memory at a time.',
    explore: 'Start Exploring',
    record: 'Record Story',
  },
  mission: {
    eyebrow: 'Why LokKatha exists',
    heading: 'A living record of who we have been',
    cards: [
      {
        title: 'Vanishing Traditions',
        body: 'Folk tales, harvest chants, and dialects fade with every elder we lose — we gather them before they are gone.',
      },
      {
        title: 'Preserve Voices',
        body: 'Real recordings in real tongues, kept as the storyteller spoke them — not flattened into text alone.',
      },
      {
        title: 'Powered by Gemma',
        body: 'Quiet, careful AI that transcribes, translates, and organises memory so it stays searchable for generations.',
      },
    ],
  },
  record: {
    eyebrow: 'Add to the archive',
    heading: 'Record a story from your village',
    subtitle:
      'Every entry becomes part of a shared register — spoken as it has always been, kept for those who come after.',
    upload: 'Upload Audio',
    recordVoice: 'Record Voice',
    uploadPlaceholder: 'Choose an audio file (.mp3, .wav, .m4a)',
    tapToRecord: 'Tap to record',
    sampleCaptured: 'Voice sample captured (0:42)',
    language: 'Language',
    district: 'District',
    villageOpt: 'Village (optional)',
    speakerOpt: 'Speaker name (optional)',
    selectLanguage: 'Select a language',
    languageLabels: ['Bengali', 'Hindi', 'Santali', 'Odia', 'Assamese', 'Maithili', 'Bhojpuri'],
    districtPlaceholder: 'e.g. Bankura',
    villagePlaceholder: 'e.g. Panchmura',
    speakerPlaceholder: 'Name of the storyteller',
    submit: 'Submit to the archive',
    errSource: 'Please upload audio or record a voice sample.',
    errLanguage: 'Choose the language of the story.',
    errDistrict: 'District is required.',
    processing: 'Preserving your story, unhurried and with care…',
    doneHeading: 'Your story has been preserved',
    doneText:
      'Thank you for adding to India\u2019s living memory. A librarian will review it and it will soon join the archive.',
    recordAnother: 'Record another',
  },
  steps: {
    recording: 'Recording',
    transcribing: 'Transcribing',
    thinking: 'Gemma Thinking',
    summary: 'Generating Summary',
    translating: 'Translating',
    saving: 'Saving',
  },
  ask: {
    eyebrow: 'Ask LokKatha',
    heading: 'Ask about India\u2019s forgotten stories',
    subtitle:
      'The archive answers gently — like a village librarian who has read every manuscript on the shelf.',
    placeholder: 'Ask about India\u2019s forgotten stories...',
    ask: 'Ask',
    try: 'Try:',
    suggestions: [
      'Tell me about the terracotta temples of Bishnupur',
      'What are Baul songs and who sings them?',
      'A forgotten harvest ritual from rural Bengal',
      'The story behind Bankura\u2019s clay horses',
    ],
    loading: 'Searching through India\u2019s memories…',
    errorHeading: 'The story couldn\u2019t be found',
    errorSuffix: 'Let\u2019s preserve another one.',
    tryAgain: 'Try again',
  },
  answer: {
    followThread: 'Follow the thread',
    bookmark: 'Bookmark this answer',
    removeBookmark: 'Remove bookmark',
    share: 'Share this answer',
  },
  stories: {
    eyebrow: 'From the archive',
    heading: 'Recently preserved stories',
    explore: 'Explore the full archive',
    read: 'Read Story',
  },
  timeline: {
    eyebrow: 'A walk through time',
    heading: 'Heritage timeline',
    subtitle:
      'Memory moves by decades. Each marker holds a tradition that once filled courtyards and fields.',
  },
  footer: {
    desc: 'A digital cultural archive that preserves the voices, traditions, and wisdom of India\u2019s villages — so no story is lost to time.',
    github: 'GitHub',
    team: 'The LokKatha Team',
    partner: 'In partnership with rural heritage NGOs',
    madeWithPre: 'Made with',
    madeWithPost: 'using Gemma',
    tagline: 'Preserving India\u2019s living cultural memory.',
    loveLabel: 'love',
  },
  data: {
    stories: [
      {
        id: 'weaver-song',
        title: 'The Weaver Who Sang to Her Loom',
        village: 'Fulia',
        district: 'Nadia',
        speaker: 'Anima Basak, 74',
        language: 'Bengali',
        excerpt:
          'Every thread she wove carried a verse — a habit passed down from her grandmother, who believed cloth remembered the songs sung over it.',
      },
      {
        id: 'boatman-dusk',
        title: 'The Boatman\u2019s Evening Prayer',
        village: 'Katwa',
        district: 'Purba Bardhaman',
        speaker: 'Nitai Mondal, 68',
        language: 'Bengali',
        excerpt:
          'Before the current turned at dusk, the old boatmen would hum to the river, asking safe passage for those who travelled after dark.',
      },
      {
        id: 'potter-clay',
        title: 'How the Village Learned to Read Clay',
        village: 'Panchmura',
        district: 'Bankura',
        speaker: 'Gouri Kumbhakar, 81',
        language: 'Bengali',
        excerpt:
          'The terracotta horses of Bankura were never decoration — each curve was a promise made to a deity, shaped by hands that had never once written a word.',
      },
    ],
    timeline: [
      {
        decade: '1940s',
        title: 'Partition Lullabies',
        note: 'Songs mothers carried across new borders, sung to children who would never see their grandmother\u2019s village.',
      },
      {
        decade: '1950s',
        title: 'Courtyard Storytellers',
        note: 'Evening gatherings where a single kerosene lamp lit an entire generation\u2019s memory of folk tales.',
      },
      {
        decade: '1960s',
        title: 'The Baul Wanderers',
        note: 'Mystic minstrels of Bengal, trading philosophy for a meal, keeping oral wisdom alive on foot.',
      },
      {
        decade: '1970s',
        title: 'Harvest Chants',
        note: 'Field songs that timed the rhythm of planting and reaping, now fading with mechanised farming.',
      },
      {
        decade: '1980s',
        title: 'Radio & the Village',
        note: 'The first recordings of rural voices, fragile tapes that captured what paper never could.',
      },
      {
        decade: '1990s',
        title: 'Vanishing Dialects',
        note: 'Regional tongues began to thin as younger speakers moved to cities and to shared languages.',
      },
    ],
  },
}

const bn: Dict = {
  toggleLabel: 'EN',
  switchAria: 'Switch to English',
  nav: { about: 'পরিচিতি', archive: 'সংগ্রহশালা', ask: 'AI-কে জিজ্ঞাসা', github: 'গিটহাব' },
  hero: {
    badge: 'জেমা দ্বারা চালিত একটি ডিজিটাল সংগ্রহশালা',
    title: 'ভারতের জীবন্ত সাংস্কৃতিক স্মৃতি',
    subtitle:
      'কৃত্রিম বুদ্ধিমত্তার মাধ্যমে প্রজন্মের কণ্ঠ, ঐতিহ্য ও জ্ঞান সংরক্ষণ — একটি করে গল্প, একটি করে গ্রাম, একটি করে স্মৃতি।',
    explore: 'অন্বেষণ শুরু করুন',
    record: 'গল্প রেকর্ড করুন',
  },
  mission: {
    eyebrow: 'কেন লোককথা',
    heading: 'আমরা যা ছিলাম তার এক জীবন্ত দলিল',
    cards: [
      {
        title: 'বিলীয়মান ঐতিহ্য',
        body: 'প্রতিটি প্রবীণের সাথে লোককথা, ফসলের গান আর উপভাষা হারিয়ে যায় — হারিয়ে যাওয়ার আগেই আমরা সেগুলি সংগ্রহ করি।',
      },
      {
        title: 'কণ্ঠস্বর সংরক্ষণ',
        body: 'আসল ভাষায় আসল রেকর্ডিং, গল্পকার যেমন বলেছেন ঠিক তেমনই রাখা — শুধু লেখায় সীমাবদ্ধ নয়।',
      },
      {
        title: 'জেমা দ্বারা চালিত',
        body: 'শান্ত, যত্নশীল AI যা প্রতিলিপি করে, অনুবাদ করে এবং স্মৃতি সাজিয়ে রাখে যাতে তা প্রজন্মের পর প্রজন্ম খুঁজে পাওয়া যায়।',
      },
    ],
  },
  record: {
    eyebrow: 'সংগ্রহশালায় যোগ করুন',
    heading: 'আপনার গ্রামের একটি গল্প রেকর্ড করুন',
    subtitle:
      'প্রতিটি অন্তর্ভুক্তি একটি সম্মিলিত দলিলের অংশ হয়ে ওঠে — চিরকাল যেমন বলা হয়েছে তেমনই, পরবর্তীদের জন্য সংরক্ষিত।',
    upload: 'অডিও আপলোড',
    recordVoice: 'কণ্ঠ রেকর্ড',
    uploadPlaceholder: 'একটি অডিও ফাইল বেছে নিন (.mp3, .wav, .m4a)',
    tapToRecord: 'রেকর্ড করতে ট্যাপ করুন',
    sampleCaptured: 'কণ্ঠের নমুনা ধারণ করা হয়েছে (0:42)',
    language: 'ভাষা',
    district: 'জেলা',
    villageOpt: 'গ্রাম (ঐচ্ছিক)',
    speakerOpt: 'বক্তার নাম (ঐচ্ছিক)',
    selectLanguage: 'একটি ভাষা নির্বাচন করুন',
    languageLabels: ['বাংলা', 'হিন্দি', 'সাঁওতালি', 'ওড়িয়া', 'অসমীয়া', 'মৈথিলী', 'ভোজপুরি'],
    districtPlaceholder: 'যেমন বাঁকুড়া',
    villagePlaceholder: 'যেমন পাঁচমুড়া',
    speakerPlaceholder: 'গল্পকারের নাম',
    submit: 'সংগ্রহশালায় জমা দিন',
    errSource: 'অনুগ্রহ করে অডিও আপলোড করুন বা কণ্ঠের নমুনা রেকর্ড করুন।',
    errLanguage: 'গল্পের ভাষা বেছে নিন।',
    errDistrict: 'জেলা আবশ্যক।',
    processing: 'আপনার গল্প সংরক্ষণ করা হচ্ছে, ধীরে ও যত্নের সাথে…',
    doneHeading: 'আপনার গল্প সংরক্ষিত হয়েছে',
    doneText:
      'ভারতের জীবন্ত স্মৃতিতে অবদান রাখার জন্য ধন্যবাদ। একজন গ্রন্থাগারিক এটি পর্যালোচনা করবেন এবং শীঘ্রই এটি সংগ্রহশালায় যুক্ত হবে।',
    recordAnother: 'আরেকটি রেকর্ড করুন',
  },
  steps: {
    recording: 'রেকর্ডিং',
    transcribing: 'প্রতিলিপি করা হচ্ছে',
    thinking: 'জেমা ভাবছে',
    summary: 'সারসংক্ষেপ তৈরি',
    translating: 'অনুবাদ করা হচ্ছে',
    saving: 'সংরক্ষণ করা হচ্ছে',
  },
  ask: {
    eyebrow: 'লোককথাকে জিজ্ঞাসা করুন',
    heading: 'ভারতের ভুলে যাওয়া গল্প সম্পর্কে জিজ্ঞাসা করুন',
    subtitle:
      'সংগ্রহশালা কোমলভাবে উত্তর দেয় — যেন এক গ্রাম্য গ্রন্থাগারিক যিনি তাকের প্রতিটি পাণ্ডুলিপি পড়েছেন।',
    placeholder: 'ভারতের ভুলে যাওয়া গল্প সম্পর্কে জিজ্ঞাসা করুন...',
    ask: 'জিজ্ঞাসা',
    try: 'চেষ্টা করুন:',
    suggestions: [
      'বিষ্ণুপুরের পোড়ামাটির মন্দির সম্পর্কে বলুন',
      'বাউল গান কী এবং কারা গায়?',
      'গ্রামবাংলার একটি ভুলে যাওয়া ফসলি আচার',
      'বাঁকুড়ার মাটির ঘোড়ার পিছনের গল্প',
    ],
    loading: 'ভারতের স্মৃতির ভেতর খোঁজা হচ্ছে…',
    errorHeading: 'গল্পটি খুঁজে পাওয়া গেল না',
    errorSuffix: 'চলুন আরেকটি সংরক্ষণ করি।',
    tryAgain: 'আবার চেষ্টা করুন',
  },
  answer: {
    followThread: 'সূত্র ধরে এগোন',
    bookmark: 'এই উত্তরটি বুকমার্ক করুন',
    removeBookmark: 'বুকমার্ক সরান',
    share: 'এই উত্তরটি শেয়ার করুন',
  },
  stories: {
    eyebrow: 'সংগ্রহশালা থেকে',
    heading: 'সম্প্রতি সংরক্ষিত গল্প',
    explore: 'সম্পূর্ণ সংগ্রহশালা দেখুন',
    read: 'গল্প পড়ুন',
  },
  timeline: {
    eyebrow: 'সময়ের পথ ধরে',
    heading: 'ঐতিহ্যের সময়রেখা',
    subtitle:
      'স্মৃতি দশক ধরে এগোয়। প্রতিটি চিহ্ন এমন এক ঐতিহ্য ধরে রাখে যা একদিন উঠোন আর মাঠ ভরিয়ে রাখত।',
  },
  footer: {
    desc: 'একটি ডিজিটাল সাংস্কৃতিক সংগ্রহশালা যা ভারতের গ্রামের কণ্ঠ, ঐতিহ্য ও জ্ঞান সংরক্ষণ করে — যাতে কোনো গল্প কালের গর্ভে হারিয়ে না যায়।',
    github: 'গিটহাব',
    team: 'লোককথা দল',
    partner: 'গ্রামীণ ঐতিহ্য সংক্রান্ত এনজিওদের সহযোগিতায়',
    madeWithPre: 'তৈরি',
    madeWithPost: '— জেমা দিয়ে',
    tagline: 'ভারতের জীবন্ত সাংস্কৃতিক স্মৃতি সংরক্ষণ।',
    loveLabel: 'ভালোবাসা',
  },
  data: {
    stories: [
      {
        id: 'weaver-song',
        title: 'যে তাঁতি তার তাঁতের কাছে গান গাইত',
        village: 'ফুলিয়া',
        district: 'নদিয়া',
        speaker: 'অনিমা বসাক, ৭৪',
        language: 'বাংলা',
        excerpt:
          'তার বোনা প্রতিটি সুতো একটি করে পদ বহন করত — এই অভ্যাস তার ঠাকুমার কাছ থেকে পাওয়া, যিনি বিশ্বাস করতেন কাপড় তার উপর গাওয়া গান মনে রাখে।',
      },
      {
        id: 'boatman-dusk',
        title: 'মাঝির সন্ধ্যার প্রার্থনা',
        village: 'কাটোয়া',
        district: 'পূর্ব বর্ধমান',
        speaker: 'নিতাই মণ্ডল, ৬৮',
        language: 'বাংলা',
        excerpt:
          'সন্ধ্যায় স্রোত ঘুরে যাওয়ার আগে বুড়ো মাঝিরা নদীর কাছে গুনগুন করত, রাতের অন্ধকারে যারা পাড়ি দেবে তাদের নিরাপদ যাত্রা চেয়ে।',
      },
      {
        id: 'potter-clay',
        title: 'গ্রাম কীভাবে মাটি পড়তে শিখল',
        village: 'পাঁচমুড়া',
        district: 'বাঁকুড়া',
        speaker: 'গৌরী কুম্ভকার, ৮১',
        language: 'বাংলা',
        excerpt:
          'বাঁকুড়ার পোড়ামাটির ঘোড়া কখনো নিছক সাজসজ্জা ছিল না — প্রতিটি বাঁক ছিল কোনো দেবতার কাছে করা এক প্রতিশ্রুতি, এমন হাতে গড়া যা কখনো একটি শব্দও লেখেনি।',
      },
    ],
    timeline: [
      {
        decade: '1940s',
        title: 'দেশভাগের ঘুমপাড়ানি গান',
        note: 'নতুন সীমান্ত পেরিয়ে মায়েরা যে গান বহন করেছিলেন, যা গাওয়া হতো এমন শিশুদের যারা কখনো ঠাকুমার গ্রাম দেখবে না।',
      },
      {
        decade: '1950s',
        title: 'উঠোনের গল্পকথক',
        note: 'সান্ধ্য আসর, যেখানে একটিমাত্র কেরোসিন বাতি এক প্রজন্মের লোককথার স্মৃতি আলোকিত করত।',
      },
      {
        decade: '1960s',
        title: 'বাউল পথিক',
        note: 'বাংলার রহস্যবাদী বাউল, এক বেলার খাবারের বিনিময়ে দর্শন বিলিয়ে, পায়ে হেঁটে মৌখিক জ্ঞান বাঁচিয়ে রাখতেন।',
      },
      {
        decade: '1970s',
        title: 'ফসলের গান',
        note: 'মাঠের গান যা বপন ও ফসল কাটার ছন্দ ঠিক করত, এখন যন্ত্রনির্ভর চাষে বিলীয়মান।',
      },
      {
        decade: '1980s',
        title: 'রেডিও ও গ্রাম',
        note: 'গ্রামীণ কণ্ঠের প্রথম রেকর্ডিং, ভঙ্গুর ক্যাসেট যা কাগজ যা পারেনি তা ধরে রেখেছিল।',
      },
      {
        decade: '1990s',
        title: 'বিলীয়মান উপভাষা',
        note: 'তরুণ বক্তারা শহরে ও সাধারণ ভাষায় সরে যাওয়ায় আঞ্চলিক ভাষা ক্ষীণ হতে শুরু করে।',
      },
    ],
  },
}

const DICTS: Record<Lang, Dict> = { en, bn }

type I18nValue = {
  lang: Lang
  t: Dict
  toggle: () => void
  setLang: (l: Lang) => void
}

const I18nContext = createContext<I18nValue | null>(null)

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en')

  useEffect(() => {
    const root = document.documentElement
    root.lang = lang
    root.classList.toggle('lang-bn', lang === 'bn')
  }, [lang])

  const toggle = useCallback(() => setLang((l) => (l === 'en' ? 'bn' : 'en')), [])

  const value = useMemo<I18nValue>(
    () => ({ lang, t: DICTS[lang], toggle, setLang }),
    [lang, toggle],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within an I18nProvider')
  return ctx
}
