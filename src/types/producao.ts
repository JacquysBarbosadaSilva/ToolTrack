/**
 * Tipagens e Modelos de Dados para a Gestão de Produção e Máquinas/Esteiras
 * Preparadas para o modelo NoSQL AWS DynamoDB
 * 
 * Exemplo de formato NoSQL planejado:
 * PK: MACHINE#<id>
 * SK: METADATA#<id>
 */

export type MachineStatus = 'Operacional' | 'Parada' | 'Manutenção' | 'Setup'

export interface Machine {
  PK?: string // Chave Primária NoSQL DynamoDB (ex: MACHINE#MCH-1024)
  id: string // Chave/Código da Máquina (ex: MCH-1024)
  name: string // Nome descritivo (ex: Esteira A-1)
  status: MachineStatus
  producaoHora: string // ex: "1,240 unid." ou "--"
  eficienciaOEE: string // ex: "94%" ou "--"
  extraInfo: string // ex: "Última manutenção: 02/10/2023", "Erro sensor L2", "Preventiva em andamento", "Ajuste de formato"
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

