
export type UserRole = 'ADMIN' | 'USER' | string
export type UserStatus = 'Online' | 'Offline'

export interface UserAccount {
  PK?: string
  id: string
  name: string
  nome?: string
  email: string
  role: UserRole
  status?: UserStatus
  ativo?: boolean
  cargo?: string
  departamento?: string
  localizacao?: string
  telefone?: string
  idFuncionario?: string
  password?: string
  createdAt?: string
  updatedAt?: string
}

export interface NewUserPayload {
  name: string
  nome?: string
  email: string
  role: UserRole
  password?: string
  status?: UserStatus
  cargo?: string
  departamento?: string
  localizacao?: string
  telefone?: string
  ativo?: boolean
}

export type UpdateUserPayload = Partial<Omit<UserAccount, 'id'>>

