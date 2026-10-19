export type ProductStatus = 'Normal' | 'Baixo' | 'Crítico'

export interface Product {
  sku: string
  nome: string
  categoria: string
  turno: string
  setor: string
  quantidade: number
  estoqueMinimo: number
  unidade?: string
  status: ProductStatus
  dataCadastro: string
  createdAt?: string
  updatedAt?: string
}

export interface ListProductsParams {
  setor?: string
  turno?: string
  categoria?: string
  status?: string
  search?: string
  limit?: number
  cursor?: string
}

export interface ListProductsResponse {
  items: Product[]
  nextCursor: string | null
}

export interface CreateProductPayload {
  sku: string
  nome: string
  categoria: string
  turno: string
  setor: string
  quantidade: number
  estoqueMinimo: number
  unidade?: string
  dataCadastro?: string
}

export type UpdateProductPayload = Partial<Omit<CreateProductPayload, 'sku'>>
