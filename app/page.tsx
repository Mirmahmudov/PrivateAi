import { Chat } from "@/components/chat"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-background to-muted/30 py-8 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">AI Chat Ilova</h1>
          <p className="text-muted-foreground text-balance">
            Sun&apos;iy intellekt yordamchisi bilan suhbatlashing
          </p>
        </header>

        <Chat />

        <footer className="text-center text-sm text-muted-foreground space-y-2">
          <div className="flex flex-wrap justify-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span>API integratsiya</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              <span>Environment variables</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              <span>Xatolik boshqaruvi</span>
            </div>
          </div>
          <p>Dasturlash, API integratsiya va xavfsizlik bilimlarini namoyish etish uchun yaratilgan</p>
        </footer>
      </div>
    </main>
  )
}
