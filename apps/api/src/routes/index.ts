import { Router } from "express";
import authRoutes from "./auth.routes.js";
import healthRoutes from "./health.routes.js";
import userRoutes from "./user.routes.js";
import goalRoutes from "./goal.routes.js";
import budgetRoutes from "./budget.routes.js";
import debtRoutes from "./debt.routes.js";
import taskRoutes from "./task.routes.js";
import aiRoutes from "./ai.routes.js";
import programRoutes from "./program.routes.js";
import lifeAreaRoutes from "./life-area.routes.js";
import notificationRoutes from "./notification.routes.js";
import webhookRoutes from "./webhook.routes.js";
import socialRoutes from "./social.routes.js";
import businessRoutes from "./business.routes.js";
import { paymentRoutes } from "./payment.routes.js";
import orionOpenAIRouter from './orion-openai.js';

const router = Router();

router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/goal", goalRoutes);
router.use("/budget", budgetRoutes);
router.use("/debt", debtRoutes);
router.use("/task", taskRoutes);
router.use("/ai", aiRoutes);
router.use("/program", programRoutes);
router.use("/life-areas", lifeAreaRoutes);
router.use("/notifications", notificationRoutes);
router.use("/webhooks", webhookRoutes);
router.use("/social", socialRoutes);
router.use("/business", businessRoutes);
router.use("/payments", paymentRoutes);
router.use('/orion', orionOpenAIRouter);

export default router;
