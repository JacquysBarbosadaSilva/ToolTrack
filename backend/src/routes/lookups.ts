import { Router } from "express";
import { requireAuth } from "../middleware/auth";
import * as lookupsRepository from "../repositories/lookups.repository";

const router = Router();

router.get("/", requireAuth, async (_req, res, next) => {
  try {
    const lookups = await lookupsRepository.getAllLookups();
    return res.json(lookups);
  } catch (err) {
    return next(err);
  }
});

export default router;
