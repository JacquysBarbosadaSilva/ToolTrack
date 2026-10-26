import { randomUUID } from "node:crypto";
import {
  ScanCommand,
  PutCommand,
  UpdateCommand,
  QueryCommand,
  type ScanCommandInput,
} from "@aws-sdk/lib-dynamodb";
import { assertAwsConnection, docClient } from "../config/aws";
import { TABLES } from "../db/tables";

// Parse de argumentos de linha de comando
const args = process.argv.slice(2);
const helpFlag = args.includes("--help") || args.includes("-h");

if (helpFlag) {
  console.log(`
Uso: npm run simulate [opções]

Opções:
  --interval <ms>    Intervalo entre ciclos em milissegundos (padrão: 3000)
  --iterations <n>   Número máximo de ciclos a executar (padrão: infinito)
  --help, -h         Exibe esta mensagem de ajuda
  `);
  process.exit(0);
}

const intervalIndex = args.indexOf("--interval");
const INTERVAL_MS =
  intervalIndex !== -1 && args[intervalIndex + 1]
    ? Math.max(500, parseInt(args[intervalIndex + 1], 10))
    : parseInt(process.env.SIMULATE_INTERVAL_MS || "3000", 10);

const iterationsIndex = args.indexOf("--iterations");
const MAX_ITERATIONS =
  iterationsIndex !== -1 && args[iterationsIndex + 1]
    ? parseInt(args[iterationsIndex + 1], 10)
    : Infinity;

const SETORES = ["Usinagem", "Acabamento", "Montagem"];
const CATEGORIAS = ["Torneamento", "Fresamento", "Furação", "Rosqueamento", "Canal e Corte"];
const TURNOS = ["Manhã", "Tarde", "Noite"];

function getTimestamp(): string {
  return new Date().toLocaleTimeString("pt-BR", { hour12: false });
}

function getTodayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function calcStatus(qtd: number, min: number): "Normal" | "Baixo" | "Crítico" {
  if (qtd <= min * 0.25) return "Crítico";
  if (qtd < min) return "Baixo";
  return "Normal";
}

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. Simular Apontamento de Produção (tooltrack-production)
async function simulateProduction(machinesList: any[]): Promise<string> {
  const today = getTodayIso();
  const turno = getRandomItem(TURNOS);
  const setor = getRandomItem(SETORES);
  const categoria = getRandomItem(CATEGORIAS);
  const qtdProduzida = getRandomInt(15, 65);
  const machine = machinesList.length ? getRandomItem(machinesList) : null;
  const maquinaId = machine?.id || `MAQ-${String(getRandomInt(1, 10)).padStart(3, "0")}`;

  const id = randomUUID();
  const now = new Date().toISOString();

  await docClient.send(
    new PutCommand({
      TableName: TABLES.production,
      Item: {
        id,
        turno,
        data: today,
        dataId: `${today}#${id}`,
        setor,
        categoria,
        quantidade: qtdProduzida,
        maquinaId,
        createdAt: now,
      },
    })
  );

  return `📦 [PRODUÇÃO] +${qtdProduzida} un produzidas | Turno: ${turno} | Setor: ${setor} | Máq: ${maquinaId}`;
}

// 2. Simular Desgaste ou Reposição de Pastilhas (tooltrack-products)
async function simulateProductStock(): Promise<string> {
  // Buscar um produto existente
  const scan = await docClient.send(
    new ScanCommand({
      TableName: TABLES.products,
      Limit: 20,
    })
  );

  const items = scan.Items || [];
  if (items.length === 0) {
    return `⚠️ [ESTOQUE] Nenhum produto encontrado na tabela ${TABLES.products}. Execute o seed demo.`;
  }

  const prod = getRandomItem(items);
  const currentQtd = Number(prod.quantidade || 0);
  const min = Number(prod.estoqueMinimo || 100);
  const now = new Date().toISOString();

  // Se estiver crítico ou com 30% de chance, simula chegada de lote de reposição
  const shouldReplenish = currentQtd <= min * 0.3 || Math.random() < 0.25;

  let newQtd: number;
  let actionDesc: string;

  if (shouldReplenish) {
    const replenishment = getRandomInt(150, 400);
    newQtd = currentQtd + replenishment;
    actionDesc = `📥 [REPOSIÇÃO] SKU ${prod.sku} | Recebido lote: +${replenishment} un (${currentQtd} ➔ ${newQtd})`;
  } else {
    // Simula consumo por usinagem (-8 a -35 unidades)
    const consumption = Math.min(currentQtd, getRandomInt(8, 35));
    newQtd = Math.max(0, currentQtd - consumption);
    actionDesc = `⚙️ [DESGASTE/USO] SKU ${prod.sku} | Consumido: -${consumption} un (${currentQtd} ➔ ${newQtd})`;
  }

  const newStatus = calcStatus(newQtd, min);

  await docClient.send(
    new UpdateCommand({
      TableName: TABLES.products,
      Key: { sku: prod.sku },
      UpdateExpression:
        "SET #qtd = :q, #status = :s, #updatedAt = :now",
      ExpressionAttributeNames: {
        "#qtd": "quantidade",
        "#status": "status",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":q": newQtd,
        ":s": newStatus,
        ":now": now,
      },
    })
  );

  return `${actionDesc} | Novo Status: ${newStatus}`;
}

// 3. Simular Telemetria de Máquina / Esteira (tooltrack-machines)
async function simulateMachineTelemetry(machinesList: any[]): Promise<string> {
  if (machinesList.length === 0) {
    return `⚠️ [MÁQUINAS] Nenhuma máquina disponível para atualizar.`;
  }

  const machine = getRandomItem(machinesList);
  const producaoHora = getRandomInt(1100, 1380);
  const oee = getRandomInt(88, 98);
  const now = new Date().toISOString();

  // 15% de chance de alterar status operacional
  let newStatus = machine.status;
  if (Math.random() < 0.15) {
    newStatus = machine.status === "ativa" ? (Math.random() < 0.5 ? "parada" : "manutencao") : "ativa";
    machine.status = newStatus;
  }

  await docClient.send(
    new UpdateCommand({
      TableName: TABLES.machines,
      Key: { id: machine.id },
      UpdateExpression:
        "SET #status = :s, #producaoHora = :ph, #eficienciaOEE = :oee, #updatedAt = :now",
      ExpressionAttributeNames: {
        "#status": "status",
        "#producaoHora": "producaoHora",
        "#eficienciaOEE": "eficienciaOEE",
        "#updatedAt": "updatedAt",
      },
      ExpressionAttributeValues: {
        ":s": newStatus,
        ":ph": String(producaoHora),
        ":oee": String(oee),
        ":now": now,
      },
    })
  );

  return `🤖 [MÁQUINA] ${machine.id} (${machine.name || machine.nome || "Esteira"}) | Status: ${newStatus} | OEE: ${oee}% | Produção: ${producaoHora} un/h`;
}

// 4. Simular Tarefas de Manutenção (tooltrack-maintenance)
async function simulateMaintenance(machinesList: any[]): Promise<string> {
  const today = getTodayIso();
  const now = new Date().toISOString();

  // Buscar tarefas pendentes para hoje
  const query = await docClient.send(
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
        ":data": today,
      },
      Limit: 5,
    })
  );

  const pendingTasks = query.Items || [];

  if (pendingTasks.length > 0 && Math.random() < 0.5) {
    // Concluir uma tarefa pendente
    const task = getRandomItem(pendingTasks);
    await docClient.send(
      new UpdateCommand({
        TableName: TABLES.maintenance,
        Key: { id: task.id },
        UpdateExpression: "SET #status = :concluida, #updatedAt = :now",
        ExpressionAttributeNames: {
          "#status": "status",
          "#updatedAt": "updatedAt",
        },
        ExpressionAttributeValues: {
          ":concluida": "concluida",
          ":now": now,
        },
      })
    );
    return `✅ [MANUTENÇÃO] Tarefa '${task.titulo || task.id}' concluída com sucesso!`;
  } else {
    // Criar nova ordem de manutenção preventiva
    const id = randomUUID();
    const machine = machinesList.length ? getRandomItem(machinesList) : null;
    const maquinaId = machine?.id || "MAQ-001";
    const numero = getRandomInt(10, 99);

    await docClient.send(
      new PutCommand({
        TableName: TABLES.maintenance,
        Item: {
          id,
          titulo: `Inspeção e lubrificação preventiva #${numero}`,
          maquinaId,
          status: "pendente",
          dataPrevista: today,
          createdAt: now,
        },
      })
    );
    return `📋 [MANUTENÇÃO] Nova tarefa preventiva agendada para hoje na máquina ${maquinaId}`;
  }
}

async function loadMachinesCache(): Promise<any[]> {
  try {
    const res = await docClient.send(
      new ScanCommand({
        TableName: TABLES.machines,
        Limit: 50,
      })
    );
    return res.Items || [];
  } catch {
    return [];
  }
}

async function ensureInitialData(): Promise<void> {
  const productsScan = await docClient.send(
    new ScanCommand({
      TableName: TABLES.products,
      Limit: 1,
    })
  );

  if ((productsScan.Items?.length ?? 0) === 0) {
    console.log("ℹ️ Tabelas parecem vazias. Recomenda-se rodar 'npm run seed -- --demo' antes.");
  }
}

async function main() {
  console.log(`\n============================================================`);
  console.log(`  🚀 ToolTrack - Simulador de Produção em Tempo Real`);
  console.log(`============================================================`);
  console.log(`📡 Conectando ao Amazon DynamoDB...`);

  await assertAwsConnection();
  console.log(`✅ Conexão DynamoDB estabelecida com sucesso!`);

  await ensureInitialData();

  console.log(`⏱️ Intervalo entre eventos: ${INTERVAL_MS} ms`);
  console.log(`💡 Abra o frontend no navegador (ex: http://localhost:5173/)`);
  console.log(`   As telas Dashboard e Produção atualizarão dinamicamente.`);
  console.log(`🛑 Para encerrar o simulador, pressione Ctrl+C a qualquer momento.\n`);

  let machinesCache = await loadMachinesCache();
  let iteration = 0;
  let isRunning = true;

  const shutdown = () => {
    if (!isRunning) return;
    isRunning = false;
    console.log(`\n\n🛑 Encerrando simulador... Total de ciclos executados: ${iteration}`);
    process.exit(0);
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  while (isRunning && iteration < MAX_ITERATIONS) {
    iteration++;

    try {
      // Recarrega lista de máquinas periodicamente a cada 20 ciclos
      if (iteration % 20 === 1) {
        machinesCache = await loadMachinesCache();
      }

      // Alterna ou combina eventos de forma balanceada
      const dice = Math.random();
      let logMsg = "";

      if (dice < 0.35) {
        // Evento de produção
        logMsg = await simulateProduction(machinesCache);
      } else if (dice < 0.70) {
        // Evento de estoque (desgaste ou reposição)
        logMsg = await simulateProductStock();
      } else if (dice < 0.90) {
        // Evento de máquina
        logMsg = await simulateMachineTelemetry(machinesCache);
      } else {
        // Evento de manutenção
        logMsg = await simulateMaintenance(machinesCache);
      }

      console.log(`[${getTimestamp()}] #${iteration} ${logMsg}`);
    } catch (err: any) {
      console.error(`[${getTimestamp()}] ❌ Erro no ciclo #${iteration}:`, err?.message || err);
    }

    await new Promise((res) => setTimeout(res, INTERVAL_MS));
  }

  if (iteration >= MAX_ITERATIONS) {
    console.log(`\n🏁 Limite de ${MAX_ITERATIONS} ciclos atingido. Simulação concluída.`);
  }
}

main().catch((err) => {
  console.error("Falha ao iniciar simulador:", err?.message || err);
  process.exit(1);
});
