import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// POST /api/telegram/webhook - Receives incoming Telegram messages
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).send("No message provided");
    }

    const text = message.text || "";
    const chatId = message.chat?.id;

    console.log(`[Telegram Webhook] Received message from ${chatId}: ${text}`);
    
    // In a real scenario, we would route this text to the Sovereign AI Router (Hermes):
    // const hermesResponse = await hermesAgent.execute({ user_input: text, chat_id: chatId });
    // await telegramClient.sendMessage(chatId, hermesResponse.message);

    // For now, we simulate logging the webhook receipt
    res.status(200).send("OK");
  } catch (error) {
    console.error("[Telegram Webhook Error]", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
