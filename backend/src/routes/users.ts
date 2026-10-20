import { Router } from "express";
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireAuth, requireRole } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { AppError } from "../middleware/errorHandler";
import * as usersRepository from "../repositories/users.repository";
import type { UserRecord } from "../repositories/users.repository";

const router = Router();

const createUserSchema = z.object({
  nome: z.string().min(1, "Nome é obrigatório").optional(),
  name: z.string().min(1, "Nome é obrigatório").optional(),
  email: z.string().email("E-mail com formato inválido"),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
  role: z.string().default("USER"),
  ativo: z.boolean().optional().default(true),
  cargo: z.string().optional(),
  localizacao: z.string().optional(),
  telefone: z.string().optional(),
  departamento: z.string().optional(),
  idFuncionario: z.string().optional(),
});

const updateUserSchema = z.object({
  nome: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  email: z.string().email("E-mail com formato inválido").optional(),
  password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional(),
  role: z.string().optional(),
  ativo: z.boolean().optional(),
  cargo: z.string().optional(),
  localizacao: z.string().optional(),
  telefone: z.string().optional(),
  departamento: z.string().optional(),
  idFuncionario: z.string().optional(),
});

router.get("/", requireAuth, requireRole("admin", "ADMIN"), async (_req, res, next) => {
  try {
    const users = await usersRepository.listAll();
    return res.json({ users, items: users });
  } catch (err) {
    return next(err);
  }
});

router.post(
  "/",
  requireAuth,
  requireRole("admin", "ADMIN"),
  validateBody(createUserSchema),
  async (req, res, next) => {
    try {
      const email = req.body.email.toLowerCase().trim();
      const existing = await usersRepository.findByEmail(email);

      if (existing) {
        throw new AppError(
          409,
          "EMAIL_ALREADY_EXISTS",
          "Já existe um usuário cadastrado com este e-mail."
        );
      }

      const nome = req.body.nome || req.body.name || "Usuário";
      const passwordHash = await bcrypt.hash(req.body.password, 10);
      const now = new Date().toISOString();
      const id = randomUUID();

      const newUser: UserRecord = {
        id,
        nome: nome.trim(),
        email,
        passwordHash,
        role: req.body.role || "USER",
        ativo: req.body.ativo !== false,
        cargo: req.body.cargo,
        localizacao: req.body.localizacao,
        telefone: req.body.telefone,
        departamento: req.body.departamento,
        idFuncionario: req.body.idFuncionario || id.slice(0, 8).toUpperCase(),
        createdAt: now,
        updatedAt: now,
      };

      await usersRepository.create(newUser);
      const safe = usersRepository.toSafeUser(newUser);
      return res.status(201).json({ user: safe, ...safe });
    } catch (err) {
      return next(err);
    }
  }
);

router.put(
  "/:id",
  requireAuth,
  requireRole("admin", "ADMIN"),
  validateBody(updateUserSchema),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const existing = await usersRepository.findById(id);

      if (!existing) {
        throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");
      }

      if (req.body.email) {
        const newEmail = req.body.email.toLowerCase().trim();
        if (newEmail !== existing.email.toLowerCase()) {
          const emailCheck = await usersRepository.findByEmail(newEmail);
          if (emailCheck && emailCheck.id !== id) {
            throw new AppError(
              409,
              "EMAIL_ALREADY_EXISTS",
              "Já existe outro usuário cadastrado com este e-mail."
            );
          }
        }
      }

      let passwordHash = existing.passwordHash;
      if (req.body.password) {
        passwordHash = await bcrypt.hash(req.body.password, 10);
      }

      const updated: UserRecord = {
        ...existing,
        nome: req.body.nome || req.body.name || existing.nome,
        email: req.body.email ? req.body.email.toLowerCase().trim() : existing.email,
        passwordHash,
        role: req.body.role !== undefined ? req.body.role : existing.role,
        ativo: req.body.ativo !== undefined ? req.body.ativo : existing.ativo,
        cargo: req.body.cargo !== undefined ? req.body.cargo : existing.cargo,
        localizacao: req.body.localizacao !== undefined ? req.body.localizacao : existing.localizacao,
        telefone: req.body.telefone !== undefined ? req.body.telefone : existing.telefone,
        departamento:
          req.body.departamento !== undefined ? req.body.departamento : existing.departamento,
        idFuncionario:
          req.body.idFuncionario !== undefined ? req.body.idFuncionario : existing.idFuncionario,
        updatedAt: new Date().toISOString(),
      };

      await usersRepository.update(updated);
      const safe = usersRepository.toSafeUser(updated);
      return res.json({ user: safe, ...safe });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete("/:id", requireAuth, requireRole("admin", "ADMIN"), async (req, res, next) => {
  try {
    const { id } = req.params;

    if (req.user?.id === id) {
      throw new AppError(
        400,
        "CANNOT_DELETE_SELF",
        "Você não pode excluir sua própria conta de administrador."
      );
    }

    try {
      await usersRepository.deleteById(id);
    } catch (err: any) {
      if (err?.name === "ConditionalCheckFailedException") {
        throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");
      }
      throw err;
    }

    return res.json({ ok: true, message: "Usuário removido com sucesso." });
  } catch (err) {
    return next(err);
  }
});

export default router;
