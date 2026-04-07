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

        <footer className="text-center text-sm text-muted-foreground">
          <p>© 2026 Barcha huquqlar himoyalangan &quot;MA&quot;</p>
        </footer>
      </div>
    </main>
  )
}
