import type { Metadata } from 'next'
import { Bebas_Neue, Noto_Sans_JP, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const bebas = Bebas_Neue({
  variable: '--font-bebas',
  subsets: ['latin'],
  weight: '400',
})
const notoJp = Noto_Sans_JP({
  variable: '--font-noto-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})
const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'SENTINEL BEAR — 熊検知監視システム',
  description:
    'AI-powered bear detection monitoring system for Japanese municipalities and farming cooperatives.',
  generator: 'v0.app',
}

export const viewport = {
  themeColor: '#0a0805',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="ja"
      className={`${bebas.variable} ${notoJp.variable} ${jetbrains.variable} bg-background`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
