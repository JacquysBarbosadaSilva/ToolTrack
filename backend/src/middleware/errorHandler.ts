import type { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

export class AppError extends Error {
  constructor(
    public statusCode: number,
    public code: string,
    message: string
  ) {
    super(message);
    this.name = "AppError";
  }
}

const AWS_AUTH_ERRORS = new Set([
  "ExpiredTokenException",
  "ExpiredToken",
  "UnrecognizedClientException",
  "InvalidSignatureException",
  "InvalidClientTokenId",
  "AccessDeniedException",
]);

export function errorHandler(
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  const errName = err?.name || err?.Code || err?.__type || "";

  // 1. Mapeamento de credenciais AWS Academy expiradas ou inválidas -> 503
  if (AWS_AUTH_ERRORS.has(errName)) {
    return res.status(503).json({
      code: "AWS_CREDENTIALS_EXPIRED",
      message:
        "Credenciais da AWS expiradas. Atualize o backend/.env e reinicie o servidor.",
    });
  }

  // 2. Erros de validação do Zod -> 400
  if (err instanceof ZodError) {
    const message =
      err.errors
        .map((e) => `${e.path.length ? e.path.join(".") + ": " : ""}${e.message}`)
        .join("; ") || "Dados de entrada inválidos.";

    return res.status(400).json({
      code: "VALIDATION_ERROR",
      message,
    });
  }

  // 3. Erros controlados da aplicação (AppError)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      code: err.code,
      message: err.message,
    });
  }

  // 4. Demais erros internos
  console.error("[ErrorHandler]", err);
  const status = typeof err.statusCode === "number" ? err.statusCode : 500;
  return res.status(status).json({
    code: err.code || "INTERNAL_SERVER_ERROR",
    message: err.message || "Erro interno do servidor.",
  });
}
