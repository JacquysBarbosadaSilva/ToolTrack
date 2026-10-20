
import {
  CreateTableCommand,
  DescribeTableCommand,
  waitUntilTableExists,
} from "@aws-sdk/client-dynamodb";
import { assertAwsConnection, dynamoClient, AWS_REGION } from "../config/aws";
import { TABLE_DEFINITIONS } from "../db/tables";

async function tableExists(name: string): Promise<boolean> {
  try {
    await dynamoClient.send(new DescribeTableCommand({ TableName: name }));
    return true;
  } catch (err: unknown) {
    if ((err as { name?: string })?.name === "ResourceNotFoundException") return false;
    throw err;
  }
}

async function main() {
  await assertAwsConnection();
  console.log(`Conectado à AWS (${AWS_REGION}). Verificando tabelas...\n`);

  for (const def of TABLE_DEFINITIONS) {
    const name = def.TableName!;
    if (await tableExists(name)) {
      console.log(`= ${name} já existe`);
      continue;
    }
    await dynamoClient.send(new CreateTableCommand(def));
    await waitUntilTableExists({ client: dynamoClient, maxWaitTime: 90 }, { TableName: name });
    console.log(`+ ${name} criada`);
  }

  console.log("\nPronto. Próximo passo: npm run seed");
}

main().catch((err) => {
  console.error("\nErro ao criar tabelas:", err.message ?? err);
  process.exit(1);
});
