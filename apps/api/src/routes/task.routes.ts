import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { TaskStatus, TaskPriority, AgentType } from "@rebuildyourlife/shared";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as taskService from "../services/task.service.js";

const router = Router();

const createTaskSchema = z.object({
  title: z.string().min(1, "Titel is verplicht.").max(255),
  description: z.string().max(5000).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime().optional(),
  goalId: z.string().uuid().optional(),
  assignedAgentType: z.nativeEnum(AgentType).optional(),
});

const updateTaskSchema = z.object({
  title: z.string().min(1).max(255).optional(),
  description: z.string().max(5000).optional(),
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  dueDate: z.string().datetime().nullable().optional(),
  assignedAgentType: z.nativeEnum(AgentType).nullable().optional(),
});

const querySchema = z.object({
  status: z.nativeEnum(TaskStatus).optional(),
  priority: z.nativeEnum(TaskPriority).optional(),
  goalId: z.string().uuid().optional(),
  assignedAgentType: z.nativeEnum(AgentType).optional(),
  page: z.coerce.number().int().positive().optional(),
  pageSize: z.coerce.number().int().positive().max(100).optional(),
});

const taskIdParams = z.object({
  id: z.string().uuid("Ongeldig taak-ID."),
});

const assignAgentSchema = z.object({
  agentType: z.nativeEnum(AgentType, {
    errorMap: () => ({ message: "Ongeldig agent type." }),
  }),
});

// GET / – List tasks with filters
router.get(
  "/",
  authenticate,
  validate({ query: querySchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await taskService.getTasks(req.user!.userId, req.query as any);
      res.json(result);
    } catch (error) {
      next(error);
    }
  },
);

// GET /:id – Single task
router.get(
  "/:id",
  authenticate,
  validate({ params: taskIdParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.getTaskById(req.user!.userId, req.params.id);
      res.json(task);
    } catch (error) {
      next(error);
    }
  },
);

// POST / – Create task
router.post(
  "/",
  authenticate,
  validate({ body: createTaskSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.createTask(req.user!.userId, req.body);
      res.status(201).json(task);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /:id – Update task
router.patch(
  "/:id",
  authenticate,
  validate({ params: taskIdParams, body: updateTaskSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.updateTask(
        req.user!.userId,
        req.params.id,
        req.body,
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /:id – Delete task
router.delete(
  "/:id",
  authenticate,
  validate({ params: taskIdParams }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await taskService.deleteTask(req.user!.userId, req.params.id);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  },
);

// POST /:id/assign – Assign task to AI agent
router.post(
  "/:id/assign",
  authenticate,
  validate({ params: taskIdParams, body: assignAgentSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const task = await taskService.assignToAgent(
        req.user!.userId,
        req.params.id,
        req.body.agentType,
      );
      res.json(task);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
