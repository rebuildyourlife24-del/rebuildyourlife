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
import franchiseRoutes from "./franchise.routes.js";
import adminRoutes from "./admin.routes.js";
import { trafficRoutes } from "./traffic.routes.js";
import { identityRoutes } from '../modules/identity/index.js';
import { billingRoutes } from '../modules/billing/index.js';
import { storageRoutes } from '../modules/storage/index.js';
import { knowledgeRoutes } from '../modules/knowledge/index.js';
import { eventBusRoutes } from '../modules/event-bus/index.js';
import { pluginRoutes } from '../modules/plugin/index.js';
import { workflowRoutes } from '../modules/workflow/index.js';
import { agentRegistryRoutes } from '../modules/agent-registry/index.js';
import { aiRuntimeRoutes } from '../modules/ai-runtime/index.js';
import { costIntelligenceRoutes } from '../modules/cost-intelligence/index.js';
import { ApiGateway } from '../gateway/gateway.middleware.js';
import { observabilityMiddleware } from '../middleware/observability.middleware.js';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ---------------------------------------------------------
// D1. OBSERVABILITY & CORRELATION ID
// ---------------------------------------------------------
router.use(observabilityMiddleware);

// ---------------------------------------------------------
// D0.2 CLOUD-GRADE API GATEWAY LAYER
// ---------------------------------------------------------
router.use(ApiGateway.authenticateEdge);
router.use(ApiGateway.shapeClientRequest);
router.use(ApiGateway.enforceRateLimit);

// ---------------------------------------------------------
// D1. HEALTH & METRICS ENDPOINTS
// ---------------------------------------------------------
router.get('/health/liveness', (req, res) => {
  res.status(200).json({ status: 'ALIVE', timestamp: new Date().toISOString() });
});

router.get('/health/readiness', async (req, res) => {
  try {
    // Check DB connection
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: 'READY', database: 'connected', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'NOT_READY', database: 'disconnected', error: String(error) });
  }
});

// Modular Monolith Routes
router.use('/identity', identityRoutes);
router.use('/billing', billingRoutes);
router.use('/storage', storageRoutes);
router.use('/knowledge', knowledgeRoutes);
router.use('/event-bus', eventBusRoutes);
router.use('/plugins', pluginRoutes);
router.use('/workflows', workflowRoutes);
router.use('/agents', agentRegistryRoutes);
router.use('/ai-runtime', aiRuntimeRoutes);
router.use('/cost-intelligence', costIntelligenceRoutes);
router.use("/budget", budgetRoutes);
router.use("/debt", debtRoutes);
router.use("/task", taskRoutes);
router.use("/ai", aiRoutes);
router.use("/program", programRoutes);
router.use("/health", healthRoutes);
router.use("/auth", authRoutes);
router.use("/user", userRoutes);
router.use("/goal", goalRoutes);
router.use("/life-areas", lifeAreaRoutes);
router.use("/notifications", notificationRoutes);
router.use("/webhooks", webhookRoutes);
router.use("/social", socialRoutes);
router.use("/business", businessRoutes);
router.use("/payments", paymentRoutes);
router.use('/orion', orionOpenAIRouter);
router.use("/franchise", franchiseRoutes);
router.use("/admin", adminRoutes);
router.use("/traffic", trafficRoutes);

export default router;
