import { Router } from "express";
import { randomUUID } from "node:crypto";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import * as productionRepository from "../repositories/production.repository";
import type { ProductionEntry } from "../repositories/production.repository";

const router = Router();

const queryProductionSchema = z.object({
  turno: z.enum(["Manhã", "Tarde", "Noite"]).optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD").optional(),
  dataInicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data início deve estar no formato YYYY-MM-DD").optional(),
  dataFim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data fim deve estar no formato YYYY-MM-DD").optional(),
});

const createProductionSchema = z.object({
  turno: z.enum(["Manhã", "Tarde", "Noite"], {
    errorMap: () => ({ message: "Turno deve ser Manhã, Tarde ou Noite" }),
  }),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Data deve estar no formato YYYY-MM-DD"),
  quantidade: z.number().min(0, "Quantidade deve ser maior ou igual a zero"),
  setor: z.string().min(1, "Setor é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  maquinaId: z.string().optional(),
});

router.get("/", requireAuth, validateQuery(queryProductionSchema), async (req, res, next) => {
  try {
    const { turno, data, dataInicio, dataFim } = req.query as {
      turno?: "Manhã" | "Tarde" | "Noite";
      data?: string;
      dataInicio?: string;
      dataFim?: string;
    };

    let items: ProductionEntry[] = [];

    if (turno) {

      items = await productionRepository.queryByTurno(turno, { data, dataInicio, dataFim });
    } else if (data) {

      items = await productionRepository.queryByDate(data);
    } else {

      const today = new Date().toISOString().slice(0, 10);
      items = await productionRepository.queryByDate(today);
      if (items.length === 0) {
        items = await productionRepository.scanAllProduction();
      }
    }

    return res.json({
      items,
      total: items.length,
    });
  } catch (err) {
    return next(err);
  }
});

router.post("/", requireAuth, validateBody(createProductionSchema), async (req, res, next) => {
  try {
    const { turno, data, quantidade, setor, categoria, maquinaId } = req.body;
    const id = randomUUID();
    const dataId = `${data}#${id}`;
    const createdAt = new Date().toISOString();

    const entry: ProductionEntry = {
      id,
      turno,
      data,
      dataId,
      setor: setor.trim(),
      categoria: categoria.trim(),
      quantidade,
      maquinaId: maquinaId ? maquinaId.trim() : undefined,
      createdAt,
    };

    const created = await productionRepository.create(entry);
    return res.status(201).json({ production: created, ...created });
  } catch (err) {
    return next(err);
  }
});

export default router;
