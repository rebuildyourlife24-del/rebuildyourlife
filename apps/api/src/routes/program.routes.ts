import { Router } from "express";
import { authenticate } from "../middleware/auth.js";
import * as programService from "../services/program.service.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const programs = await programService.getUserPrograms(req.user!.userId);
    res.json({ status: "success", data: programs });
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req, res, next) => {
  try {
    const program = await programService.createProgram(req.user!.userId, req.body);
    res.status(201).json({ status: "success", data: program });
  } catch (error) {
    next(error);
  }
});

router.patch("/:programId/milestones/:milestoneId/complete", async (req, res, next) => {
  try {
    const program = await programService.completeMilestone(req.user!.userId, req.params.programId, req.params.milestoneId);
    res.json({ status: "success", data: program });
  } catch (error) {
    next(error);
  }
});

export default router;
