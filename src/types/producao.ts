
export type MachineStatus = 'Operacional' | 'Parada' | 'Manutenção' | 'Setup'

export interface Machine {
  PK?: string
  id: string
  name: string
  status: MachineStatus
  producaoHora: string
  eficienciaOEE: string
  extraInfo: string
  setor?: string
  responsavel?: string
  atualizadoEm?: string
}

export interface NewMachinePayload {
  id: string
  name: string
  status: MachineStatus
  producaoHora?: string
  eficienciaOEE?: string
  extraInfo: string
  setor?: string
}

export interface ProductionRecord {
  id: string
  turno: 'Manhã' | 'Tarde' | 'Noite' | string
  data: string
  dataId: string
  setor: string
  categoria: string
  quantidade: number
  maquinaId?: string
  createdAt?: string
}

export interface CreateProductionPayload {
  turno: 'Manhã' | 'Tarde' | 'Noite' | string
  data: string
  quantidade: number
  setor: string
  categoria: string
  maquinaId?: string
}
