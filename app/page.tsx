import { Chat } from "@/components/chat"

export default function Home() {
  return (
    <main className="min-h-screen bg-background px-4 py-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <header className="text-center space-y-1 pt-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-500 text-xs font-medium mb-3">
            ✦ Llama 3.3 · 70B
          </div>
          <h1 className="text-4xl font-bold tracking-tight bg-linear-to-r from-violet-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            AI Chat
          </h1>
          <p className="text-muted-foreground text-sm">
            Sun&apos;iy intellekt yordamchisi bilan suhbatlashing
          </p>
        </header>

        <Chat />

        <footer className="text-center text-xs text-muted-foreground/50 pb-2">
          © 2026 Barcha huquqlar himoyalangan &quot;MA&quot;
        </footer>
      </div>
    </main>
  )
}
