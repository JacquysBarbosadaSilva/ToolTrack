import {
  QueryCommand,
  ScanCommand,
  PutCommand,
  type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "../config/aws";
import { TABLES } from "../db/tables";

export interface MachineRecord {
  id: string;
  nome: string;
  setor: string;
  status: "ativa" | "inativa" | "manutencao";
}

export interface ProductionRecord {
  id: string;
  turno: "Manhã" | "Tarde" | "Noite" | string;
  data: string;
  dataId: string;
  setor: string;
  categoria: string;
  quantidade: number;
}

export async function getMachinesStats(setor?: string): Promise<{ active: number; total: number }> {
  let active = 0;
  let total = 0;
  let exclusiveStartKey: Record<string, any> | undefined = undefined;

  do {
    const scanInput: ScanCommandInput = {
      TableName: TABLES.machines,
      ExclusiveStartKey: exclusiveStartKey,
    };

    if (setor) {
      scanInput.FilterExpression = "#setor = :setor";
      scanInput.ExpressionAttributeNames = { "#setor": "setor" };
      scanInput.ExpressionAttributeValues = { ":setor": setor };
    }

    const result = await docClient.send(new ScanCommand(scanInput));
    const items = (result.Items as MachineRecord[]) || [];

    for (const machine of items) {
      total += 1;
      if (machine.status === "ativa") {
        active += 1;
      }
    }

    exclusiveStartKey = result.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return { active, total };
}

export async function getPendingMaintenanceCount(data: string): Promise<number> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.maintenance,
      IndexName: "status-data-index",
      KeyConditionExpression: "#status = :status AND #dataPrevista = :data",
      ExpressionAttributeNames: {
        "#status": "status",
        "#dataPrevista": "dataPrevista",
      },
      ExpressionAttributeValues: {
        ":status": "pendente",
        ":data": data,
      },
    })
  );

  return result.Count ?? (result.Items?.length || 0);
}

export async function getProductionByDate(
  data: string,
  filters?: { setor?: string; categoria?: string; turno?: string }
): Promise<ProductionRecord[]> {
  const filterExpressions: string[] = [];
  const expressionNames: Record<string, string> = { "#data": "data" };
  const expressionValues: Record<string, any> = { ":data": data };

  if (filters?.setor) {
    filterExpressions.push("#setor = :setor");
    expressionNames["#setor"] = "setor";
    expressionValues[":setor"] = filters.setor;
  }

  if (filters?.categoria) {
    filterExpressions.push("#categoria = :categoria");
    expressionNames["#categoria"] = "categoria";
    expressionValues[":categoria"] = filters.categoria;
  }

  if (filters?.turno) {
    filterExpressions.push("#turno = :turno");
    expressionNames["#turno"] = "turno";
    expressionValues[":turno"] = filters.turno;
  }

  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.production,
      IndexName: "data-index",
      KeyConditionExpression: "#data = :data",
      FilterExpression: filterExpressions.length > 0 ? filterExpressions.join(" AND ") : undefined,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
    })
  );

  return (result.Items as ProductionRecord[]) || [];
}

export async function getLatestSnapshot(
  metric: string,
  beforeDate: string
): Promise<number | null> {
  try {
    const result = await docClient.send(
      new QueryCommand({
        TableName: TABLES.snapshots,
        KeyConditionExpression: "metric = :metric AND #data < :beforeDate",
        ExpressionAttributeNames: { "#data": "data" },
        ExpressionAttributeValues: {
          ":metric": metric,
          ":beforeDate": beforeDate,
        },
        ScanIndexForward: false, // data mais recente primeiro
        Limit: 1,
      })
    );

    const item = result.Items?.[0];
    if (!item || typeof item.valor !== "number") return null;
    return item.valor;
  } catch (_err) {
    return null;
  }
}

export async function saveSnapshot(
  metric: string,
  data: string,
  valor: number
): Promise<void> {
  await docClient.send(
    new PutCommand({
      TableName: TABLES.snapshots,
      Item: {
        metric,
        data,
        valor,
      },
    })
  );
}
