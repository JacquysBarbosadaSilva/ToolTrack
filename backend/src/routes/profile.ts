import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { AppError } from "../middleware/errorHandler";
import * as usersRepository from "../repositories/users.repository";
import type { UserRecord } from "../repositories/users.repository";

const router = Router();

const updateProfileSchema = z.object({
  nome: z.string().min(1).optional(),
  name: z.string().min(1).optional(),
  email: z.string().email("E-mail com formato inválido").optional(),
  cargo: z.string().optional(),
  localizacao: z.string().optional(),
  telefone: z.string().optional(),
  departamento: z.string().optional(),
  idFuncionario: z.string().optional(),
  password: z.string().min(6).optional(),
});

function formatProfile(user: UserRecord) {
  const safe = usersRepository.toSafeUser(user);
  return {
    ...safe,
    id: user.id,
    PK: `USER#${user.idFuncionario || user.id}`,
    nome: user.nome,
    name: user.nome,
    email: user.email,
    role: user.role,
    cargo: user.cargo || (user.role === "admin" ? "Admin" : user.role),
    localizacao: user.localizacao || "Setor Norte - Planta 4",
    telefone: user.telefone || "+55 11 99999-9999",
    departamento: user.departamento || "Operações de Chão de Fábrica",
    idFuncionario: user.idFuncionario || "EMP-8842-A",
    atualizadoEm: user.updatedAt
      ? new Date(user.updatedAt).toLocaleDateString("pt-BR")
      : new Date().toLocaleDateString("pt-BR"),
    updatedAt: user.updatedAt,
    user: safe,
  };
}

router.get("/", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, "UNAUTHORIZED", "Usuário não autenticado.");
    }

    const user = await usersRepository.findById(userId);
    if (!user || !user.ativo) {
      throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado ou inativo.");
    }

    return res.json(formatProfile(user));
  } catch (err) {
    return next(err);
  }
});

router.put("/", requireAuth, validateBody(updateProfileSchema), async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      throw new AppError(401, "UNAUTHORIZED", "Usuário não autenticado.");
    }

    const existing = await usersRepository.findById(userId);
    if (!existing || !existing.ativo) {
      throw new AppError(404, "USER_NOT_FOUND", "Usuário não encontrado.");
    }

    if (req.body.email) {
      const newEmail = req.body.email.toLowerCase().trim();
      if (newEmail !== existing.email.toLowerCase()) {
        const emailCheck = await usersRepository.findByEmail(newEmail);
        if (emailCheck && emailCheck.id !== userId) {
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
    return res.json(formatProfile(updated));
  } catch (err) {
    return next(err);
  }
});

export default router;
