/**
 * Tipagens para o Módulo de Perfil de Usuário
 * Preparadas para a entidade UserProfile no AWS DynamoDB
 * 
 * PK: USER#<idFuncionario>
 * SK: PROFILE
 */

export interface UserProfile {
  PK: string // Chave Primária NoSQL (ex: USER#EMP-8842-A)
  id: string // Chave de busca / compatibilidade
  nome: string // Admin
  cargo: string // Admin
  localizacao: string // Setor Norte - Planta 4
  email: string // admin@email.com
  telefone: string // +55 11 99999-9999
  departamento: string // Operações de Chão de Fábrica
  idFuncionario: string // EMP-8842-A
  role?: string
  atualizadoEm?: string
}

export type UpdateProfilePayload = Partial<Omit<UserProfile, 'PK' | 'id' | 'idFuncionario' | 'role'>>

