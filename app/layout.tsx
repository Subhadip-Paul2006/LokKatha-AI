import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import {
  Cormorant_Garamond,
  Inter,
  Playfair_Display,
  Kalam,
  Noto_Serif_Bengali,
  Noto_Sans_Bengali,
} from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-heading',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body',
  display: 'swap',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['italic', 'normal'],
  variable: '--font-quote',
  display: 'swap',
})

const kalam = Kalam({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-accent',
  display: 'swap',
})

const notoSerifBengali = Noto_Serif_Bengali({
  subsets: ['bengali'],
  weight: ['500', '600', '700'],
  variable: '--font-bn-serif',
  display: 'swap',
})

const notoSansBengali = Noto_Sans_Bengali({
  subsets: ['bengali'],
  weight: ['400', '500', '600'],
  variable: '--font-bn-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LokKatha AI — India\'s Living Cultural Memory',
  description:
    'Preserving the voices, traditions, and wisdom of generations through AI. A digital cultural archive powered by Gemma.',
  generator: 'v0.app',
}

export const viewport: Viewport = {
  colorScheme: 'light',
  themeColor: '#F7F1E5',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`bg-background ${cormorant.variable} ${inter.variable} ${playfair.variable} ${kalam.variable} ${notoSerifBengali.variable} ${notoSansBengali.variable}`}
    >
      <body className="font-body antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
