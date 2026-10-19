import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validateQuery } from "../middleware/validate";
import * as dashboardService from "../services/dashboard.service";

const router = Router();

const dashboardQuerySchema = z.object({
  setor: z.string().optional(),
  turno: z.string().optional(),
  categoria: z.string().optional(),
  data: z.string().optional(),
});

router.get("/", requireAuth, validateQuery(dashboardQuerySchema), async (req, res, next) => {
  try {
    const data = await dashboardService.getDashboard(req.query as any);
    return res.json(data);
  } catch (err) {
    return next(err);
  }
});

export default router;
