/**
 * Popula o banco.
 *   npm run seed          -> admin + lookups (setores, categorias, turnos)  [mínimo para o sistema funcionar]
 *   npm run seed -- --demo -> também produtos, produção, máquinas, manutenção e snapshots de exemplo
 * Idempotente para admin e lookups (não duplica). Os dados demo só são inseridos se a tabela estiver vazia.
 */
import { randomUUID } from "node:crypto";
import bcrypt from "bcryptjs";
import { PutCommand, QueryCommand, ScanCommand, BatchWriteCommand } from "@aws-sdk/lib-dynamodb";
import { assertAwsConnection, docClient } from "../config/aws";
import { TABLES } from "../db/tables";

const DEMO = process.argv.includes("--demo");

const SETORES = ["Usinagem", "Acabamento", "Montagem"];
const CATEGORIAS = ["Torneamento", "Fresamento", "Furação", "Rosqueamento", "Canal e Corte"];
const TURNOS = ["Manhã", "Tarde", "Noite"];

const isoDay = (offsetDays = 0) => {
  const d = new Date();
  d.setDate(d.getDate() + offsetDays);
  return d.toISOString().slice(0, 10);
};

function calcStatus(qtd: number, min: number): "Normal" | "Baixo" | "Crítico" {
  if (qtd <= min * 0.25) return "Crítico";
  if (qtd < min) return "Baixo";
  return "Normal";
}

async function isEmpty(table: string) {
  const r = await docClient.send(new ScanCommand({ TableName: table, Limit: 1 }));
  return (r.Items?.length ?? 0) === 0;
}

async function batchPut(table: string, items: Record<string, unknown>[]) {
  for (let i = 0; i < items.length; i += 25) {
    await docClient.send(
      new BatchWriteCommand({
        RequestItems: { [table]: items.slice(i, i + 25).map((Item) => ({ PutRequest: { Item } })) },
      })
    );
  }
}

async function seedAdmin() {
  const email = (process.env.SEED_ADMIN_EMAIL ?? "admin@email.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD;
  if (!password || password.startsWith("troque")) {
    throw new Error("Defina SEED_ADMIN_PASSWORD em backend/.env (não use o valor de exemplo).");
  }
  const found = await docClient.send(
    new QueryCommand({
      TableName: TABLES.users,
      IndexName: "email-index",
      KeyConditionExpression: "email = :e",
      ExpressionAttributeValues: { ":e": email },
      Limit: 1,
    })
  );
  if (found.Items?.length) return console.log(`= admin ${email} já existe`);

  const now = new Date().toISOString();
  await docClient.send(
    new PutCommand({
      TableName: TABLES.users,
      Item: {
        id: randomUUID(),
        nome: "Admin",
        email,
        passwordHash: await bcrypt.hash(password, 10),
        role: "admin",
        ativo: true,
        createdAt: now,
        updatedAt: now,
      },
    })
  );
  console.log(`+ admin ${email} criado`);
}

async function seedLookups() {
  const rows = [
    ...SETORES.map((valor, ordem) => ({ tipo: "SETOR", valor, ordem, ativo: true })),
    ...CATEGORIAS.map((valor, ordem) => ({ tipo: "CATEGORIA", valor, ordem, ativo: true })),
    ...TURNOS.map((valor, ordem) => ({ tipo: "TURNO", valor, ordem, ativo: true })),
  ];
  await batchPut(TABLES.lookups, rows); // PutRequest é upsert: idempotente
  console.log(`+ lookups gravados (${rows.length})`);
}

async function seedDemo() {
  const now = new Date().toISOString();

  if (await isEmpty(TABLES.products)) {
    const base = [
      ["ABC-001", "Torneamento", "Manhã", "Usinagem", 5368, 1000, "2026-02-08"],
      ["DEF-002", "Fresamento", "Tarde", "Usinagem", 768, 1000, "2026-02-18"],
      ["GHI-003", "Fresamento", "Noite", "Acabamento", 39, 200, "2026-02-28"],
      ["JKL-004", "Furação", "Manhã", "Usinagem", 1450, 500, "2026-03-04"],
      ["MNO-005", "Rosqueamento", "Tarde", "Montagem", 85, 300, "2026-03-09"],
      ["PQR-006", "Canal e Corte", "Noite", "Acabamento", 920, 400, "2026-03-15"],
    ] as const;
    await batchPut(
      TABLES.products,
      base.map(([sku, categoria, turno, setor, quantidade, estoqueMinimo, dataCadastro]) => ({
        sku,
        nome: `${categoria} ${sku}`,
        categoria,
        turno,
        setor,
        quantidade,
        estoqueMinimo,
        status: calcStatus(quantidade, estoqueMinimo),
        dataCadastro,
        createdAt: now,
        updatedAt: now,
      }))
    );
    console.log(`+ produtos demo (${base.length})`);
  }

  if (await isEmpty(TABLES.machines)) {
    const machines = Array.from({ length: 135 }, (_, i) => ({
      id: `MAQ-${String(i + 1).padStart(3, "0")}`,
      nome: `Máquina ${i + 1}`,
      setor: SETORES[i % SETORES.length],
      status: i < 128 ? "ativa" : "inativa",
      updatedAt: now,
    }));
    await batchPut(TABLES.machines, machines);
    console.log("+ máquinas demo (135, 128 ativas)");
  }

  if (await isEmpty(TABLES.maintenance)) {
    const tasks = Array.from({ length: 12 }, (_, i) => ({
      id: randomUUID(),
      titulo: `Manutenção preventiva ${i + 1}`,
      maquinaId: `MAQ-${String(i + 1).padStart(3, "0")}`,
      status: "pendente",
      dataPrevista: isoDay(0),
      createdAt: now,
    }));
    await batchPut(TABLES.maintenance, tasks);
    console.log("+ tarefas de manutenção demo (12 para hoje)");
  }

  if (await isEmpty(TABLES.production)) {
    const rows: Record<string, unknown>[] = [];
    const volumes: Record<string, number> = { Manhã: 12918, Tarde: 14124, Noite: 7964 };
    for (const turno of TURNOS) {
      const id = randomUUID();
      rows.push({
        id,
        turno,
        data: isoDay(0),
        dataId: `${isoDay(0)}#${id}`,
        setor: "Usinagem",
        categoria: "Torneamento",
        quantidade: volumes[turno],
        createdAt: now,
      });
    }
    await batchPut(TABLES.production, rows);
    console.log("+ produção demo (3 turnos, hoje)");
  }

  if (await isEmpty(TABLES.snapshots)) {
    const y = isoDay(-1);
    await batchPut(TABLES.snapshots, [
      { metric: "TOTAL_INVENTORY", data: y, valor: 13962 },
      { metric: "LOW_STOCK", data: y, valor: 35 },
      { metric: "ACTIVE_MACHINES", data: y, valor: 126 },
      { metric: "MAINTENANCE_TASKS", data: y, valor: 10 },
    ]);
    console.log("+ snapshots demo (ontem)");
  }
}

async function main() {
  await assertAwsConnection();
  await seedAdmin();
  await seedLookups();
  if (DEMO) await seedDemo();
  console.log(DEMO ? "\nSeed completo (com dados demo)." : "\nSeed mínimo concluído.");
}

main().catch((err) => {
  console.error("\nErro no seed:", err.message ?? err);
  process.exit(1);
});
