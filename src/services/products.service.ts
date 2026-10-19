import { api } from './api'
import type {
  Product,
  ListProductsParams,
  ListProductsResponse,
  CreateProductPayload,
  UpdateProductPayload
} from '@/types/products'

export const productsService = {
  async listProducts(params: ListProductsParams = {}): Promise<ListProductsResponse> {
    const query = new URLSearchParams()
    if (params.setor) query.append('setor', params.setor)
    if (params.turno) query.append('turno', params.turno)
    if (params.categoria) query.append('categoria', params.categoria)
    if (params.status) query.append('status', params.status)
    if (params.search) query.append('search', params.search)
    if (params.limit) query.append('limit', String(params.limit))
    if (params.cursor) query.append('cursor', params.cursor)

    const qs = query.toString() ? `?${query.toString()}` : ''
    return api.get<ListProductsResponse>(`/products${qs}`)
  },

  async getProduct(sku: string): Promise<Product> {
    const res = await api.get<{ product: Product }>(`/products/${sku}`)
    return res.product || (res as unknown as Product)
  },

  async createProduct(payload: CreateProductPayload): Promise<Product> {
    const res = await api.post<{ product: Product }>('/products', payload)
    return res.product || (res as unknown as Product)
  },

  async updateProduct(sku: string, payload: UpdateProductPayload): Promise<Product> {
    const res = await api.put<{ product: Product }>(`/products/${sku}`, payload)
    return res.product || (res as unknown as Product)
  },

  async deleteProduct(sku: string): Promise<{ ok: boolean; message: string }> {
    return api.delete<{ ok: boolean; message: string }>(`/products/${sku}`)
  }
}
