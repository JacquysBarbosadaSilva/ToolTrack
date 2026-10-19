import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { validateBody } from "../middleware/validate";
import { requireAuth } from "../middleware/auth";
import * as usersRepository from "../repositories/users.repository";

const router = Router();

const loginSchema = z.object({
  email: z.string().email("E-mail com formato inválido"),
  password: z.string().min(1, "A senha é obrigatória"),
});

router.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await usersRepository.findByEmail(email);

    if (!user || !user.ativo) {
      return res.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "E-mail ou senha incorretos.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({
        code: "INVALID_CREDENTIALS",
        message: "E-mail ou senha incorretos.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET || "tooltrack-secret-key-change-me";
    const expiresIn = (process.env.JWT_EXPIRES_IN || "8h") as jwt.SignOptions["expiresIn"];

    const token = jwt.sign(
      {
        sub: user.id,
        id: user.id,
        email: user.email,
        role: user.role,
        nome: user.nome,
      },
      jwtSecret,
      { expiresIn }
    );

    const safeUser = usersRepository.toSafeUser(user);

    return res.json({
      token,
      user: safeUser,
    });
  } catch (err) {
    return next(err);
  }
});

router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado.",
      });
    }

    const user = await usersRepository.findSafeById(userId);
    if (!user || !user.ativo) {
      return res.status(404).json({
        code: "USER_NOT_FOUND",
        message: "Usuário não encontrado ou inativo.",
      });
    }

    return res.json({
      user,
      ...user,
    });
  } catch (err) {
    return next(err);
  }
});

export default router;
