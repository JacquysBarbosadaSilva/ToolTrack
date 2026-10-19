import {
  QueryCommand,
  PutCommand,
  ScanCommand,
  type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "../config/aws";
import { TABLES } from "../db/tables";

export interface ProductionEntry {
  id: string;
  turno: "Manhã" | "Tarde" | "Noite" | string;
  data: string; // YYYY-MM-DD
  dataId: string; // YYYY-MM-DD#uuid
  setor: string;
  categoria: string;
  quantidade: number;
  maquinaId?: string;
  createdAt: string;
}

export interface ProductionQueryParams {
  turno?: string;
  data?: string;
  dataInicio?: string;
  dataFim?: string;
}

export async function queryByTurno(
  turno: string,
  options: { data?: string; dataInicio?: string; dataFim?: string }
): Promise<ProductionEntry[]> {
  const expressionNames: Record<string, string> = { "#turno": "turno" };
  const expressionValues: Record<string, any> = { ":turno": turno };
  let keyCondition = "#turno = :turno";

  if (options.dataInicio && options.dataFim) {
    keyCondition += " AND #dataId BETWEEN :start AND :end";
    expressionNames["#dataId"] = "dataId";
    expressionValues[":start"] = `${options.dataInicio}#`;
    expressionValues[":end"] = `${options.dataFim}#\uffff`;
  } else if (options.data) {
    keyCondition += " AND begins_with(#dataId, :prefix)";
    expressionNames["#dataId"] = "dataId";
    expressionValues[":prefix"] = `${options.data}#`;
  }

  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.production,
      KeyConditionExpression: keyCondition,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
    })
  );

  return (result.Items as ProductionEntry[]) || [];
}

export async function queryByDate(data: string): Promise<ProductionEntry[]> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.production,
      IndexName: "data-index",
      KeyConditionExpression: "#data = :data",
      ExpressionAttributeNames: { "#data": "data" },
      ExpressionAttributeValues: { ":data": data },
    })
  );

  return (result.Items as ProductionEntry[]) || [];
}

export async function scanAllProduction(): Promise<ProductionEntry[]> {
  const items: ProductionEntry[] = [];
  let exclusiveStartKey: Record<string, any> | undefined = undefined;

  do {
    const scanInput: ScanCommandInput = {
      TableName: TABLES.production,
      ExclusiveStartKey: exclusiveStartKey,
    };

    const result = await docClient.send(new ScanCommand(scanInput));
    if (result.Items) {
      items.push(...(result.Items as ProductionEntry[]));
    }
    exclusiveStartKey = result.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return items;
}

export async function create(entry: ProductionEntry): Promise<ProductionEntry> {
  await docClient.send(
    new PutCommand({
      TableName: TABLES.production,
      Item: entry,
    })
  );

  return entry;
}
