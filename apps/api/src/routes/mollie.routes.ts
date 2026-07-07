import { Router } from "express";
import type { Request, Response } from "express";

const router = Router();

// POST /api/mollie/webhook - Receives Mollie payment status updates
router.post("/webhook", async (req: Request, res: Response) => {
  try {
    const secretToken = req.query.token;
    if (secretToken !== process.env.MOLLIE_WEBHOOK_SECRET) {
      return res.status(401).send("Unauthorized");
    }

    const { id: paymentId } = req.body;
    
    if (!paymentId) {
      return res.status(400).send("No payment ID provided");
    }

    console.log(`[Mollie Webhook] Received update for payment ${paymentId}`);
    
    // In a real scenario, we would use the Mollie SDK to fetch the payment status:
    // const payment = await mollieClient.payments.get(paymentId);
    // if (payment.isPaid()) {
    //   await prisma.transaction.update({ ... })
    // }

    // For now, we simulate logging the webhook receipt
    res.status(200).send("OK");
  } catch (error) {
    console.error("[Mollie Webhook Error]", error);
    res.status(500).send("Internal Server Error");
  }
});

export default router;
