
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

  def(TABLES.users, { name: "id" }, undefined, [
    { name: "email-index", pk: { name: "email" } },
  ]),

  def(TABLES.products, { name: "sku" }, undefined, [
    { name: "categoria-index", pk: { name: "categoria" }, sk: { name: "dataCadastro" } },
    { name: "turno-index", pk: { name: "turno" }, sk: { name: "dataCadastro" } },
    { name: "status-index", pk: { name: "status" }, sk: { name: "dataCadastro" } },
  ]),

  def(TABLES.production, { name: "turno" }, { name: "dataId" }, [
    { name: "data-index", pk: { name: "data" }, sk: { name: "dataId" } },
  ]),

  def(TABLES.machines, { name: "id" }, undefined, [
    { name: "status-index", pk: { name: "status" } },
  ]),

  def(TABLES.maintenance, { name: "id" }, undefined, [
    { name: "status-data-index", pk: { name: "status" }, sk: { name: "dataPrevista" } },
  ]),

  def(TABLES.lookups, { name: "tipo" }, { name: "valor" }),

  def(TABLES.snapshots, { name: "metric" }, { name: "data" }),
];
