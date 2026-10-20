
export interface UserProfile {
  PK: string
  id: string
  nome: string
  cargo: string
  localizacao: string
  email: string
  telefone: string
  departamento: string
  idFuncionario: string
  role?: string
  atualizadoEm?: string
}

export type UpdateProfilePayload = Partial<Omit<UserProfile, 'PK' | 'id' | 'idFuncionario' | 'role'>>
