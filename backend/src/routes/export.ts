import { Router } from "express";
import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { z } from "zod";
import { requireAuth } from "../middleware/auth";
import { validateQuery } from "../middleware/validate";
import * as productsRepository from "../repositories/products.repository";
import type { ProductRecord } from "../repositories/products.repository";

const router = Router();

const exportQuerySchema = z.object({
  setor: z.string().optional(),
  turno: z.string().optional(),
  categoria: z.string().optional(),
  status: z.enum(["Normal", "Baixo", "Crítico"]).optional(),
  search: z.string().optional(),
});

async function getFilteredProducts(query: z.infer<typeof exportQuerySchema>): Promise<ProductRecord[]> {
  const all = await productsRepository.scanAll({
    setor: query.setor,
    turno: query.turno,
    categoria: query.categoria,
  });

  return all.filter((p) => {
    if (query.status && p.status !== query.status) return false;
    if (query.search && query.search.trim()) {
      const q = query.search.toLowerCase().trim();
      const matchSku = p.sku.toLowerCase().includes(q);
      const matchNome = (p.nome || "").toLowerCase().includes(q);
      if (!matchSku && !matchNome) return false;
    }
    return true;
  });
}

// GET /api/export/products.xlsx
router.get("/products.xlsx", requireAuth, validateQuery(exportQuerySchema), async (req, res, next) => {
  try {
    const products = await getFilteredProducts(req.query as any);

    const workbook = new ExcelJS.Workbook();
    workbook.creator = "ToolTrack";
    workbook.created = new Date();

    const worksheet = workbook.addWorksheet("Produtos");

    worksheet.columns = [
      { header: "SKU", key: "sku", width: 14 },
      { header: "Nome", key: "nome", width: 32 },
      { header: "Categoria", key: "categoria", width: 20 },
      { header: "Turno", key: "turno", width: 14 },
      { header: "Setor", key: "setor", width: 20 },
      { header: "Quantidade", key: "quantidade", width: 14 },
      { header: "Estoque Mínimo", key: "estoqueMinimo", width: 16 },
      { header: "Status", key: "status", width: 14 },
      { header: "Data Cadastro", key: "dataCadastro", width: 16 },
    ];

    // Estilização do cabeçalho
    const headerRow = worksheet.getRow(1);
    headerRow.font = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
    headerRow.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FF111B2E" },
    };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };
    headerRow.height = 24;

    // Inserção das linhas de dados
    products.forEach((p) => {
      const row = worksheet.addRow({
        sku: p.sku,
        nome: p.nome,
        categoria: p.categoria,
        turno: p.turno,
        setor: p.setor,
        quantidade: p.quantidade,
        estoqueMinimo: p.estoqueMinimo,
        status: p.status,
        dataCadastro: p.dataCadastro,
      });

      // Alinhamento central para colunas curtas
      row.getCell("sku").alignment = { horizontal: "center" };
      row.getCell("turno").alignment = { horizontal: "center" };
      row.getCell("status").alignment = { horizontal: "center" };
      row.getCell("dataCadastro").alignment = { horizontal: "center" };
      row.getCell("quantidade").alignment = { horizontal: "right" };
      row.getCell("estoqueMinimo").alignment = { horizontal: "right" };
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="produtos.xlsx"'
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (err) {
    return next(err);
  }
});

// GET /api/export/products.pdf
router.get("/products.pdf", requireAuth, validateQuery(exportQuerySchema), async (req, res, next) => {
  try {
    const products = await getFilteredProducts(req.query as any);

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="produtos.pdf"'
    );

    doc.pipe(res);

    // Barra de topo e Título
    doc.rect(0, 0, doc.page.width, 54).fill("#111B2E");
    doc.fillColor("#FFFFFF").fontSize(16).font("Helvetica-Bold").text("ToolTrack - Relatório de Estoque", 40, 18);

    doc.fillColor("#475569").fontSize(9).font("Helvetica");
    doc.text(
      `Gerado em: ${new Date().toLocaleDateString("pt-BR")} às ${new Date().toLocaleTimeString("pt-BR")}`,
      40,
      68
    );
    doc.text(`Total de produtos: ${products.length}`, 40, 82);

    let y = 105;

    // Cabeçalho da Tabela
    doc.rect(40, y, doc.page.width - 80, 20).fill("#2F4A85");
    doc.fillColor("#FFFFFF").fontSize(8).font("Helvetica-Bold");
    doc.text("SKU", 45, y + 6, { width: 70 });
    doc.text("Nome", 115, y + 6, { width: 135 });
    doc.text("Categoria", 250, y + 6, { width: 80 });
    doc.text("Turno", 330, y + 6, { width: 55 });
    doc.text("Qtd.", 385, y + 6, { width: 45, align: "right" });
    doc.text("Mín.", 435, y + 6, { width: 45, align: "right" });
    doc.text("Status", 485, y + 6, { width: 65, align: "center" });

    y += 22;
    doc.font("Helvetica").fontSize(8);

    products.forEach((p, index) => {
      // Nova página se atingir o limite inferior
      if (y > 770) {
        doc.addPage();
        y = 40;
      }

      if (index % 2 === 1) {
        doc.rect(40, y - 2, doc.page.width - 80, 16).fill("#F8FAFC");
      }

      doc.fillColor("#1E293B");
      doc.text(p.sku, 45, y + 2, { width: 70 });
      doc.text(p.nome, 115, y + 2, { width: 135 });
      doc.text(p.categoria, 250, y + 2, { width: 80 });
      doc.text(p.turno, 330, y + 2, { width: 55 });
      doc.text(String(p.quantidade), 385, y + 2, { width: 45, align: "right" });
      doc.text(String(p.estoqueMinimo), 435, y + 2, { width: 45, align: "right" });

      const statusColor =
        p.status === "Crítico" ? "#DC2626" : p.status === "Baixo" ? "#D97706" : "#16A34A";
      doc
        .fillColor(statusColor)
        .font("Helvetica-Bold")
        .text(p.status, 485, y + 2, { width: 65, align: "center" });
      doc.font("Helvetica");

      y += 16;
    });

    doc.end();
  } catch (err) {
    return next(err);
  }
});

export default router;
