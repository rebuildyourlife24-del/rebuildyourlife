import { Router } from 'express';
import { BillingController } from './billing.controller.js';

const router = Router();

// /api/v1/billing/wallets/credit
router.post('/wallets/credit', BillingController.creditWallet);

export default router;
