
import "dotenv/config";
import { DynamoDBClient, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

export const AWS_REGION = process.env.AWS_REGION ?? "us-east-1";

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value || value === "COLE_AQUI") {
    throw new Error(
      `Variável de ambiente ${name} ausente. Preencha backend/.env (veja backend/.env.example).`
    );
  }
  return value;
}

export const dynamoClient = new DynamoDBClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: requireEnv("AWS_ACCESS_KEY_ID"),
    secretAccessKey: requireEnv("AWS_SECRET_ACCESS_KEY"),
    sessionToken: requireEnv("AWS_SESSION_TOKEN"),
  },
});

export const docClient = DynamoDBDocumentClient.from(dynamoClient, {
  marshallOptions: { removeUndefinedValues: true },
});

const AUTH_ERRORS = new Set([
  "ExpiredTokenException",
  "ExpiredToken",
  "UnrecognizedClientException",
  "InvalidSignatureException",
  "InvalidClientTokenId",
  "AccessDeniedException",
]);

export async function assertAwsConnection(): Promise<void> {
  try {
    await dynamoClient.send(new ListTablesCommand({ Limit: 1 }));
  } catch (err: unknown) {
    const name = (err as { name?: string })?.name ?? "";
    if (AUTH_ERRORS.has(name)) {
      throw new Error(
        "Credenciais AWS Academy expiradas ou inválidas. Clique em 'Start Lab', copie as novas " +
          "credenciais para backend/.env e reinicie o servidor."
      );
    }
    throw err;
  }
}
