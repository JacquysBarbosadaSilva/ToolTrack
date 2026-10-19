/**
 * Tipagens para o Módulo de Gerenciamento de Usuários
 * Preparadas para o modelo NoSQL AWS DynamoDB
 * 
 * PK: USER#<id>
 * SK: METADATA
 */

export type UserRole = 'ADMIN' | 'USER'
export type UserStatus = 'Online' | 'Offline'

export interface UserAccount {
  PK: string // Identificador único DynamoDB (ex: USER#001)
  id: string // Identificador para compatibilidade (ex: USER#001)
  name: string
  email: string
  role: UserRole
  status: UserStatus
  password?: string
  createdAt?: string
}

export interface NewUserPayload {
  name: string
  email: string
  role: UserRole
  password?: string
  status?: UserStatus
}

export type UpdateUserPayload = Partial<Omit<UserAccount, 'id'>>
