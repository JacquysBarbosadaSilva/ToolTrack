import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthUser {
  id: string;
  email: string;
  role: string;
  nome?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthUser;
    }
  }
}

const JWT_SECRET = process.env.JWT_SECRET || "tooltrack-secret-key-change-me";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Token de autenticação não fornecido.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    req.user = {
      id: (decoded.sub || decoded.id) as string,
      email: decoded.email as string,
      role: decoded.role as string,
      nome: decoded.nome as string,
    };
    return next();
  } catch (_err) {
    return res.status(401).json({
      code: "UNAUTHORIZED",
      message: "Token inválido ou expirado.",
    });
  }
}

export function requireRole(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        code: "UNAUTHORIZED",
        message: "Usuário não autenticado.",
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        code: "FORBIDDEN",
        message: "Acesso não autorizado para este perfil.",
      });
    }

    return next();
  };
}
