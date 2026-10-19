import { Router } from "express";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validateBody, validateQuery } from "../middleware/validate";
import * as productsService from "../services/products.service";

const router = Router();

const listQuerySchema = z.object({
  setor: z.string().optional(),
  turno: z.string().optional(),
  categoria: z.string().optional(),
  status: z.enum(["Normal", "Baixo", "Crítico"]).optional(),
  search: z.string().optional(),
  limit: z.coerce.number().min(1).max(100).optional(),
  cursor: z.string().optional(),
});

const createProductSchema = z.object({
  sku: z.string().min(1, "SKU é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  categoria: z.string().min(1, "Categoria é obrigatória"),
  turno: z.string().min(1, "Turno é obrigatório"),
  setor: z.string().min(1, "Setor é obrigatório"),
  quantidade: z.number().min(0, "Quantidade deve ser maior ou igual a zero"),
  estoqueMinimo: z.number().min(0, "Estoque mínimo deve ser maior ou igual a zero"),
  unidade: z.string().optional(),
  dataCadastro: z.string().optional(),
});

const updateProductSchema = z.object({
  nome: z.string().min(1).optional(),
  categoria: z.string().min(1).optional(),
  turno: z.string().min(1).optional(),
  setor: z.string().min(1).optional(),
  quantidade: z.number().min(0).optional(),
  estoqueMinimo: z.number().min(0).optional(),
  unidade: z.string().optional(),
  dataCadastro: z.string().optional(),
});

// GET /api/products (com paginação e filtros)
router.get("/", requireAuth, validateQuery(listQuerySchema), async (req, res, next) => {
  try {
    const result = await productsService.listProducts(req.query as any);
    return res.json(result);
  } catch (err) {
    return next(err);
  }
});

// GET /api/products/:sku
router.get("/:sku", requireAuth, async (req, res, next) => {
  try {
    const product = await productsService.getProductBySku(req.params.sku);
    return res.json({ product, ...product });
  } catch (err) {
    return next(err);
  }
});

// POST /api/products
router.post("/", requireAuth, validateBody(createProductSchema), async (req, res, next) => {
  try {
    const product = await productsService.createProduct(req.body);
    return res.status(201).json({ product, ...product });
  } catch (err) {
    return next(err);
  }
});

// PUT /api/products/:sku
router.put("/:sku", requireAuth, validateBody(updateProductSchema), async (req, res, next) => {
  try {
    const product = await productsService.updateProduct(req.params.sku, req.body);
    return res.json({ product, ...product });
  } catch (err) {
    return next(err);
  }
});

// DELETE /api/products/:sku
router.delete("/:sku", requireAuth, async (req, res, next) => {
  try {
    await productsService.deleteProduct(req.params.sku);
    return res.json({ ok: true, message: "Produto removido com sucesso." });
  } catch (err) {
    return next(err);
  }
});

export default router;
