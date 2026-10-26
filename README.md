# ToolTrack

ToolTrack: controle de estoque e produção de ferramentas de usinagem.

## Sumário

- [Funcionalidades](#funcionalidades)
- [Tecnologias](#tecnologias)
- [Linguagens Utilizadas](#linguagens-utilizadas)
- [Arquitetura](#arquitetura)
- [Estrutura de Pastas](#estrutura-de-pastas)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [AWS Academy](#aws-academy)
- [Banco de Dados](#banco-de-dados)
- [Como Executar](#como-executar)
- [Simulação em Tempo Real](#simulação-em-tempo-real)
- [Scripts Disponíveis](#scripts-disponíveis)
- [Usuário Administrador Inicial](#usuário-administrador-inicial)
- [API](#api)
- [Autenticação e Perfis de Acesso](#autenticação-e-perfis-de-acesso)
- [Build de Produção do Frontend](#build-de-produção-do-frontend)
- [Solução de Problemas](#solução-de-problemas)
- [Segurança](#segurança)
- [Convenções do Projeto](#convenções-do-projeto)

## Funcionalidades

### Login
- Autenticação de usuários por e-mail e senha cadastrados.
- Emissão e armazenamento local do token JWT no navegador (`localStorage`).
- Exibição de alertas visuais para credenciais incorretas ou falhas de comunicação com a API.
- Redirecionamento automático de usuários não autenticados para a página de login.

### Dashboard
- Apresentação de quatro indicadores de desempenho (KPIs): Total Inventory Items, Low Stock Alerts, Active Machines e Maintenance Tasks.
- Exibição de variações percentuais e comparativos numéricos em relação a períodos anteriores.
- Seção de atalhos rápidos com acesso direto à área de controle de produção e produtos.
- Barra de filtros com seleção por Setor, Turno, Categoria e Data no formato brasileiro (`dd/mm/aaaa`).
- Gráficos nativos em SVG: distribuição de estoque por Categoria (gráfico de pizza com legenda) e volume de produção por Turno (gráfico de barras verticais).
- Barra de exportação com opções para download de relatórios nos formatos Excel (.xlsx) e PDF, além de acionamento do fluxo de impressão do navegador.
- Tabela de controle de estoque de ferramentas com código SKU, descrição, categoria, turno, setor, quantidade formatada no padrão brasileiro, data de cadastro e badges coloridos para status (Normal, Baixo, Crítico).

### Produção
- Visão geral do inventário operacional de esteiras e máquinas da planta fabril.
- Campo de pesquisa textual em tempo real para filtragem de máquinas por nome ou identificador.
- Listagem em grid com cards detalhados por equipamento (`MachineCard`), informando status operacional (ativa ou inativa), setor de alocação e métricas operacionais.
- Modal para inclusão de novas esteiras ou máquinas com validação de dados de entrada.
- Modal para edição dos dados cadastrais de máquinas existentes.
- Modal de confirmação para remoção de esteiras ou máquinas do catálogo.

### Perfil
- Exibição das informações do usuário logado: avatar com iniciais, nome completo, cargo e localização da planta.
- Apresentação detalhada de dados cadastrais: e-mail, telefone comercial, departamento de atuação e identificador funcional (ID Funcionário).
- Modal para atualização de dados do próprio perfil, incluindo nome, telefone, cargo, departamento, localização e redefinição de senha.

### Gerenciador de Usuários
- Acesso restrito a usuários com perfil de administrador.
- Formulário lateral para cadastro de novos usuários com definição de nome completo, e-mail, perfil de acesso (ADMIN ou USER) e senha com exigência mínima de 6 caracteres.
- Tabela com listagem completa de contas cadastradas, indicando avatar, nome, e-mail, badge de cargo, indicador de status de conexão (Online ou Offline) e botões de ação.
- Filtro de busca textual para localização rápida de contas por nome, e-mail ou cargo.
- Modal para edição de permissões, dados cadastrais, status e alteração de senha de usuários.
- Modal de confirmação para exclusão definitiva de contas de usuário.

### Produtos
- Consulta e monitoramento do estoque de ferramentas de usinagem integradas ao Dashboard e à API de produtos.
- Classificação automática de status de suprimento baseada no saldo atual em relação ao estoque mínimo cadastrado:
  - Crítico: quantidade menor ou igual a 25% do estoque mínimo.
  - Baixo: quantidade inferior ao estoque mínimo.
  - Normal: quantidade igual ou superior ao estoque mínimo.
- Suporte a filtros combinados por categoria, setor e turno obtidos a partir dos domínios da tabela de lookups.
- Exportação dos dados filtrados nos formatos de planilha eletrônica (XLSX) e documento para impressão (PDF).

## Tecnologias

### Frontend
| Tecnologia | Versão | Finalidade |
|---|---|---|
| vue | ^3.5.41 | Framework reativo para construção da interface de usuário em Single Page Application |
| vue-router | ^4.6.4 | Roteador oficial do Vue para gerenciamento de rotas e guardas de navegação |
| pinia | ^4.0.3 | Gerenciamento centralizado de estado global reativo da aplicação |
| lucide-vue-next | ^1.0.0 | Pacote de ícones SVG consistentes para interface |
| tailwindcss | ^4.3.3 | Framework de estilização baseado em classes utilitárias |
| @tailwindcss/vite | ^4.3.3 | Plugin oficial para integração e compilação do Tailwind CSS no Vite |
| vite | ^8.2.2 | Servidor de desenvolvimento rápido e ferramenta de build de produção |
| @vitejs/plugin-vue | ^6.0.8 | Suporte a Single File Components (.vue) no ambiente Vite |
| typescript | ^7.0.2 | Tipagem estática e validação de contratos no código do frontend |

### Backend
| Tecnologia | Versão | Finalidade |
|---|---|---|
| express | ^4.19.2 | Servidor HTTP e gerenciamento de rotas e middlewares REST |
| @aws-sdk/client-dynamodb | ^3.600.0 | Cliente oficial da AWS para operações no Amazon DynamoDB |
| @aws-sdk/lib-dynamodb | ^3.600.0 | Abstração Document Client para simplificar marshalling e queries no DynamoDB |
| bcryptjs | ^2.4.3 | Hashing criptográfico unidirecional para armazenamento seguro de senhas |
| jsonwebtoken | ^9.0.2 | Geração e verificação de tokens JWT para autenticação stateless |
| zod | ^3.23.8 | Validação de schemas e sanitização de dados de entrada da API |
| cors | ^2.8.5 | Middleware de configuração de Cross-Origin Resource Sharing |
| dotenv | ^16.4.5 | Carregamento de variáveis de ambiente a partir de arquivos .env |
| exceljs | ^4.4.0 | Geração de planilhas eletrônicas no formato XLSX para exportação |
| pdfkit | ^0.20.2 | Criação de documentos PDF programáticos para relatórios de estoque |
| tsx | ^4.16.0 | Executor TypeScript para Node.js com suporte a execução e reinicialização automática |
| typescript | ^5.5.0 | Compilador e verificador de tipos para o ecossistema backend |
| @types/node | ^20.14.0 | Definições de tipo para o ambiente de execução Node.js |
| @types/express | ^4.17.21 | Definições de tipo TypeScript para Express |
| @types/jsonwebtoken | ^9.0.6 | Definições de tipo TypeScript para jsonwebtoken |
| @types/bcryptjs | ^2.4.6 | Definições de tipo TypeScript para bcryptjs |
| @types/cors | ^2.8.17 | Definições de tipo TypeScript para cors |
| @types/pdfkit | ^0.17.6 | Definições de tipo TypeScript para pdfkit |

### Banco e Infraestrutura
| Tecnologia | Versão | Finalidade |
|---|---|---|
| Amazon DynamoDB | Gerenciado AWS | Banco de dados NoSQL gerenciado de chave-valor e documentos |
| AWS Academy Learner Lab | vLab | Ambiente de laboratório em nuvem com credenciais temporárias de sessão |

### Ferramentas de Desenvolvimento
| Tecnologia | Versão | Finalidade |
|---|---|---|
| Node.js | >= 20.x | Ambiente de execução JavaScript e TypeScript no servidor |
| npm | >= 10.x | Gerenciador de pacotes e dependências de software |
| Git | >= 2.x | Sistema de controle de versão distribuído |

## Linguagens Utilizadas

- **TypeScript (.ts)**: Empregado na lógica de negócio do frontend (serviços HTTP, stores do Pinia e contratos de tipos em `src/types/`) e em todo o código-fonte do backend (servidor Express, repositórios, serviços, middlewares e scripts de banco de dados).
- **Vue SFC (.vue)**: Empregado na construção das telas (`src/views/`), layouts estruturais (`src/layouts/`) e componentes reaproveitáveis (`src/components/`), reunindo template declarativo, lógica `<script setup lang="ts">` e estilização.
- **HTML (.html)**: Empregado no arquivo `index.html` na raiz do projeto como ponto de entrada da aplicação Single Page Application e elemento raiz de montagem do DOM.
- **CSS (.css)**: Empregado em `src/style.css` para importação da diretiva do Tailwind CSS, configuração de fontes e regras de mídia para impressão (`@media print`).
- **JavaScript de configuração (.js)**: Empregado nas configurações de compilação e estilos do ecossistema: `vite.config.js` (definição de plugins e alias de diretório `@`) e `tailwind.config.js` (paleta de cores, tipografia e espaçamentos do tema).

## Arquitetura

O sistema adota separação estrita de responsabilidades entre cliente e servidor. O navegador nunca se comunica diretamente com a nuvem da AWS; todas as requisições partem da camada de interface para a API Express, que valida a autenticação, aplica regras de negócio e aciona os repositórios integrados ao DynamoDB.

O fluxo de dados segue o seguinte percurso:
View -> Store (Pinia) -> Service (HTTP) -> API Express -> Repository -> DynamoDB

```text
+-----------------------+
|      View (.vue)      |  Interface reativa (ex: DashboardView, ProducaoView)
+-----------+-----------+
            | Disparam actions e consomem refs
            v
+-----------------------+
|     Store (Pinia)     |  Gerenciamento de estado (ex: dashboardStore, usuariosStore)
+-----------+-----------+
            | Invocam metodos assincronos
            v
+-----------------------+
|     Service HTTP      |  Cliente HTTP tipado (ex: api.ts, products.service.ts)
+-----------+-----------+
            | Requisicao HTTP (JSON com cabecalho Authorization: Bearer <token>)
            v
+-----------------------+
|      API Express      |  Roteamento, autenticacao JWT e validacao de dados com Zod
+-----------+-----------+
            | Repassa parametros sanitizados
            v
+-----------------------+
|   Repository (Node)   |  Execucao de operacoes DocumentClient (Query, Put, Update)
+-----------+-----------+
            | Comunicacao com a AWS via SDK oficial
            v
+-----------------------+
|    Amazon DynamoDB    |  Tabelas NoSQL provisionadas na regiao us-east-1
+-----------------------+
```

## Estrutura de Pastas

```text
ToolTrack/
├── .agents/                               # Customizacoes locais e definicoes de assistentes
│   └── skills/                            # Habilidades de orquestracao cadastradas
│       └── orquestrador-fullstack-vue/    # Diretrizes do orquestrador full-stack
├── .vscode/                               # Configuracoes do editor Visual Studio Code
├── backend/                               # Servidor da API Express e integracao com a AWS
│   └── src/                               # Codigo-fonte do backend em TypeScript
│       ├── config/                        # Configuracoes do cliente DynamoDB e checagem de conexao
│       ├── db/                            # Definicoes de esquemas de tabelas e indices secundarios
│       ├── middleware/                    # Middlewares de autenticacao, papeis, validacao e erros
│       ├── repositories/                  # Camada de acesso a dados e operacoes no DynamoDB
│       ├── routes/                        # Mapeamento de rotas e controladores HTTP REST
│       ├── scripts/                       # Scripts utilitarios para criacao de tabelas e seed
│       └── services/                      # Regras de negocio, agregacoes e calculos de estoque
├── public/                                # Ativos estaticos servidos diretamente pelo Vite
└── src/                                   # Codigo-fonte da aplicacao cliente Vue 3
    ├── assets/                            # Recursos graficos e logotipos da aplicacao
    ├── components/                        # Componentes reutilizaveis da interface
    │   ├── layout/                        # Componentes estruturais de cabecalho e menu lateral
    │   └── ui/                            # Componentes de UI como cards, tabelas, botoes e graficos
    ├── layouts/                           # Layouts mestres de envoltura das paginas
    ├── router/                            # Configuracao de rotas e guardas de navegacao
    ├── services/                          # Clientes HTTP e integracao com os endpoints da API
    ├── stores/                            # Stores reativas do Pinia com sintaxe Setup Store
    ├── types/                             # Definicoes de tipos e interfaces TypeScript compartilhadas
    └── views/                             # Componentes de tela correspondentes as rotas
```

## Pré-requisitos

- Node.js na versão 20.x ou superior.
- npm na versão 10.x ou superior.
- Git na versão 2.x ou superior.
- Conta de estudante ativa no AWS Academy com laboratório Learner Lab disponível.

## Instalação

A instalação das dependências deve ser executada separadamente para o frontend e para o backend, pois cada parte possui seu próprio arquivo `package.json`.

1. **Instalação das dependências do Frontend (raiz do projeto)**:
   Execute o comando na pasta raiz do repositório para instalar as bibliotecas do Vue 3, Vite, Tailwind CSS e utilitários:
   ```bash
   npm install
   ```

2. **Instalação das dependências do Backend (pasta backend/)**:
   Navegue até a pasta `backend/` e instale os módulos do servidor Express, SDK da AWS, Zod e geradores de relatório:
   ```bash
   cd backend
   npm install
   cd ..
   ```

## Variáveis de Ambiente

### Arquivo backend/.env
Localizado na pasta `backend/`. Armazena as configurações do servidor, segredos de autenticação e credenciais de acesso à AWS:

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `PORT` | Não | Porta TCP onde o servidor Express atenderá requisições (padrão: 3001) | `3001` |
| `FRONTEND_URL` | Não | Origem autorizada para requisições no middleware de CORS | `http://localhost:5173` |
| `AWS_REGION` | Não | Região da AWS onde as tabelas DynamoDB residem (padrão: us-east-1) | `us-east-1` |
| `AWS_ACCESS_KEY_ID` | Sim | Identificador da chave de acesso temporária do AWS Academy | `COLE_AQUI` |
| `AWS_SECRET_ACCESS_KEY` | Sim | Chave de acesso secreta temporária do AWS Academy | `COLE_AQUI` |
| `AWS_SESSION_TOKEN` | Sim | Token de sessão temporário emitido pelo AWS Academy | `COLE_AQUI` |
| `DYNAMO_TABLE_PREFIX` | Não | Prefixo aplicado aos nomes das tabelas no DynamoDB (padrão: tooltrack) | `tooltrack` |
| `JWT_SECRET` | Sim | Chave de segredo utilizada na assinatura e verificação dos tokens JWT | `troque-este-segredo-em-producao` |
| `JWT_EXPIRES_IN` | Não | Tempo de expiração do token de autenticação emitido no login | `8h` |
| `SEED_ADMIN_EMAIL` | Não | E-mail da conta de administrador criada pelo script de seed | `admin@tooltrack.com` |
| `SEED_ADMIN_PASSWORD` | Sim | Senha inicial cadastrada para o administrador no script de seed | `troque-esta-senha` |
| `SEED_ADMIN_NAME` | Não | Nome de exibição atribuído ao administrador inicial | `Administrador` |

### Arquivo .env (raiz do projeto)
Localizado na raiz do projeto. Informa ao cliente frontend o endereço base da API backend:

| Variável | Obrigatória | Descrição | Exemplo |
|---|---|---|---|
| `VITE_API_URL` | Sim | Endereço base da API consumida pelos serviços HTTP do frontend | `http://localhost:3001/api` |

Os arquivos `.env` contêm segredos e chaves confidenciais. Eles estão listados nos arquivos `.gitignore` correspondentes e nunca devem ser adicionados a commits do Git. Utilize o arquivo `backend/.env.example` como modelo de referência para configuração inicial.

## AWS Academy

Para conectar a aplicação ao Amazon DynamoDB utilizando as credenciais fornecidas pelo AWS Academy Learner Lab:

1. Acesse o console do AWS Academy e abra o curso atribuído.
2. No painel do laboratório Learner Lab, clique no botão **Start Lab** e aguarde até que o indicador fique verde (status "AWS status: ready").
3. Clique em **AWS Details** localizado na parte superior direita da tela.
4. Na linha correspondente a "AWS CLI", clique em **Show** para exibir as credenciais de sessão.
5. Copie os valores dos campos `aws_access_key_id`, `aws_secret_access_key` e `aws_session_token`.
6. Abra o arquivo `backend/.env` e substitua os valores correspondentes:
   ```env
   AWS_ACCESS_KEY_ID=COLE_AQUI
   AWS_SECRET_ACCESS_KEY=COLE_AQUI
   AWS_SESSION_TOKEN=COLE_AQUI
   ```
7. **Expiração das credenciais**: As sessões do AWS Academy possuem validade limitada e expiram automaticamente após o encerramento do lab (período de aproximadamente 4 horas).
8. **Procedimento ao expirar**: Caso a API retorne o erro `AWS_CREDENTIALS_EXPIRED` (código HTTP 503), inicie o lab novamente no painel do AWS Academy, copie as novas credenciais em **AWS Details**, atualize o arquivo `backend/.env` e reinicie o processo do backend no terminal.

## Banco de Dados

O projeto utiliza sete tabelas no Amazon DynamoDB, configuradas em modo de capacidade sob demanda (`PAY_PER_REQUEST`):

| Tabela | Chave de Partição (PK) | Chave de Ordenação (SK) | Índices Secundários Globais (GSIs) | Finalidade |
|---|---|---|---|---|
| `tooltrack-users` | `id` (S) | Nenhuma | `email-index` (PK: `email`) | Armazenamento de contas de usuários, papéis de acesso e senhas criptografadas |
| `tooltrack-products` | `sku` (S) | Nenhuma | `categoria-index` (PK: `categoria`, SK: `dataCadastro`)<br>`turno-index` (PK: `turno`, SK: `dataCadastro`)<br>`status-index` (PK: `status`, SK: `dataCadastro`) | Cadastro de ferramentas de usinagem, níveis de estoque e parâmetros de suprimento |
| `tooltrack-production` | `turno` (S) | `dataId` (S) | `data-index` (PK: `data`, SK: `dataId`) | Histórico de volumes produzidos organizados por turno e data |
| `tooltrack-machines` | `id` (S) | Nenhuma | `status-index` (PK: `status`) | Cadastro do parque fabril e cômputo do KPI de máquinas ativas |
| `tooltrack-maintenance` | `id` (S) | Nenhuma | `status-data-index` (PK: `status`, SK: `dataPrevista`) | Ordens de manutenção para cômputo do KPI de tarefas pendentes |
| `tooltrack-lookups` | `tipo` (S) | `valor` (S) | Nenhum | Relação de domínios fixos para alimentação de selects (Setor, Categoria, Turno) |
| `tooltrack-snapshots` | `metric` (S) | `data` (S) | Nenhum | Histórico de medições de métricas para cálculo de deltas comparativos nos KPIs |

### Criação das Tabelas
Para criar automaticamente todas as tabelas e índices secundários no DynamoDB, execute na pasta `backend/`:
```bash
npm run tables:create
```

### Carga Inicial de Dados (Seed)
- **Seed Básico**: Cadastra o usuário administrador inicial e as opções de domínio das tabelas de lookups:
  ```bash
  npm run seed
  ```
- **Seed Demonstrativo**: Popula o banco com ferramentas de exemplo, máquinas fabris, ordens de manutenção, apontamentos de produção e snapshots históricos:
  ```bash
  npm run seed -- --demo
  ```

## Como Executar

Para garantir o funcionamento integrado, inicie sempre o backend antes do frontend.

1. **Passo 1: Iniciar o Backend**
   Em um terminal, navegue até a pasta `backend/` e execute:
   ```bash
   cd backend
   npm run dev
   ```
   O servidor Express será iniciado em `http://localhost:3001`.

2. **Passo 2: Iniciar o Frontend**
   Em outro terminal, posicione-se na raiz do projeto e execute:
   ```bash
   npm run dev
   ```
   A interface web estará disponível em `http://localhost:5173`.

## Simulação em Tempo Real

O ToolTrack dispõe de um script dedicado (`backend/src/scripts/simulate.ts`) desenvolvido para simular a operação contínua de um chão de fábrica, inserindo e atualizando dados reais no Amazon DynamoDB.

### O que o simulador executa:
- **Apontamentos de Produção (`tooltrack-production`)**: Lançamentos periódicos de peças usinadas por turno (Manhã, Tarde, Noite), setor e máquina, atualizando em tempo real o gráfico de volume e produção.
- **Desgaste e Consumo de Ferramentas (`tooltrack-products`)**: Redução gradativa do saldo de pastilhas com recálculo imediato de status (`Normal`, `Baixo`, `Crítico`), disparando alertas no painel.
- **Recebimento de Lotes de Reposição (`tooltrack-products`)**: Simulação de chegada de insumos quando o estoque atinge faixas críticas, recompondo o saldo.
- **Telemetria e Estado das Máquinas (`tooltrack-machines`)**: Atualização dinâmica da eficiência global (OEE %), produção hora e alternância de status operacional (`ativa`, `parada`, `manutencao`).
- **Tarefas de Manutenção Preventiva (`tooltrack-maintenance`)**: Abertura e conclusão de ordens de serviço preventivas associadas a máquinas.

### Como Executar o Simulador:

Abra um terminal adicional (com o backend e o frontend em execução):

```bash
# Executar a partir da raiz do repositório:
npm run simulate

# Ou diretamente dentro da pasta backend:
cd backend
npm run simulate
```

### Opções e Parâmetros:

| Parâmetro | Padrão | Descrição | Exemplo de Uso |
|---|---|---|---|
| `--interval <ms>` | `3000` | Define a frequência (em milissegundos) dos eventos de simulação | `npm run simulate -- --interval 2000` |
| `--iterations <n>` | `infinito` | Limita o total de ciclos executados antes de encerrar automaticamente | `npm run simulate -- --iterations 60` |
| `--help` | - | Exibe as instruções de uso e parâmetros aceitos | `npm run simulate -- --help` |

> [!TIP]
> **Como acompanhar a atualização em tempo real no navegador:**  
> 1. Mantenha o navegador aberto na tela do **Dashboard** (`http://localhost:5173/`) ou em **Produção** (`http://localhost:5173/producao`).  
> 2. Ao lado, inicie o simulador no terminal com `npm run simulate`.  
> 3. Observe os contadores de KPI (**Armazenamento Total**, **Alerta de baixo estoque**, **Máquinas ativas** e **Tarefas de manutenção**), os gráficos em SVG e as linhas da tabela de ferramentas atualizando de forma suave e automática sem necessidade de recarregar a página manualmente (F5).  
> 4. Para interromper a simulação, pressione `Ctrl + C` no terminal do simulador.

## Scripts Disponíveis

### Raiz do Projeto (package.json)
| Script | Comando | Descrição |
|---|---|---|
| `dev` | `vite` | Inicia o servidor local de desenvolvimento do frontend |
| `backend` | `npm --prefix backend run dev` | Inicia o servidor backend Express diretamente a partir da raiz |
| `simulate` | `npm --prefix backend run simulate` | Executa o simulador de produção e estoque em tempo real |
| `build` | `vite build` | Compila a aplicação e gera o pacote estático otimizado na pasta dist/ |
| `preview` | `vite preview` | Executa um servidor HTTP local para inspecionar os arquivos gerados pelo build |

### Pasta backend/ (backend/package.json)
| Script | Comando | Descrição |
|---|---|---|
| `dev` | `tsx watch src/server.ts` | Executa o backend com reinicialização automática a cada alteração no código |
| `start` | `tsx src/server.ts` | Inicia a execução direta do servidor backend sem observador de alterações |
| `simulate` | `tsx src/scripts/simulate.ts` | Executa o simulador contínuo de produção, estoque e telemetria |
| `tables:create` | `tsx src/scripts/create-tables.ts` | Cria no DynamoDB todas as tabelas e índices ausentes definidos no projeto |
| `seed` | `tsx src/scripts/seed.ts` | Insere os dados iniciais de administrador e lookups (suporta flag --demo) |
| `aws:check` | `tsx -e "import('./src/config/aws').then(m=>m.assertAwsConnection()).then(()=>console.log('AWS OK'))"` | Verifica a validade das credenciais da AWS configuradas no arquivo backend/.env |

## Usuário Administrador Inicial

O primeiro administrador do sistema é gerado durante a execução do comando `npm run seed` na pasta `backend/`.

- As credenciais são lidas das variáveis de ambiente:
  - E-mail: definido em `SEED_ADMIN_EMAIL` (valor padrão: `admin@tooltrack.com`).
  - Senha: definida em `SEED_ADMIN_PASSWORD` (deve ser preenchida no arquivo `backend/.env`).
  - Nome: definido em `SEED_ADMIN_NAME` (valor padrão: `Administrador`).
- O script calcula o hash criptográfico da senha informada utilizando `bcryptjs` com custo 10 e armazena o registro na tabela `tooltrack-users` com a propriedade `role: "admin"` e `ativo: true`.
- Em seguida, utilize esse e-mail e essa senha para realizar o primeiro acesso através da tela de login em `http://localhost:5173/login`.

## API

Todos os endpoints da API estão expostos sob o prefixo `/api` (com aliases diretos sem prefixo para compatibilidade).

| Método | Rota | Autenticação Exigida | Descrição |
|---|---|---|---|
| `GET` | `/api/health` | Pública | Retorna o status operacional da API |
| `POST` | `/api/auth/login` | Pública | Autentica e-mail e senha, retornando token JWT e dados do usuário |
| `GET` | `/api/auth/me` | Bearer Token (JWT) | Recupera os dados cadastrais do usuário autenticado |
| `GET` | `/api/lookups` | Bearer Token (JWT) | Lista os valores de domínio cadastrados para Setor, Categoria e Turno |
| `GET` | `/api/dashboard` | Bearer Token (JWT) | Retorna os indicadores de KPI, dados para gráficos e lista de estoque filtrada |
| `GET` | `/api/products` | Bearer Token (JWT) | Lista os produtos do estoque com suporte a filtros e paginação |
| `GET` | `/api/products/:sku` | Bearer Token (JWT) | Recupera os dados detalhados de um produto pelo seu SKU |
| `POST` | `/api/products` | Bearer Token (JWT) | Cria um novo produto calculando automaticamente o status do estoque |
| `PUT` | `/api/products/:sku` | Bearer Token (JWT) | Atualiza os campos cadastrais e recalcula o status de um produto |
| `DELETE` | `/api/products/:sku` | Bearer Token (JWT) | Remove o produto informado do estoque |
| `GET` | `/api/production` | Bearer Token (JWT) | Consulta registros de produção por turno, data ou intervalo |
| `POST` | `/api/production` | Bearer Token (JWT) | Insere um novo apontamento de volume de produção |
| `GET` | `/api/machines` | Bearer Token (JWT) | Lista as máquinas e esteiras cadastradas com filtros de status e busca |
| `GET` | `/api/machines/:id` | Bearer Token (JWT) | Obtém os dados completos de uma máquina específica |
| `POST` | `/api/machines` | Bearer Token (JWT) | Cadastra uma nova esteira ou máquina no sistema |
| `PUT` | `/api/machines/:id` | Bearer Token (JWT) | Atualiza os dados operacionais de uma esteira ou máquina |
| `DELETE` | `/api/machines/:id` | Bearer Token (JWT) | Exclui uma esteira ou máquina do catálogo |
| `GET` | `/api/profile` | Bearer Token (JWT) | Consulta os dados de perfil do usuário logado |
| `PUT` | `/api/profile` | Bearer Token (JWT) | Atualiza as informações pessoais do perfil do usuário autenticado |
| `GET` | `/api/users` | Bearer Token + Admin | Lista todos os usuários cadastrados na aplicação |
| `POST` | `/api/users` | Bearer Token + Admin | Cadastra um novo operador ou administrador no sistema |
| `PUT` | `/api/users/:id` | Bearer Token + Admin | Atualiza dados, papel, status ou senha de um usuário específico |
| `DELETE` | `/api/users/:id` | Bearer Token + Admin | Remove a conta de um usuário do sistema |
| `GET` | `/api/export/products.xlsx` | Bearer Token (JWT) | Gera e faz stream de relatório do estoque em formato de planilha Excel |
| `GET` | `/api/export/products.pdf` | Bearer Token (JWT) | Gera e faz stream de relatório do estoque formatado em documento PDF |

## Autenticação e Perfis de Acesso

- **Padrão de Autenticação**: Autenticação baseada em JSON Web Token (JWT). Ao efetuar login no endpoint `POST /api/auth/login`, o servidor gera um token assinado com a chave `JWT_SECRET`, contendo no payload o identificador do usuário (`sub`), e-mail (`email`), papel (`role`) e nome (`nome`).
- **Envio do Token**: O cliente frontend armazena o token no `localStorage` e o injeta no cabeçalho `Authorization: Bearer <token>` em todas as requisições subsequentes via interceptor HTTP configurado em `src/services/api.ts`.
- **Perfis de Usuário**:
  - `admin`: Possui acesso irrestrito ao sistema, incluindo a visualização, cadastro, edição e exclusão de contas no Gerenciador de Usuários.
  - `operador` / `USER`: Possui permissão para visualização de dashboards, monitoramento de esteiras/máquinas, consulta de estoque e edição do próprio perfil.
- **Proteção no Frontend**: O roteador Vue Router (`src/router/index.ts`) intercepta todas as transições de página através de `router.beforeEach`. Usuários não autenticados são impedidos de acessar rotas internas e redirecionados para `/login`. Rotas que exigem perfil administrativo (como `/usuarios`) validam o papel armazenado e redirecionam usuários comuns de volta para o Dashboard.
- **Proteção no Backend**:
  - Middleware `requireAuth`: valida o token JWT presente no cabeçalho. Em caso de ausência, assinatura inválida ou prazo expirado, responde com status HTTP 401 (`UNAUTHORIZED`).
  - Middleware `requireRole("admin", "ADMIN")`: valida se o papel extraído do token corresponde ao perfil administrativo. Caso contrário, interrompe a requisição com status HTTP 403 (`FORBIDDEN`).

## Build de Produção do Frontend

Para compilar a aplicação frontend para publicação em ambiente de produção:

1. Na raiz do projeto, execute:
   ```bash
   npm run build
   ```
2. O Vite compilará os arquivos TypeScript, templates Vue e diretivas do Tailwind CSS, gerando os artefatos minificados na pasta `dist/`.
3. Para validar localmente os arquivos compilados antes do deploy:
   ```bash
   npm run preview
   ```

## Solução de Problemas

- **Credenciais expiradas (HTTP 503 AWS_CREDENTIALS_EXPIRED)**:
  - Causa: As credenciais de sessão do AWS Academy Learner Lab expiram periodicamente (a cada 4 horas aproximadamente).
  - Solução: Acesse o console do AWS Academy, clique em "Start Lab", abra "AWS Details" > "AWS CLI (Show)", copie as novas chaves, atualize as variáveis `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` e `AWS_SESSION_TOKEN` no arquivo `backend/.env` e reinicie o backend.
- **ResourceNotFoundException (tabelas não criadas)**:
  - Causa: As tabelas necessárias ainda não foram provisionadas no DynamoDB na região configurada (`us-east-1`).
  - Solução: Na pasta `backend/`, execute `npm run tables:create` para provisionar as tabelas e, em seguida, execute `npm run seed` para popular a base de dados.
- **Erro de CORS (Cross-Origin Resource Sharing)**:
  - Causa: A origem do cliente frontend difere da origem configurada no servidor backend.
  - Solução: Verifique se a variável `FRONTEND_URL` em `backend/.env` está configurada como `http://localhost:5173`. O servidor já aceita por padrão requisições de `http://localhost:5173` e `http://127.0.0.1:5173`.
- **Porta ocupada (EADDRINUSE)**:
  - Causa: Uma instância anterior do servidor Express ou do Vite continua rodando em segundo plano na porta 3001 ou 5173.
  - Solução: Encerre o processo ativo na porta pelo gerenciador de tarefas ou altere a porta desejada em `backend/.env` (`PORT=3002`), atualizando também a variável `VITE_API_URL` na raiz do projeto.
- **Tailwind sem aplicar estilos**:
  - Causa: Falha no carregamento do plugin do Tailwind no bundler ou escopo de arquivos incorreto.
  - Solução: Certifique-se de que `@tailwindcss/vite` está registrado na lista de plugins em `vite.config.js` e confirme que a diretiva de importação está presente no arquivo `src/style.css`.
- **Token JWT inválido ou expirado**:
  - Causa: O tempo de validade do token foi ultrapassado ou a chave `JWT_SECRET` foi alterada no backend após a emissão do token.
  - Solução: Realize logout na aplicação ou limpe o `localStorage` do navegador e refaça a autenticação na tela de login.

## Segurança

- Nunca inclua credenciais reais, chaves da AWS, senhas ou tokens de autenticação em repositórios de código ou commits do Git.
- Certifique-se de que os arquivos `backend/.env` e `.env` estejam listados nos arquivos `.gitignore` correspondentes.
- Substitua a chave `JWT_SECRET` por um valor longo, aleatório e exclusivo em qualquer implantação fora do ambiente de desenvolvimento.
- As senhas dos usuários nunca são armazenadas em texto puro; todas passam por processo de derivação e hash com algoritmo bcrypt antes de serem salvas no DynamoDB.
- O campo `passwordHash` é omitido nas consultas aos repositórios através de métodos sanitizadores e nunca é retornado em respostas da API.
- Toda a comunicação com o DynamoDB é isolada no backend; a aplicação cliente no navegador não possui credenciais da AWS nem executa comandos diretos no banco de dados.

## Convenções do Projeto

- **Componentes Vue**: Declarados em PascalCase (ex: `DashboardView.vue`, `MachineCard.vue`, `AppCard.vue`), utilizando a sintaxe `<script setup lang="ts">` e isolamento de um componente por arquivo.
- **Serviços e Stores**: Nomeados em camelCase com sufixo descritivo (ex: `products.service.ts`, `dashboardStore.ts`, `usuariosStore.ts`).
- **Funções e Variáveis**: Nomeadas em camelCase (ex: `filteredMachines`, `handleLogin`, `fetchDashboardData`).
- **Contratos de Tipo**: Centralizados estritamente no diretório `src/types/`, contendo apenas tipos e interfaces TypeScript sem lógica executável.
- **Formatação de Dados**:
  - Datas armazenadas no backend e no banco em formato ISO 8601 (`YYYY-MM-DD` ou `YYYY-MM-DDTHH:mm:ss.sssZ`).
  - Datas apresentadas na interface no formato brasileiro (`dd/mm/aaaa`).
  - Quantidades numéricas exibidas com separadores de milhar no padrão brasileiro (`pt-BR`).
- **Tratamento de Estados Assíncronos**: Todo fluxo de carregamento de dados na interface implementa três estados visuais explícitos: carregando (skeleton visual mantendo a estrutura), erro (mensagem amigável com opção para tentar novamente) e vazio (indicador textual de ausência de registros).
