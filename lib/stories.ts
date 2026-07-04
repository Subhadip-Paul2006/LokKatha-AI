export type Story = {
  id: string
  title: string
  village: string
  district: string
  speaker: string
  language: string
  image: string
  excerpt: string
}

export const recentStories: Story[] = [
  {
    id: 'weaver-song',
    title: 'The Weaver Who Sang to Her Loom',
    village: 'Fulia',
    district: 'Nadia',
    speaker: 'Anima Basak, 74',
    language: 'Bengali',
    image: '/images/story-weaver.png',
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
    image: '/images/story-boatman.png',
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
    image: '/images/story-potter.png',
    excerpt:
      'The terracotta horses of Bankura were never decoration — each curve was a promise made to a deity, shaped by hands that had never once written a word.',
  },
]

export type TimelineEntry = {
  decade: string
  title: string
  note: string
}

export const heritageTimeline: TimelineEntry[] = [
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
]
