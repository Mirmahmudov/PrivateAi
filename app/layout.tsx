import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'
export const metadata: Metadata = {
  title: 'AI Chat Ilova',
  description: "Sun'iy intellekt yordamchisi bilan suhbatlash ilovasi - dasturlash, API integratsiya va xavfsizlik bilimlarini namoyish etish",
  authors: [{ name: 'Asadbek Mirmahmudov' }],
  creator: 'Asadbek Mirmahmudov',
  metadataBase: new URL('http://localhost:3000'),
  openGraph: {
    title: 'AI Chat Ilova',
    description: "Sun'iy intellekt yordamchisi bilan suhbatlash ilovasi",
    authors: ['Asadbek Mirmahmudov'],
  },

}

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
