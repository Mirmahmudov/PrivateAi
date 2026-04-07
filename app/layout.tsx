import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"

const geist = Geist({ subsets: ["latin"], variable: "--font-geist" })
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-geist-mono" })

export const metadata: Metadata = {
  title: "Private AI — Asadbek Mirmahmudov",
  description: "Shaxsiy sun'iy intellekt yordamchisi. Llama 3.3 70B modeli asosida ishlaydi.",
  authors: [{ name: "Asadbek Mirmahmudov" }],
  creator: "Asadbek Mirmahmudov",
  metadataBase: new URL("https://private-ai-kappa.vercel.app"),
  openGraph: {
    title: "Private AI",
    description: "Shaxsiy sun'iy intellekt yordamchisi",
    authors: ["Asadbek Mirmahmudov"],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className="dark">
      <body className={`${geist.variable} ${geistMono.variable} font-sans`}>
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  )
}
