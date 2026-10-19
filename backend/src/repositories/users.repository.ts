import {
  GetCommand,
  QueryCommand,
  PutCommand,
  DeleteCommand,
  ScanCommand,
  type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { docClient } from "../config/aws";
import { TABLES } from "../db/tables";

export interface UserRecord {
  id: string;
  nome: string;
  email: string;
  passwordHash: string;
  role: "admin" | "operador" | "visualizador" | "ADMIN" | "USER" | string;
  ativo: boolean;
  cargo?: string;
  telefone?: string;
  departamento?: string;
  localizacao?: string;
  idFuncionario?: string;
  createdAt: string;
  updatedAt: string;
}

export type SafeUser = Omit<UserRecord, "passwordHash"> & {
  name: string;
};

export function toSafeUser(user: UserRecord): SafeUser {
  const { passwordHash: _, ...rest } = user;
  return {
    ...rest,
    name: rest.nome,
  };
}

export async function findByEmail(email: string): Promise<UserRecord | null> {
  const result = await docClient.send(
    new QueryCommand({
      TableName: TABLES.users,
      IndexName: "email-index",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: {
        ":email": email.toLowerCase().trim(),
      },
      Limit: 1,
    })
  );

  const item = result.Items?.[0];
  if (!item) return null;
  return item as UserRecord;
}

export async function findById(id: string): Promise<UserRecord | null> {
  const result = await docClient.send(
    new GetCommand({
      TableName: TABLES.users,
      Key: { id },
    })
  );

  const item = result.Item;
  if (!item) return null;
  return item as UserRecord;
}

export async function findSafeById(id: string): Promise<SafeUser | null> {
  const user = await findById(id);
  if (!user) return null;
  return toSafeUser(user);
}

export async function create(user: UserRecord): Promise<UserRecord> {
  await docClient.send(
    new PutCommand({
      TableName: TABLES.users,
      Item: user,
      ConditionExpression: "attribute_not_exists(id)",
    })
  );

  return user;
}

export async function update(user: UserRecord): Promise<UserRecord> {
  await docClient.send(
    new PutCommand({
      TableName: TABLES.users,
      Item: user,
      ConditionExpression: "attribute_exists(id)",
    })
  );

  return user;
}

export async function deleteById(id: string): Promise<void> {
  await docClient.send(
    new DeleteCommand({
      TableName: TABLES.users,
      Key: { id },
      ConditionExpression: "attribute_exists(id)",
    })
  );
}

export async function listAll(): Promise<SafeUser[]> {
  const items: UserRecord[] = [];
  let exclusiveStartKey: Record<string, any> | undefined = undefined;

  do {
    const scanInput: ScanCommandInput = {
      TableName: TABLES.users,
      ExclusiveStartKey: exclusiveStartKey,
    };

    const result = await docClient.send(new ScanCommand(scanInput));
    if (result.Items) {
      items.push(...(result.Items as UserRecord[]));
    }
    exclusiveStartKey = result.LastEvaluatedKey;
  } while (exclusiveStartKey);

  return items.map(toSafeUser);
}
