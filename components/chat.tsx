"use client"

import { useState } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { Bot, Send, User } from "lucide-react"
import { cn } from "@/lib/utils"

export function Chat() {
  const [input, setInput] = useState("")

  const { messages, sendMessage, status, error } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    sendMessage({ text: input })
    setInput("")
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-lg">
      <CardHeader className="border-b bg-muted/50">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Bot className="h-6 w-6 text-primary" />
          AI Chat Ilova
        </CardTitle>
      </CardHeader>

      <CardContent className="h-[500px] overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
            <Bot className="h-16 w-16 mb-4 opacity-50" />
            <p className="text-lg">Salom! Men AI yordamchiman.</p>
            <p className="text-sm">Savolingizni yozing va men javob beraman.</p>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={cn(
              "flex gap-3 p-3 rounded-lg",
              message.role === "user"
                ? "bg-primary/10 ml-8"
                : "bg-muted mr-8"
            )}
          >
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0",
                message.role === "user"
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground"
              )}
            >
              {message.role === "user" ? (
                <User className="h-4 w-4" />
              ) : (
                <Bot className="h-4 w-4" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium text-muted-foreground">
                {message.role === "user" ? "Siz" : "AI Yordamchi"}
              </p>
              <div className="text-sm leading-relaxed whitespace-pre-wrap">
                {message.parts.map((part, index) => {
                  if (part.type === "text") {
                    return <span key={index}>{part.text}</span>
                  }
                  return null
                })}
              </div>
            </div>
          </div>
        ))}

        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <div className="flex gap-3 p-3 rounded-lg bg-muted mr-8">
            <div className="h-8 w-8 rounded-full flex items-center justify-center flex-shrink-0 bg-secondary text-secondary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center gap-2">
              <Spinner className="h-4 w-4" />
              <span className="text-sm text-muted-foreground">Javob yozilmoqda...</span>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 text-destructive border border-destructive/20">
            <p className="font-medium">Xatolik yuz berdi</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
        )}
      </CardContent>

      <CardFooter className="border-t p-4">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Xabaringizni yozing..."
            disabled={isLoading}
            className="flex-1"
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            {isLoading ? (
              <Spinner className="h-4 w-4" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="ml-2 hidden sm:inline">Yuborish</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
