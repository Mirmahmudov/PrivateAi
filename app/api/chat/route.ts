import Groq from "groq-sdk"
import { NextRequest } from "next/server"

export const runtime = "nodejs"
export const maxDuration = 30

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

export async function POST(req: NextRequest) {
  if (!process.env.GROQ_API_KEY) {
    return Response.json(
      { error: "GROQ_API_KEY topilmadi. Vercel dashboard > Settings > Environment Variables ga qo'shing." },
      { status: 500 }
    )
  }

  try {
    const { messages } = await req.json()

    if (!messages || messages.length === 0) {
      return Response.json({ error: "Xabar kiritilmagan" }, { status: 400 })
    }

    const stream = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "system",
          content: "Siz yordam beruvchi AI yordamchisiz. O'zbek va ingliz tillarida javob bera olasiz.",
        },
        ...messages,
      ],
      stream: true,
      max_tokens: 1024,
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content ?? ""
          if (text) {
            controller.enqueue(encoder.encode(text))
          }
        }
        controller.close()
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("Groq API xatosi:", error)
    return Response.json(
      { error: error instanceof Error ? error.message : "Noma'lum xatolik" },
      { status: 500 }
    )
  }
}
