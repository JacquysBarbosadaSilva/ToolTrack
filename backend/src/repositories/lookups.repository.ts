import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from "../config/aws";
import { TABLES } from "../db/tables";

export interface LookupItem {
  tipo: "SETOR" | "CATEGORIA" | "TURNO";
  valor: string;
  ordem?: number;
  ativo?: boolean;
}

export interface LookupsResult {
  setores: string[];
  categorias: string[];
  turnos: string[];
}

export async function getLookupsByType(tipo: "SETOR" | "CATEGORIA" | "TURNO"): Promise<string[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.lookups,
      KeyConditionExpression: "tipo = :tipo",
      ExpressionAttributeValues: {
        ":tipo": tipo,
      },
    })
  );

  const items = (result.Items || []) as LookupItem[];
  return items
    .filter((i) => i.ativo !== false)
    .sort((a, b) => (a.ordem ?? 0) - (b.ordem ?? 0))
    .map((i) => i.valor);
}

export async function getAllLookups(): Promise<LookupsResult> {
  const [setores, categorias, turnos] = await Promise.all([
    getLookupsByType("SETOR"),
    getLookupsByType("CATEGORIA"),
    getLookupsByType("TURNO"),
  ]);

  return { setores, categorias, turnos };
}
