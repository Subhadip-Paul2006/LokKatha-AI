'use client'

import { useEffect, useState, useRef } from 'react'

const BENGALI_WORDS = [
  'নমস্কার',       // Greetings
  'স্বাগতম',       // Welcome
  'ঐতিহ্য',      // Heritage
  'লোককথা',     // Folk Tales
  'সংস্কৃতি',     // Culture
  'স্মৃতি',       // Memory
  'শিকড়',       // Roots
  'বাংলার মাটি',   // Soil of Bengal
  'বাংলার মানুষ', // People of Bengal
  'প্রজন্ম',      // Generations
  'সংরক্ষণ',      // Preservation
]

export function CinematicIntro({ onComplete }: { onComplete?: () => void }) {
  const [scene, setScene] = useState<number>(1) // 1 to 6
  const [currentWordIdx, setCurrentWordIdx] = useState<number>(0)
  const [wordState, setWordState] = useState<'in' | 'out'>('in')
  const [showSkip, setShowSkip] = useState<boolean>(false)
  const [isAudioActive, setIsAudioActive] = useState<boolean>(false)
  const [unfoldProgress, setUnfoldProgress] = useState<number>(0) // 0% to 100% split
  const [isExiting, setIsExiting] = useState<boolean>(false)

  const audioCtxRef = useRef<AudioContext | null>(null)
  const timeoutsRef = useRef<NodeJS.Timeout[]>([])

  const addTimeout = (fn: () => void, delay: number) => {
    const t = setTimeout(fn, delay)
    timeoutsRef.current.push(t)
    return t
  }

  const clearTimeouts = () => {
    timeoutsRef.current.forEach(clearTimeout)
    timeoutsRef.current = []
  }

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Session check: skip if already seen in this session
    const seen = sessionStorage.getItem('lokkatha_cinematic_intro')
    if (seen === 'true') {
      finishIntro()
      return
    }

    // Reduced motion check
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReduced) {
      addTimeout(() => finishIntro(), 400)
      return
    }

    startCinematicSequence()

    return () => {
      clearTimeouts()
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  const finishIntro = () => {
    clearTimeouts()
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('lokkatha_cinematic_intro', 'true')
    }
    setScene(7) // Done
    onComplete?.()
  }

  const handleSkip = () => {
    setIsExiting(true)
    addTimeout(() => {
      finishIntro()
    }, 200)
  }

  const startCinematicSequence = () => {
    // Show Skip button after 2 seconds
    addTimeout(() => {
      setShowSkip(true)
    }, 2000)

    // SCENE 1: (0 - 800ms) Black -> Paper & Warm Dust Fade In
    setScene(1)

    // SCENE 2: (800ms - 3200ms) Bengali Word Sequence
    addTimeout(() => {
      setScene(2)
      let wordIdx = 0

      const stepWord = () => {
        if (wordIdx >= BENGALI_WORDS.length) return
        setCurrentWordIdx(wordIdx)
        setWordState('in')

        addTimeout(() => {
          setWordState('out')
          wordIdx++
          if (wordIdx < BENGALI_WORDS.length) {
            addTimeout(stepWord, 80)
          }
        }, 160)
      }

      stepWord()
    }, 800)

    // SCENE 3: (3200ms - 4200ms) Ancient Palm Leaf Manuscript Appears
    addTimeout(() => {
      setScene(3)
    }, 3200)

    // SCENE 4: (4200ms - 4800ms) Red Cotton Thread Unties
    addTimeout(() => {
      setScene(4)
    }, 4200)

    // SCENE 5: (4800ms - 5600ms) Manuscript Unfolds from Center Split
    addTimeout(() => {
      setScene(5)
      let startTime: number | null = null
      const duration = 800

      const animateSplit = (time: number) => {
        if (!startTime) startTime = time
        const elapsed = time - startTime
        const progress = Math.min(elapsed / duration, 1)
        // Smooth easeInOutCubic curve
        const eased = progress < 0.5 ? 4 * progress * progress * progress : 1 - Math.pow(-2 * progress + 2, 3) / 2
        setUnfoldProgress(eased * 100)

        if (progress < 1) {
          requestAnimationFrame(animateSplit)
        }
      }
      requestAnimationFrame(animateSplit)
    }, 4800)

    // SCENE 6: (5600ms - 6400ms) Reveal Homepage Interface & Finish
    addTimeout(() => {
      setScene(6)
      addTimeout(() => {
        finishIntro()
      }, 600)
    }, 5600)
  }

  // Synthesized Ambient Soundscape (Wind, Temple Bell, Soft Flute Harmonics)
  const toggleAmbientAudio = () => {
    if (isAudioActive) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
      setIsAudioActive(false)
      return
    }

    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      const ctx = new AudioCtx()
      audioCtxRef.current = ctx

      // 1. Soft Wind Drone
      const bufferSize = ctx.sampleRate * 2
      const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const output = noiseBuffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1
      }

      const whiteNoise = ctx.createBufferSource()
      whiteNoise.buffer = noiseBuffer
      whiteNoise.loop = true

      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.setValueAtTime(320, ctx.currentTime)
      filter.Q.setValueAtTime(3, ctx.currentTime)

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.01, ctx.currentTime)
      noiseGain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 2)

      whiteNoise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      whiteNoise.start()

      // 2. Temple Bell Chime (Pentatonic D4 tone)
      const bellOsc = ctx.createOscillator()
      const bellGain = ctx.createGain()
      bellOsc.type = 'sine'
      bellOsc.frequency.setValueAtTime(293.66, ctx.currentTime) // D4
      bellGain.gain.setValueAtTime(0.08, ctx.currentTime)
      bellGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3)

      bellOsc.connect(bellGain)
      bellGain.connect(ctx.destination)
      bellOsc.start()

      setIsAudioActive(true)
    } catch {
      setIsAudioActive(false)
    }
  }

  if (scene >= 7) return null

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden transition-opacity duration-300 ${
        isExiting ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        backgroundColor: scene === 1 ? '#0F0B08' : '#F7F1E5',
        transition: 'background-color 1.2s ease-in-out, opacity 300ms ease-out',
      }}
      aria-label="LokKatha AI Cinematic Intro"
      role="dialog"
    >
      {/* Handcrafted Paper Grain & Dust Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-1000"
        style={{
          opacity: scene === 1 ? 0.03 : 0.06,
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          mixBlendMode: 'multiply',
        }}
      />

      {/* Floating Ambient Dust Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
        <div className="absolute w-2 h-2 rounded-full bg-[#C9A646]/30 top-1/4 left-1/6 animate-pulse" />
        <div className="absolute w-1.5 h-1.5 rounded-full bg-[#B65A38]/25 top-1/3 right-1/4 animate-pulse delay-500" />
        <div className="absolute w-1 h-1 rounded-full bg-[#4B3425]/20 bottom-1/4 left-1/3 animate-pulse delay-1000" />
        <div className="absolute w-2.5 h-2.5 rounded-full bg-[#C9A646]/20 bottom-1/3 right-1/5 animate-pulse delay-300" />
      </div>

      {/* Skip Intro Button (Appears after 2 seconds) */}
      {showSkip && (
        <button
          onClick={handleSkip}
          className="absolute top-6 right-6 z-50 px-4 py-2 text-xs font-serif tracking-widest uppercase text-[#4B3425] bg-[#EFE4C8]/90 hover:bg-[#EFE4C8] border border-[#B65A38]/30 rounded-full shadow-md backdrop-blur-sm transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-[#C9A646]"
        >
          Skip Intro →
        </button>
      )}

      {/* Audio Ambient Control */}
      {showSkip && (
        <button
          onClick={toggleAmbientAudio}
          className="absolute top-6 left-6 z-50 p-2 text-sm text-[#4B3425] bg-[#EFE4C8]/90 hover:bg-[#EFE4C8] border border-[#B65A38]/30 rounded-full shadow-md transition-all duration-300 focus:outline-none"
          title={isAudioActive ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
          aria-label={isAudioActive ? 'Mute ambient soundscape' : 'Enable ambient soundscape'}
        >
          {isAudioActive ? '🔔' : '🔕'}
        </button>
      )}

      {/* SCENE 2: Sequential Handwritten Bengali Words */}
      {scene === 2 && (
        <div className="relative z-20 flex items-center justify-center h-32 px-6 text-center">
          <span
            className={`text-4xl md:text-6xl font-bn-serif text-[#2B2118] tracking-widest transition-all duration-300 transform ${
              wordState === 'in'
                ? 'opacity-100 translate-y-0 scale-100'
                : 'opacity-0 -translate-y-3 scale-95'
            }`}
            style={{
              fontFamily: 'var(--font-bn-serif), "Noto Serif Bengali", "Tiro Bangla", serif',
            }}
          >
            {BENGALI_WORDS[currentWordIdx]}
          </span>
        </div>
      )}

      {/* SCENE 3, 4, 5 & 6: Ancient Palm-Leaf Manuscript & Unfold Animation */}
      {(scene >= 3 && scene <= 6) && (
        <div className="relative z-20 flex flex-col items-center justify-center">
          {/* Radiant Golden Light (Emerges during Scene 5 & 6) */}
          <div
            className={`absolute w-[500px] h-[500px] rounded-full bg-radial from-[#C9A646]/50 via-[#EFE4C8]/30 to-transparent blur-2xl transition-opacity duration-1000 ${
              scene >= 5 ? 'opacity-100 scale-125' : 'opacity-0 scale-90'
            }`}
          />

          {/* Manuscript Card Container */}
          <div
            className="relative w-80 h-[480px] sm:w-[420px] sm:h-[520px] rounded-2xl bg-[#EFE4C8] border-2 border-[#B65A38]/70 shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-hidden transition-transform duration-700"
            style={{
              boxShadow: '0 20px 50px rgba(43, 33, 24, 0.25), 0 4px 10px rgba(182, 90, 56, 0.15)',
              clipPath:
                scene >= 5
                  ? `polygon(${unfoldProgress / 2}% 0%, ${100 - unfoldProgress / 2}% 0%, ${
                      100 - unfoldProgress / 2
                    }% 100%, ${unfoldProgress / 2}% 100%)`
                  : 'none',
            }}
          >
            {/* Bishnupur Terracotta Corner Carvings */}
            <div className="absolute top-3 left-3 w-10 h-10 border-t-2 border-l-2 border-[#B65A38]" />
            <div className="absolute top-3 right-3 w-10 h-10 border-t-2 border-r-2 border-[#B65A38]" />
            <div className="absolute bottom-3 left-3 w-10 h-10 border-b-2 border-l-2 border-[#B65A38]" />
            <div className="absolute bottom-3 right-3 w-10 h-10 border-b-2 border-r-2 border-[#B65A38]" />

            {/* Muted Gold Corner Brackets */}
            <div className="absolute top-0 right-0 w-0 h-0 border-t-[32px] border-t-[#C9A646] border-l-[32px] border-l-transparent" />
            <div className="absolute bottom-0 left-0 w-0 h-0 border-b-[32px] border-b-[#C9A646] border-r-[32px] border-r-transparent" />

            {/* Traditional Header Motif */}
            <div className="flex justify-between items-center border-b border-[#4B3425]/25 pb-4">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#B65A38]" />
                <span className="text-[11px] font-serif tracking-widest text-[#8C4529] uppercase font-semibold">
                  Bishnupur Archival Record
                </span>
              </div>
              <span className="text-sm font-serif text-[#C9A646]">🪷</span>
            </div>

            {/* Center Palm-Leaf Manuscript Artwork & Seal */}
            <div className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-4 my-2">
              {/* Sacred Alpana Symbol */}
              <div className="w-20 h-20 rounded-full bg-[#F7F1E5] border-2 border-[#B65A38]/40 flex items-center justify-center shadow-inner">
                <svg className="w-12 h-12 text-[#B65A38]" viewBox="0 0 100 100" fill="currentColor">
                  <path d="M50 10 C35 30 35 45 50 50 C65 45 65 30 50 10 Z M50 90 C35 70 35 55 50 50 C65 55 65 70 50 90 Z M10 50 C30 35 45 35 50 50 C45 65 30 65 10 50 Z M90 50 C70 35 55 35 50 50 C55 65 70 65 90 50 Z" />
                  <circle cx="50" cy="50" r="8" fill="#C9A646" />
                </svg>
              </div>

              {/* Title & Description */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-serif text-[#2B2118] font-bold tracking-wide">
                  লোককথা AI
                </h1>
                <p className="text-xs sm:text-sm font-serif text-[#8C4529] mt-1 font-medium tracking-wider">
                  LokKatha AI – Living Cultural Memory
                </p>
              </div>

              <div className="w-24 h-0.5 bg-[#C9A646]/60 rounded-full my-1" />

              <p className="text-xs font-sans text-[#4B3425] leading-relaxed max-w-[260px]">
                Preserving the voices, oral traditions, and eternal wisdom of India's generations.
              </p>
            </div>

            {/* Footer Traditional Stamp & Details */}
            <div className="border-t border-[#4B3425]/25 pt-4 flex justify-between items-center text-[10px] font-serif text-[#736357]">
              <span>CULTURAL HERITAGE ARCHIVE</span>
              <span className="text-[#58734D] font-semibold tracking-wider">GENMA AI POWERED</span>
            </div>

            {/* SCENE 4: Traditional Red Cotton Thread & Untie Motion */}
            {(scene === 3 || scene === 4) && (
              <div
                className={`absolute inset-0 pointer-events-none transition-all duration-700 ${
                  scene === 4 ? 'translate-y-6 opacity-0' : 'opacity-100'
                }`}
              >
                {/* Horizontal Red Cotton Thread */}
                <div className="absolute top-1/2 left-0 right-0 h-1 bg-[#A2362A] shadow-md transform -translate-y-1/2" />
                
                {/* Thread Knot at Center */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-[#A2362A] border-2 border-[#F7F1E5] shadow-lg flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-[#C9A646]" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
