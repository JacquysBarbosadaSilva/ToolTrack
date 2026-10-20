
export interface User {
  id: string
  name?: string
  nome?: string
  email: string
  role: string
  ativo?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface LoginCredentials {
  email: string
  password?: string
  name?: string
}
