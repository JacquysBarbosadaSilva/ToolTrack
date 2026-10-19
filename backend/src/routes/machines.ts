import { Router } from "express";
import {
  PutCommand,
  GetCommand,
  DeleteCommand,
  ScanCommand,
  type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { z } from "zod";
import { docClient } from "../config/aws";
import { TABLES } from "../db/tables";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { AppError } from "../middleware/errorHandler";

const router = Router();

const createMachineSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  status: z.string().min(1),
  producaoHora: z.string().optional(),
  eficienciaOEE: z.string().optional(),
  extraInfo: z.string().optional(),
  setor: z.string().optional(),
});

const updateMachineSchema = z.object({
  name: z.string().min(1).optional(),
  status: z.string().min(1).optional(),
  producaoHora: z.string().optional(),
  eficienciaOEE: z.string().optional(),
  extraInfo: z.string().optional(),
  setor: z.string().optional(),
});

// GET /api/machines
router.get("/", requireAuth, async (req, res, next) => {
  try {
    const { search, status } = req.query as { search?: string; status?: string };
    const items: Record<string, any>[] = [];
    let exclusiveStartKey: Record<string, any> | undefined = undefined;

    do {
      const scanInput: ScanCommandInput = {
        TableName: TABLES.machines,
        ExclusiveStartKey: exclusiveStartKey,
      };

      const result = await docClient.send(new ScanCommand(scanInput));
      if (result.Items) {
        items.push(...result.Items);
      }
      exclusiveStartKey = result.LastEvaluatedKey;
    } while (exclusiveStartKey);

    const filtered = items
      .filter((m) => {
        if (status && m.status !== status) return false;
        if (search && search.trim()) {
          const q = search.toLowerCase().trim();
          const matchName = (m.nome || m.name || "").toLowerCase().includes(q);
          const matchId = (m.id || "").toLowerCase().includes(q);
          if (!matchName && !matchId) return false;
        }
        return true;
      })
      .map((m) => ({
        id: m.id,
        name: m.nome || m.name || m.id,
        status: m.status === "ativa" ? "Operacional" : m.status === "inativa" ? "Parada" : m.status,
        producaoHora: m.producaoHora || (m.status === "inativa" ? "0 unid." : "1,240 unid."),
        eficienciaOEE: m.eficienciaOEE || (m.status === "inativa" ? "0%" : "94%"),
        extraInfo: m.extraInfo || `Atualizado: ${m.updatedAt ? new Date(m.updatedAt).toLocaleDateString("pt-BR") : "Hoje"}`,
        setor: m.setor,
      }));

    return res.json({ machines: filtered, items: filtered });
  } catch (err) {
    return next(err);
  }
});

// POST /api/machines
router.post("/", requireAuth, validateBody(createMachineSchema), async (req, res, next) => {
  try {
    const item = {
      ...req.body,
      nome: req.body.name,
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLES.machines,
        Item: item,
      })
    );

    return res.status(201).json({ machine: item, ...item });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/machines/:id
router.put("/:id", requireAuth, validateBody(updateMachineSchema), async (req, res, next) => {
  try {
    const { id } = req.params;

    const existingResult = await docClient.send(
      new GetCommand({
        TableName: TABLES.machines,
        Key: { id },
      })
    );

    if (!existingResult.Item) {
      throw new AppError(404, "MACHINE_NOT_FOUND", "Máquina não encontrada.");
    }

    const updatedItem = {
      ...existingResult.Item,
      ...req.body,
      nome: req.body.name !== undefined ? req.body.name : existingResult.Item.nome,
      updatedAt: new Date().toISOString(),
    };

    await docClient.send(
      new PutCommand({
        TableName: TABLES.machines,
        Item: updatedItem,
      })
    );

    return res.json({ machine: updatedItem, ...updatedItem });
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/machines/:id
router.delete("/:id", requireAuth, async (req, res, next) => {
  try {
    const { id } = req.params;

    await docClient.send(
      new DeleteCommand({
        TableName: TABLES.machines,
        Key: { id },
      })
    );

    return res.json({ ok: true, message: "Máquina removida com sucesso." });
  } catch (err) {
    return next(err);
  }
});

export default router;
