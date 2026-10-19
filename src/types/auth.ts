/**
 * Definições de Tipagem e Estrutura de Entidades
 * Preparadas para futura modelagem de chave/valor no AWS DynamoDB
 *
 * Exemplo de formato NoSQL planejado:
 * PK: USER#<id>
 * SK: METADATA#<id>
 */

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

