import { NextResponse } from "next/server";
import { prisma } from "@rebuildyourlife/database";
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { chatbotId, visitorId, messages } = body;

    if (!chatbotId || !visitorId || !messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    // Retrieve chatbot config
    const chatbot = await prisma.chatbot.findUnique({
      where: { id: chatbotId },
    });

    if (!chatbot) {
      return NextResponse.json({ error: "Chatbot not found" }, { status: 404 });
    }

    // Format messages for Gemini (Gemini uses 'user' and 'model' instead of 'assistant')
    // systemInstruction is passed separately in config
    const formattedMessages = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Call Gemini API
    const aiResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: formattedMessages,
      config: {
        systemInstruction: chatbot.systemPrompt,
      }
    });

    const reply = aiResponse.text || "Sorry, ik kon geen antwoord genereren.";

    // Store in DB (ChatSession)
    // Find or create session
    let session = await prisma.chatSession.findFirst({
      where: { chatbotId, visitorId },
    });

    const fullHistory = [...messages, { role: 'assistant', content: reply }];

    if (session) {
      await prisma.chatSession.update({
        where: { id: session.id },
        data: { messages: fullHistory }
      });
    } else {
      await prisma.chatSession.create({
        data: {
          chatbotId,
          visitorId,
          messages: fullHistory
        }
      });
    }

    return NextResponse.json({ reply });
  } catch (error: any) {
    console.error("Chatbot Chat API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
