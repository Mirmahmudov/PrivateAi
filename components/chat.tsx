"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Bot, Send, Square, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
}

const SUGGESTIONS = [
  "O'zbek tilida she'r yoz",
  "JavaScript async/await tushuntir",
  "Sog'lom ovqatlanish haqida maslahat ber",
  "Ingliz tilini o'rganishga yordam ber",
]

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Auto-resize textarea
  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    e.target.style.height = "auto"
    e.target.style.height = Math.min(e.target.scrollHeight, 160) + "px"
  }

  const stopGeneration = () => {
    abortRef.current?.abort()
    setIsLoading(false)
  }

  const handleSubmit = async (text?: string) => {
    const msg = (text ?? input).trim()
    if (!msg || isLoading) return

    const userMsg: Message = { id: crypto.randomUUID(), role: "user", content: msg }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setInput("")
    if (inputRef.current) {
      inputRef.current.style.height = "auto"
    }
    setIsLoading(true)
    setError(null)

    const assistantId = crypto.randomUUID()
    setMessages((prev) => [...prev, { id: assistantId, role: "assistant", content: "" }])

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          messages: updatedMessages.map(({ role, content }) => ({ role, content })),
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || "Server xatosi yuz berdi")
      }

      const reader = res.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error("Javobni o'qib bo'lmadi")

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value)
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: m.content + chunk } : m)
        )
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return
      setError(err instanceof Error ? err.message : "Noma'lum xatolik yuz berdi")
      setMessages((prev) => prev.filter((m) => m.id !== assistantId))
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto w-full">

      {/* Header */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-border/40">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <Zap className="h-4 w-4 text-primary" />
          </div>
          <div>
            <span className="font-semibold text-sm text-foreground">Private AI</span>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-muted-foreground">Llama 3.3 · 70B</span>
            </div>
          </div>
        </div>
        <span className="text-[11px] text-muted-foreground/50">by Asadbek Mirmahmudov</span>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-8 px-4 pb-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto">
                <Bot className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-foreground">Assalomu alaykum!</h1>
              <p className="text-muted-foreground text-sm max-w-sm">
                Men sizning shaxsiy AI yordamchingizman. Savol bering yoki quyidagilardan birini tanlang.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-2 w-full max-w-md">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => handleSubmit(s)}
                  className="text-left text-xs px-4 py-3 rounded-xl border border-border/60 bg-card hover:bg-muted hover:border-primary/40 text-muted-foreground hover:text-foreground transition-all duration-200"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="px-4 py-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex gap-3",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}
              >
                {/* Avatar */}
                <div className={cn(
                  "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted border border-border text-muted-foreground"
                )}>
                  {message.role === "user" ? "S" : <Bot className="h-3.5 w-3.5" />}
                </div>

                {/* Bubble */}
                <div className={cn(
                  "max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "user"
                    ? "bg-primary text-primary-foreground rounded-tr-sm"
                    : "bg-card border border-border/60 text-foreground rounded-tl-sm"
                )}>
                  {message.content ? (
                    <p className="whitespace-pre-wrap wrap-break-word">{message.content}</p>
                  ) : (
                    <span className="flex gap-1 items-center py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:0ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:150ms]" />
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-60 animate-bounce [animation-delay:300ms]" />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {error && (
              <div className="flex justify-center">
                <div className="px-4 py-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs max-w-sm text-center">
                  ⚠ {error}
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input area */}
      <div className="px-4 pb-6 pt-3 border-t border-border/40">
        <div className="relative flex items-end gap-2 bg-card border border-border/60 rounded-2xl px-4 py-3 focus-within:border-primary/50 transition-colors shadow-sm">
          <textarea
            ref={inputRef}
            value={input}
            onChange={handleInput}
            placeholder="Xabar yozing..."
            disabled={isLoading}
            rows={1}
            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 resize-none outline-none min-h-[24px] max-h-[160px] leading-6 disabled:opacity-50"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSubmit()
              }
            }}
          />
          {isLoading ? (
            <Button
              onClick={stopGeneration}
              size="icon"
              className="h-8 w-8 rounded-xl shrink-0 bg-muted hover:bg-muted/80 text-foreground border border-border"
            >
              <Square className="h-3.5 w-3.5 fill-current" />
            </Button>
          ) : (
            <Button
              onClick={() => handleSubmit()}
              disabled={!input.trim()}
              size="icon"
              className="h-8 w-8 rounded-xl shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
        <p className="text-center text-[11px] text-muted-foreground/30 mt-2">
          Enter — yuborish · Shift+Enter — yangi qator
        </p>
      </div>

    </div>
  )
}
