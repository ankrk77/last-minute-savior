import type { Metadata, Viewport } from 'next'
import { Inter, DM_Sans } from 'next/font/google'

import './globals.css'

const _inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
})

const _dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'Last-Minute Savior — Focus on What Matters Before Exams',
  description:
    'A calm, student-friendly study planner that helps you prioritize what to study when time is running out.',
}

export const viewport: Viewport = {
  themeColor: '#0ea5e9',
  width: 'device-width',
  initialScale: 1,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${_inter.variable} ${_dmSans.variable}`}>
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
