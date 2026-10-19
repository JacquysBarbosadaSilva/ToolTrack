/**
 * Definição de TODAS as tabelas do ToolTrack no DynamoDB.
 * Fonte única da verdade: o script `create-tables.ts` e os repositórios usam este arquivo.
 *
 * Billing: PAY_PER_REQUEST (sem capacidade provisionada; ideal para AWS Academy).
 * Datas: sempre ISO 8601 em string (ex.: "2026-10-19" ou "2026-10-19T14:30:00.000Z").
 */
import "dotenv/config";
import type { CreateTableCommandInput } from "@aws-sdk/client-dynamodb";

const prefix = process.env.DYNAMO_TABLE_PREFIX ?? "tooltrack";

export const TABLES = {
  users: `${prefix}-users`,
  products: `${prefix}-products`,
  production: `${prefix}-production`,
  machines: `${prefix}-machines`,
  maintenance: `${prefix}-maintenance`,
  lookups: `${prefix}-lookups`,
  snapshots: `${prefix}-snapshots`,
} as const;

type Key = { name: string; type?: "S" | "N" };

function gsi(name: string, pk: Key, sk?: Key) {
  return {
    IndexName: name,
    KeySchema: [
      { AttributeName: pk.name, KeyType: "HASH" as const },
      ...(sk ? [{ AttributeName: sk.name, KeyType: "RANGE" as const }] : []),
    ],
    Projection: { ProjectionType: "ALL" as const },
  };
}

function def(
  TableName: string,
  pk: Key,
  sk: Key | undefined,
  gsis: { name: string; pk: Key; sk?: Key }[] = []
): CreateTableCommandInput {
  const attrs = new Map<string, "S" | "N">();
  const add = (k?: Key) => k && attrs.set(k.name, k.type ?? "S");
  add(pk);
  add(sk);
  gsis.forEach((g) => {
    add(g.pk);
    add(g.sk);
  });

  return {
    TableName,
    BillingMode: "PAY_PER_REQUEST",
    AttributeDefinitions: [...attrs].map(([AttributeName, AttributeType]) => ({
      AttributeName,
      AttributeType,
    })),
    KeySchema: [
      { AttributeName: pk.name, KeyType: "HASH" },
      ...(sk ? [{ AttributeName: sk.name, KeyType: "RANGE" as const }] : []),
    ],
    ...(gsis.length
      ? { GlobalSecondaryIndexes: gsis.map((g) => gsi(g.name, g.pk, g.sk)) }
      : {}),
  };
}

export const TABLE_DEFINITIONS: CreateTableCommandInput[] = [
  /**
   * USUÁRIOS
   * PK: id (uuid)
   * Atributos: id, nome, email, passwordHash, role ("admin" | "operador" | "visualizador"),
   *            ativo (boolean), createdAt, updatedAt
   * Acesso: login por e-mail -> GSI email-index
   */
  def(TABLES.users, { name: "id" }, undefined, [
    { name: "email-index", pk: { name: "email" } },
  ]),

  /**
   * PRODUTOS / ESTOQUE (tela Dashboard "Estoque", tela Produtos)
   * PK: sku (ex.: "ABC-001")
   * Atributos: sku, nome, categoria, turno, setor, quantidade (N), estoqueMinimo (N),
   *            status ("Normal" | "Baixo" | "Crítico" - derivado e gravado na escrita),
   *            dataCadastro (ISO), createdAt, updatedAt
   * Acessos: por categoria, por turno, por status, ordenados por dataCadastro
   */
  def(TABLES.products, { name: "sku" }, undefined, [
    { name: "categoria-index", pk: { name: "categoria" }, sk: { name: "dataCadastro" } },
    { name: "turno-index", pk: { name: "turno" }, sk: { name: "dataCadastro" } },
    { name: "status-index", pk: { name: "status" }, sk: { name: "dataCadastro" } },
  ]),

  /**
   * PRODUÇÃO (tela Produção + gráfico "Turno" do Dashboard)
   * PK: turno ("Manhã" | "Tarde" | "Noite")
   * SK: dataId = "<YYYY-MM-DD>#<uuid>"  -> permite Query por turno + intervalo de datas
   * Atributos: id, turno, data (YYYY-MM-DD), setor, categoria, quantidade (N), maquinaId?, createdAt
   * GSI data-index: consultar tudo de um dia (todos os turnos)
   */
  def(TABLES.production, { name: "turno" }, { name: "dataId" }, [
    { name: "data-index", pk: { name: "data" }, sk: { name: "dataId" } },
  ]),

  /**
   * MÁQUINAS (KPI "Active Machines")
   * PK: id
   * Atributos: id, nome, setor, status ("ativa" | "inativa" | "manutencao"), updatedAt
   * GSI status-index: contar ativas / total
   */
  def(TABLES.machines, { name: "id" }, undefined, [
    { name: "status-index", pk: { name: "status" } },
  ]),

  /**
   * MANUTENÇÃO (KPI "Maintenance Tasks")
   * PK: id
   * Atributos: id, titulo, maquinaId, status ("pendente" | "concluida"), dataPrevista (YYYY-MM-DD), createdAt
   * GSI status-data-index: tarefas pendentes de uma data (Due today)
   */
  def(TABLES.maintenance, { name: "id" }, undefined, [
    { name: "status-data-index", pk: { name: "status" }, sk: { name: "dataPrevista" } },
  ]),

  /**
   * LOOKUPS (opções dos filtros: setores, categorias, turnos)
   * PK: tipo ("SETOR" | "CATEGORIA" | "TURNO")
   * SK: valor (ex.: "Torneamento")
   * Atributos: tipo, valor, ordem (N), ativo (boolean)
   */
  def(TABLES.lookups, { name: "tipo" }, { name: "valor" }),

  /**
   * SNAPSHOTS DIÁRIOS (para calcular variações dos KPIs: "+2.4%" e "+12")
   * PK: metric ("TOTAL_INVENTORY" | "LOW_STOCK" | "ACTIVE_MACHINES" | "MAINTENANCE_TASKS")
   * SK: data (YYYY-MM-DD)
   * Atributos: metric, data, valor (N)
   */
  def(TABLES.snapshots, { name: "metric" }, { name: "data" }),
];
