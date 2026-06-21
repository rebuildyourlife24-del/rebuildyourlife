import Groq from 'groq-sdk';

// Zorg dat GROQ_API_KEY in je .env staat
// Voor de snelste LLM inference via LPUs.
export const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export const GROQ_MODELS = {
  llama3_70b: "llama3-70b-8192",
  llama3_8b: "llama3-8b-8192",
  mixtral: "mixtral-8x7b-32768",
  gemma: "gemma-7b-it"
} as const;

export async function generateGroqResponse(
  prompt: string, 
  systemPrompt: string = "Je bent een onverbiddelijke God Mode AI assistent. Geef extreem directe en waardevolle antwoorden.",
  model: keyof typeof GROQ_MODELS = "llama3_70b"
) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: GROQ_MODELS[model],
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
    });
    
    return chatCompletion.choices[0]?.message?.content || "";
  } catch (error) {
    console.error("Groq API Error:", error);
    throw new Error("Er ging iets mis bij de verbinding met Groq.");
  }
}
