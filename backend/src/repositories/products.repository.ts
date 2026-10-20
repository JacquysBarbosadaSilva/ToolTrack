import {
  GetCommand,
  PutCommand,
  DeleteCommand,
  QueryCommand,
  ScanCommand,
  type QueryCommandInput,
  type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "../config/aws";
import { TABLES } from "../db/tables";

export interface ProductRecord {
  sku: string;
  nome: string;
  categoria: string;
  turno: string;
  setor: string;
  quantidade: number;
  estoqueMinimo: number;
  unidade?: string;
  status: "Normal" | "Baixo" | "Crítico";
  dataCadastro: string;
  createdAt: string;
  updatedAt: string;
}

export interface ListProductsQuery {
  setor?: string;
  turno?: string;
  categoria?: string;
  status?: "Normal" | "Baixo" | "Crítico" | string;
  search?: string;
  limit?: number;
  cursor?: string;
}

function encodeCursor(key?: Record<string, any>): string | null {
  if (!key) return null;
  return Buffer.from(JSON.stringify(key)).toString("base64");
}

function decodeCursor(cursor?: string): Record<string, any> | undefined {
  if (!cursor) return undefined;
  try {
    return JSON.parse(Buffer.from(cursor, "base64").toString("utf-8"));
  } catch {
    return undefined;
  }
}

export async function findBySku(sku: string): Promise<ProductRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.products,
      Key: { sku },
    })
  );

  return (result.Item as ProductRecord) || null;
}

export async function create(product: ProductRecord): Promise<ProductRecord> {
  await docClient.send(
    new PutCommand({
      TableName: TABLES.products,
      Item: product,
      ConditionExpression: "attribute_not_exists(sku)",
    })
  );

  return product;
}

export async function update(product: ProductRecord): Promise<ProductRecord> {
  await docClient.send(
    new PutCommand({
      TableName: TABLES.products,
      Item: product,
      ConditionExpression: "attribute_exists(sku)",
    })
  );

  return product;
}

export async function deleteBySku(sku: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLES.products,
      Key: { sku },
      ConditionExpression: "attribute_exists(sku)",
    })
  );
}

export async function list(
  params: ListProductsQuery
): Promise<{ items: ProductRecord[]; nextCursor: string | null }> {
  const limit = Math.min(Math.max(params.limit || 20, 1), 100);
  const exclusiveStartKey = decodeCursor(params.cursor);

  const filterExpressions: string[] = [];
  const expressionNames: Record<string, string> = {};
  const expressionValues: Record<string, any> = {};

  let useGsi: { name: string; keyField: string; keyValue: string } | null = null;

  if (params.status) {
    useGsi = { name: "status-index", keyField: "status", keyValue: params.status };
  } else if (params.categoria) {
    useGsi = { name: "categoria-index", keyField: "categoria", keyValue: params.categoria };
  } else if (params.turno) {
    useGsi = { name: "turno-index", keyField: "turno", keyValue: params.turno };
  }

  if (params.setor) {
    filterExpressions.push("#setor = :setor");
    expressionNames["#setor"] = "setor";
    expressionValues[":setor"] = params.setor;
  }

  if (params.status && useGsi?.keyField !== "status") {
    filterExpressions.push("#status = :status");
    expressionNames["#status"] = "status";
    expressionValues[":status"] = params.status;
  }

  if (params.categoria && useGsi?.keyField !== "categoria") {
    filterExpressions.push("#categoria = :categoria");
    expressionNames["#categoria"] = "categoria";
    expressionValues[":categoria"] = params.categoria;
  }

  if (params.turno && useGsi?.keyField !== "turno") {
    filterExpressions.push("#turno = :turno");
    expressionNames["#turno"] = "turno";
    expressionValues[":turno"] = params.turno;
  }

  if (params.search && params.search.trim()) {
    filterExpressions.push("(contains(#nome, :search) or contains(#sku, :search))");
    expressionNames["#nome"] = "nome";
    expressionNames["#sku"] = "sku";
    expressionValues[":search"] = params.search.trim();
  }

  const filterExpression = filterExpressions.length > 0 ? filterExpressions.join(" AND ") : undefined;

  let items: ProductRecord[] = [];
  let lastKey: Record<string, any> | undefined = undefined;

  if (useGsi) {
    expressionNames[`#${useGsi.keyField}`] = useGsi.keyField;
    expressionValues[`:${useGsi.keyField}`] = useGsi.keyValue;

    const queryInput: QueryCommandInput = {
      TableName: TABLES.products,
      IndexName: useGsi.name,
      KeyConditionExpression: `#${useGsi.keyField} = :${useGsi.keyField}`,
      ExpressionAttributeNames: expressionNames,
      ExpressionAttributeValues: expressionValues,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
      ScanIndexForward: false,
    };

    if (filterExpression) {
      queryInput.FilterExpression = filterExpression;
    }

    const result = await docClient.send(new QueryCommand(queryInput));
    items = (result.Items as ProductRecord[]) || [];
    lastKey = result.LastEvaluatedKey;
  } else {
    const scanInput: ScanCommandInput = {
      TableName: TABLES.products,
      Limit: limit,
      ExclusiveStartKey: exclusiveStartKey,
    };

    if (filterExpression) {
      scanInput.FilterExpression = filterExpression;
      scanInput.ExpressionAttributeNames = expressionNames;
      scanInput.ExpressionAttributeValues = expressionValues;
    }

    const result = await docClient.send(new ScanCommand(scanInput));
    items = (result.Items as ProductRecord[]) || [];
    lastKey = result.LastEvaluatedKey;
  }

  return {
    items,
    nextCursor: encodeCursor(lastKey),
  };
}

export async function scanAll(filters?: {
  setor?: string;
  turno?: string;
  categoria?: string;
}): Promise<ProductRecord[]> {
  const items: ProductRecord[] = [];
  let exclusiveStartKey: Record<string, any> | undefined = undefined;

  const filterExpressions: string[] = [];
  const expressionNames: Record<string, string> = {};
  const expressionValues: Record<string, any> = {};

  if (filters?.setor) {
    filterExpressions.push("#setor = :setor");
    expressionNames["#setor"] = "setor";
    expressionValues[":setor"] = filters.setor;
  }

  if (filters?.turno) {
    filterExpressions.push("#turno = :turno");
    expressionNames["#turno"] = "turno";
    expressionValues[":turno"] = filters.turno;
  }

  if (filters?.categoria) {
    filterExpressions.push("#categoria = :categoria");
    expressionNames["#categoria"] = "categoria";
    expressionValues[":categoria"] = filters.categoria;
  }

  const filterExpression = filterExpressions.length > 0 ? filterExpressions.join(" AND ") : undefined;

  do {
    const scanInput: ScanCommandInput = {
      TableName: TABLES.products,
      ExclusiveStartKey: exclusiveStartKey,
    };

    if (filterExpression) {
      scanInput.FilterExpression = filterExpression;
      scanInput.ExpressionAttributeNames = expressionNames;
      scanInput.ExpressionAttributeValues = expressionValues;
    }

    const result = await docClient.send(new ScanCommand(scanInput));
    if (result.Items) {
      items.push(...(result.Items as ProductRecord[]));
    }
    exclusiveStartKey = result.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return items;
}
