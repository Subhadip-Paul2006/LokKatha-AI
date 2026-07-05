export interface StoryImage {
  src: string
  caption: string
  source: string
}

export const storyImageMap: Record<string, StoryImage> = {
  'behula': {
    src: '/images/story-boatman.png',
    caption: 'Behula floating on the raft with her husband Lakhinder.',
    source: 'Thakurmar Jhuli Illustration'
  },
  'lalkamal': {
    src: '/images/hero-archive.png',
    caption: 'Lalkamal and Nilkamal facing the Rakshashis.',
    source: 'Dakshinaranjan Mitra Majumdar'
  },
  'boatman': {
    src: '/images/story-boatman.png',
    caption: 'A traditional Bengali boatman (Majhi) on the Padma river.',
    source: 'Rural Bengal Archives'
  },
  'potter': {
    src: '/images/story-potter.png',
    caption: 'A potter crafting clay horses in Bankura.',
    source: 'Bankura Terracotta Tradition'
  },
  'weaver': {
    src: '/images/story-weaver.png',
    caption: 'Tanti (Weaver) working on a traditional handloom.',
    source: 'Bengal Handloom Heritage'
  }
}

export function getStoryImage(title: string | undefined): StoryImage | null {
  if (!title) return null
  const normalized = title.toLowerCase()
  for (const [key, image] of Object.entries(storyImageMap)) {
    if (normalized.includes(key)) {
      return image
    }
  }
  return null
}
