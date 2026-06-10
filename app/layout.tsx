import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'

const notoJp = Noto_Sans_JP({
  variable: '--font-noto-jp',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
})

export const metadata: Metadata = {
  title: 'くま見張り番 — 梅田屋',
  description: 'カメラでくまを見張り、見つけたらすぐお知らせします。',
}

export const viewport = {
  themeColor: '#ffffff',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja" className={`${notoJp.variable} bg-background`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
