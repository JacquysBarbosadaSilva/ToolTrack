import * as productsRepository from "../repositories/products.repository";
import * as dashboardRepository from "../repositories/dashboard.repository";

export interface DashboardFilters {
  setor?: string;
  turno?: string;
  categoria?: string;
  data?: string;
}

const CATEGORY_COLORS = ["#1E2A4A", "#2F4A85", "#4A6DB5", "#8A9BCB", "#B8C4E3"];

const SHIFT_COLORS: Record<string, string> = {
  Manhã: "#1E2A4A",
  Tarde: "#8A9BCB",
  Noite: "#4A6DB5",
};

export async function getDashboard(filters: DashboardFilters = {}) {
  const today = new Date().toISOString().slice(0, 10);
  const targetDate = filters.data || today;

  const products = await productsRepository.scanAll({
    setor: filters.setor,
    turno: filters.turno,
    categoria: filters.categoria,
  });

  const totalItems = products.reduce((sum, p) => sum + (p.quantidade || 0), 0);
  const lowStock = products.filter(
    (p) => p.status === "Baixo" || p.status === "Crítico"
  ).length;

  const categoryMap = new Map<string, number>();
  for (const product of products) {
    const cat = product.categoria || "Outros";
    categoryMap.set(cat, (categoryMap.get(cat) || 0) + (product.quantidade || 0));
  }

  const categoryEntries = Array.from(categoryMap.entries()).sort((a, b) => b[1] - a[1]);
  const categoria = categoryEntries.map(([nome, quantidade], idx) => {
    const percentual = totalItems > 0 ? Number(((quantidade / totalItems) * 100).toFixed(1)) : 0;
    const color = CATEGORY_COLORS[idx % CATEGORY_COLORS.length];
    return {
      nome,
      name: nome,
      quantidade,
      count: quantidade,
      percentual,
      percentage: percentual,
      color,
    };
  });

  const { active: activeMachines, total: totalMachines } =
    await dashboardRepository.getMachinesStats(filters.setor);

  const maintenanceTasks = await dashboardRepository.getPendingMaintenanceCount(targetDate);

  const productionRows = await dashboardRepository.getProductionByDate(targetDate, {
    setor: filters.setor,
    categoria: filters.categoria,
    turno: filters.turno,
  });

  const shiftTotals: Record<string, number> = {
    Manhã: 0,
    Tarde: 0,
    Noite: 0,
  };

  for (const row of productionRows) {
    if (row.turno && shiftTotals[row.turno] !== undefined) {
      shiftTotals[row.turno] += row.quantidade || 0;
    } else if (row.turno) {
      shiftTotals[row.turno] = (shiftTotals[row.turno] || 0) + (row.quantidade || 0);
    }
  }

  const totalProduction = Object.values(shiftTotals).reduce((a, b) => a + b, 0);

  const shiftOrder = ["Manhã", "Noite", "Tarde"];
  const turno = shiftOrder.map((shiftName) => {
    const quantidade = shiftTotals[shiftName] || 0;
    const percentual =
      totalProduction > 0 ? Number(((quantidade / totalProduction) * 100).toFixed(1)) : 0;
    return {
      turno: shiftName,
      shift: shiftName,
      quantidade,
      count: quantidade,
      percentual,
      percentage: percentual,
      color: SHIFT_COLORS[shiftName] || "#1E2A4A",
    };
  });

  const [snapInventory, snapLowStock] = await Promise.all([
    dashboardRepository.getLatestSnapshot("TOTAL_INVENTORY", today),
    dashboardRepository.getLatestSnapshot("LOW_STOCK", today),
  ]);

  let inventoryChange = "+0.0%";
  let inventoryPositive = true;
  if (snapInventory !== null && snapInventory > 0) {
    const diff = totalItems - snapInventory;
    const pct = ((diff / snapInventory) * 100).toFixed(1);
    inventoryChange = diff >= 0 ? `↑${pct}%` : `↓${Math.abs(Number(pct))}%`;
    inventoryPositive = diff >= 0;
  }

  let lowStockChange = "+0";
  let lowStockPositive = true;
  if (snapLowStock !== null) {
    const diff = lowStock - snapLowStock;
    lowStockChange = diff >= 0 ? `↑${diff}` : `↓${Math.abs(diff)}`;
    lowStockPositive = diff <= 0;
  }

  const activeMachinesPercent =
    totalMachines > 0 ? ((activeMachines / totalMachines) * 100).toFixed(1) : "0.0";
  const activeMachinesChange = `${activeMachinesPercent}% Up`;

  const maintenanceChange = "Due today";

  const kpis = {
    totalItems: {
      value: totalItems,
      formatted: totalItems.toLocaleString("en-US"),
      change: inventoryChange,
      isPositive: inventoryPositive,
    },
    lowStock: {
      value: lowStock,
      formatted: String(lowStock),
      change: lowStockChange,
      isPositive: lowStockPositive,
    },
    activeMachines: {
      active: activeMachines,
      total: totalMachines,
      formatted: `${activeMachines}/${totalMachines}`,
      change: activeMachinesChange,
      isPositive: true,
    },
    maintenanceTasks: {
      value: maintenanceTasks,
      formatted: String(maintenanceTasks),
      change: maintenanceChange,
      isPositive: false,
    },
    cards: [
      {
        id: "METRIC#001",
        title: "TOTAL INVENTORY ITEMS",
        value: totalItems.toLocaleString("en-US"),
        change: inventoryChange,
        isPositive: inventoryPositive,
        variant: "blue",
      },
      {
        id: "METRIC#002",
        title: "LOW STOCK ALERTS",
        value: String(lowStock),
        change: lowStockChange,
        isPositive: lowStockPositive,
        variant: "red",
      },
      {
        id: "METRIC#003",
        title: "ACTIVE MACHINES",
        value: `${activeMachines}/${totalMachines}`,
        change: activeMachinesChange,
        isPositive: true,
        variant: "green",
      },
      {
        id: "METRIC#004",
        title: "MAINTENANCE TASKS",
        value: String(maintenanceTasks),
        change: maintenanceChange,
        isPositive: false,
        variant: "dark",
      },
    ],
  };

  const recentes = [
    {
      id: "RECENT#PROD",
      title: "Produtos",
      description: "Cadastre e gerencie seus produtos",
      route: "/producao",
    },
  ];

  try {
    await Promise.all([
      dashboardRepository.saveSnapshot("TOTAL_INVENTORY", today, totalItems),
      dashboardRepository.saveSnapshot("LOW_STOCK", today, lowStock),
      dashboardRepository.saveSnapshot("ACTIVE_MACHINES", today, activeMachines),
      dashboardRepository.saveSnapshot("MAINTENANCE_TASKS", today, maintenanceTasks),
    ]);
  } catch (err) {
    console.error("Falha ao salvar snapshots do dashboard:", err);
  }

  return {
    kpis,
    categoria,
    turno,
    recentes,
  };
}
