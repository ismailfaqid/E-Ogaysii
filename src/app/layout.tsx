import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import { Providers } from '@/components/Providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'E-Ogaysii | WhatsApp Notifications Made Simple',
  description: 'Ku Ogaysii Macaamiishaada WhatsApp | WhatsApp Notifications Made Simple',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <Providers>
          <Navigation />
          <main className="container animate-fade-in">{children}</main>
        </Providers>
      </body>
    </html>
  )
}
