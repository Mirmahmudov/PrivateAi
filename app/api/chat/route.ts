import {
  convertToModelMessages,
  streamText,
  UIMessage,
} from "ai"
import { createGroq } from "@ai-sdk/groq"

export const maxDuration = 30

// Warn at module load time so it shows up in deployment logs immediately
if (!process.env.GROQ_API_KEY) {
  console.warn("[WARNING] GROQ_API_KEY is not set. Set it in your hosting platform's environment variables.")
}

export async function POST(req: Request) {
  try {
    // API kalitini tekshirish (xavfsizlik)
    if (!process.env.GROQ_API_KEY) {
      return new Response(
        JSON.stringify({
          error: "API kalit topilmadi. Iltimos, GROQ_API_KEY ni environment variables ga qo'shing. Bepul kalit olish: https://console.groq.com/keys",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // Groq providerini yaratish
    const groq = createGroq({
      apiKey: process.env.GROQ_API_KEY,
    })

    // Foydalanuvchi xabarini qabul qilish
    const { messages }: { messages: UIMessage[] } = await req.json()

    // Xabarlarni tekshirish
    if (!messages || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Xabar kiritilmagan" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      )
    }

    // LLM API'ga yuborish va javobni qaytarish (Groq - bepul va tez)
    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: "Siz yordam beruvchi sun'iy intellekt yordamchisisiz. Har doim o'zbek va ingliz tillarida javob berishingiz mumkin. Foydalanuvchilarga do'stona va foydali javoblar bering.",
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    })

    return result.toUIMessageStreamResponse({
      originalMessages: messages,
    })
  } catch (error) {
    // Xatoliklarni ushlash
    console.error("API xatosi:", error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Noma'lum xatolik yuz berdi",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    )
  }
}
