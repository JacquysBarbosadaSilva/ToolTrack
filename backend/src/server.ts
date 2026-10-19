import "dotenv/config";
import express from "express";
import cors from "cors";
import { assertAwsConnection } from "./config/aws";
import { errorHandler } from "./middleware/errorHandler";
import authRoutes from "./routes/auth";
import lookupsRoutes from "./routes/lookups";
import productsRoutes from "./routes/products";
import dashboardRoutes from "./routes/dashboard";
import productionRoutes from "./routes/production";
import usersRoutes from "./routes/users";
import profileRoutes from "./routes/profile";
import exportRoutes from "./routes/export";
import machinesRoutes from "./routes/machines";

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

// Middlewares globais
app.use(
  cors({
    origin: [frontendUrl, "http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true,
  })
);
app.use(express.json());

// Rota de saúde (healthcheck)
app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/auth", authRoutes);

app.use("/api/lookups", lookupsRoutes);
app.use("/lookups", lookupsRoutes);

app.use("/api/products", productsRoutes);
app.use("/products", productsRoutes);

app.use("/api/dashboard", dashboardRoutes);
app.use("/dashboard", dashboardRoutes);

app.use("/api/production", productionRoutes);
app.use("/production", productionRoutes);

app.use("/api/users", usersRoutes);
app.use("/users", usersRoutes);

app.use("/api/profile", profileRoutes);
app.use("/profile", profileRoutes);

app.use("/api/export", exportRoutes);
app.use("/export", exportRoutes);

app.use("/api/machines", machinesRoutes);
app.use("/machines", machinesRoutes);

// Rota 404 para endpoints não encontrados
app.use((_req, res) => {
  res.status(404).json({
    code: "NOT_FOUND",
    message: "Endpoint não encontrado.",
  });
});

// Middleware centralizado de tratamento de erros
app.use(errorHandler);

// Inicialização com validação obrigatória da AWS
async function start() {
  try {
    console.log("Validando conexão com AWS DynamoDB...");
    await assertAwsConnection();
    console.log("Conexão com DynamoDB validada com sucesso!");

    app.listen(PORT, () => {
      console.log(`ToolTrack API iniciada em http://localhost:${PORT}`);
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("==================================================");
    console.error("ERRO CRÍTICO AO INICIAR O SERVIDOR:");
    console.error(message);
    console.error("==================================================");
    process.exit(1);
  }
}

start();
