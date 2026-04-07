"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send, Sparkles, User } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault()
    const text = input.trim()
    if (!text || isLoading) return

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    setIsLoading(true)
    setError(null)

    const assistantId = crypto.randomUUID()
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }])

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Server xatosi")
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error("Stream o'qib bo'lmadi")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, content: m.content + chunk } : m
          )
        )
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Xatolik yuz berdi")
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setIsLoading(false)
    }
  }

  const suggestions = ["Kod yozishda yordam", "Tarjima qilish", "Tushuntirish berish"]

  return (
    <div className="flex flex-col h-[calc(100vh-180px)] max-w-3xl mx-auto rounded-2xl overflow-hidden border border-border/50 shadow-2xl bg-card">
      {/* Header */}
      <div className="flex items-center gap-3 px-6 py-4 border-b border-border/50 bg-linear-to-r from-violet-500/10 via-purple-500/5 to-transparent">
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-linear-to-br from-violet-500 to-purple-600 shadow-lg shadow-violet-500/25">
          <Sparkles className="h-5 w-5 text-white" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">AI Yordamchi</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs text-muted-foreground">Llama 3 · 8B</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
            <div className="w-20 h-20 rounded-2xl bg-linear-to-br from-violet-500/20 to-purple-600/20 flex items-center justify-center border border-violet-500/20">
              <Bot className="h-10 w-10 text-violet-500" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-semibold">Salom! Men AI yordamchiman</p>
              <p className="text-sm text-muted-foreground max-w-xs">
                Istalgan savol yoki mavzu bo&apos;yicha yordam bera olaman
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="text-xs px-3 py-1.5 rounded-full border border-border hover:border-violet-500/50 hover:bg-violet-500/5 text-muted-foreground hover:text-foreground transition-all"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 max-w-[85%]",
              message.role === "user" ? "ml-auto flex-row-reverse" : "mr-auto"
            )}
          >
            <div className={cn(
              "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 shadow-sm",
              message.role === "user"
                ? "bg-linear-to-br from-violet-500 to-purple-600"
                : "bg-muted border border-border"
            )}>
              {message.role === "user"
                ? <User className="h-4 w-4 text-white" />
                : <Bot className="h-4 w-4 text-muted-foreground" />
              }
            </div>
            <div className={cn(
              "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
              message.role === "user"
                ? "bg-linear-to-br from-violet-500 to-purple-600 text-white rounded-tr-sm"
                : "bg-muted text-foreground rounded-tl-sm border border-border/50"
            )}>
              {message.content || (
                <span className="flex gap-1 items-center h-5">
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:0ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:150ms]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground/50 animate-bounce [animation-delay:300ms]" />
                </span>
              )}
            </div>
          </div>
        ))}

        {error && (
          <div className="mx-auto max-w-sm p-3 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 text-sm text-center">
            {error}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-4 border-t border-border/50 bg-card/80">
        <form onSubmit={handleSubmit} className="flex gap-2 items-center">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Xabaringizni yozing..."
            disabled={isLoading}
            className="flex-1 rounded-xl border-border/60 bg-muted/50 focus-visible:ring-violet-500/50 h-11"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) handleSubmit()
            }}
          />
          <Button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="h-11 w-11 rounded-xl p-0 bg-linear-to-br from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-lg shadow-violet-500/25 transition-all disabled:opacity-50 disabled:shadow-none"
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        <p className="text-center text-xs text-muted-foreground/40 mt-2">Enter — yuborish</p>
      </div>
    </div>
  )
}
