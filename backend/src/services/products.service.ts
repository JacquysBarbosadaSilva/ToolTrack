import { AppError } from "../middleware/errorHandler";
import * as productsRepository from "../repositories/products.repository";
import type { ProductRecord, ListProductsQuery } from "../repositories/products.repository";

export function calculateProductStatus(
  quantidade: number,
  estoqueMinimo: number
): "Normal" | "Baixo" | "Crítico" {
  if (quantidade <= estoqueMinimo * 0.25) return "Crítico";
  if (quantidade < estoqueMinimo) return "Baixo";
  return "Normal";
}

export interface CreateProductInput {
  sku: string;
  nome: string;
  categoria: string;
  turno: string;
  setor: string;
  quantidade: number;
  estoqueMinimo: number;
  unidade?: string;
  dataCadastro?: string;
}

export interface UpdateProductInput {
  nome?: string;
  categoria?: string;
  turno?: string;
  setor?: string;
  quantidade?: number;
  estoqueMinimo?: number;
  unidade?: string;
  dataCadastro?: string;
}

export async function createProduct(input: CreateProductInput): Promise<ProductRecord> {
  const sku = input.sku.trim().toUpperCase();
  const now = new Date().toISOString();
  const dataCadastro = input.dataCadastro || now.slice(0, 10);
  const status = calculateProductStatus(input.quantidade, input.estoqueMinimo);

  const product: ProductRecord = {
    sku,
    nome: input.nome.trim(),
    categoria: input.categoria.trim(),
    turno: input.turno.trim(),
    setor: input.setor.trim(),
    quantidade: input.quantidade,
    estoqueMinimo: input.estoqueMinimo,
    unidade: input.unidade || "un",
    status,
    dataCadastro,
    createdAt: now,
    updatedAt: now,
  };

  try {
    return await productsRepository.create(product);
  } catch (err: any) {
    if (err?.name === "ConditionalCheckFailedException") {
      throw new AppError(409, "PRODUCT_ALREADY_EXISTS", `Produto com SKU ${sku} já existe.`);
    }
    throw err;
  }
}

export async function getProductBySku(skuParam: string): Promise<ProductRecord> {
  const sku = skuParam.trim().toUpperCase();
  const product = await productsRepository.findBySku(sku);

  if (!product) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", `Produto com SKU ${sku} não encontrado.`);
  }

  return product;
}

export async function updateProduct(
  skuParam: string,
  input: UpdateProductInput
): Promise<ProductRecord> {
  const sku = skuParam.trim().toUpperCase();
  const existing = await productsRepository.findBySku(sku);

  if (!existing) {
    throw new AppError(404, "PRODUCT_NOT_FOUND", `Produto com SKU ${sku} não encontrado.`);
  }

  const quantidade = input.quantidade !== undefined ? input.quantidade : existing.quantidade;
  const estoqueMinimo = input.estoqueMinimo !== undefined ? input.estoqueMinimo : existing.estoqueMinimo;
  const status = calculateProductStatus(quantidade, estoqueMinimo);
  const now = new Date().toISOString();

  const updated: ProductRecord = {
    ...existing,
    nome: input.nome !== undefined ? input.nome.trim() : existing.nome,
    categoria: input.categoria !== undefined ? input.categoria.trim() : existing.categoria,
    turno: input.turno !== undefined ? input.turno.trim() : existing.turno,
    setor: input.setor !== undefined ? input.setor.trim() : existing.setor,
    unidade: input.unidade !== undefined ? input.unidade : existing.unidade,
    dataCadastro: input.dataCadastro !== undefined ? input.dataCadastro : existing.dataCadastro,
    quantidade,
    estoqueMinimo,
    status,
    updatedAt: now,
  };

  try {
    return await productsRepository.update(updated);
  } catch (err: any) {
    if (err?.name === "ConditionalCheckFailedException") {
      throw new AppError(404, "PRODUCT_NOT_FOUND", `Produto com SKU ${sku} não encontrado.`);
    }
    throw err;
  }
}

export async function deleteProduct(skuParam: string): Promise<void> {
  const sku = skuParam.trim().toUpperCase();

  try {
    await productsRepository.deleteBySku(sku);
  } catch (err: any) {
    if (err?.name === "ConditionalCheckFailedException") {
      throw new AppError(404, "PRODUCT_NOT_FOUND", `Produto com SKU ${sku} não encontrado.`);
    }
    throw err;
  }
}

export async function listProducts(params: ListProductsQuery) {
  return productsRepository.list(params);
}
