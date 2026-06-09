import { Router } from "express";
import { z } from "zod";
import { authenticate } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import * as lifeAreaService from "../services/life-area.service.js";

const router = Router();

router.use(authenticate);

router.get("/", async (req, res, next) => {
  try {
    const areas = await lifeAreaService.getUserLifeAreas(req.user!.userId);
    res.json({ status: "success", data: areas });
  } catch (error) {
    next(error);
  }
});

const updateScoreSchema = z.object({
  score: z.number().int().min(0).max(100),
});

router.patch("/:id/score", validate({ body: updateScoreSchema }), async (req, res, next) => {
  try {
    const area = await lifeAreaService.updateLifeAreaScore(
      req.user!.userId,
      req.params.id,
      req.body.score
    );
    res.json({ status: "success", data: area });
  } catch (error) {
    next(error);
  }
});

export default router;
