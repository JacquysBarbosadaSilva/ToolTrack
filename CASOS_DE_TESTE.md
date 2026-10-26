# 6. CASOS DE TESTES (ToolTrack - SENAI Taubaté)

Este documento apresenta a especificação completa da suíte de **Casos de Testes (CT)** do sistema **ToolTrack**, elaborada a partir da **Especificação dos Requisitos de Software (ERS v2.1)** e das **Regras de Negócio (RN)** da DDA Usinagem Industrial Ltda.

---

## 1. Matriz de Rastreabilidade de Requisitos e Testes

| ID do Teste | Requisito Principal | Regras de Negócio Associadas | Tipo de Teste | Objetivo Principal |
|---|---|---|---|---|
| **CT-RF01-01** | RF01 | RN06, RN07 | Funcional (Caminho Feliz) | Coleta/leitura simulada de pastilhas com atualização automática de saldo |
| **CT-RF01-02** | RF01 | RN08 | Exceção (FE01) | Rejeição de leitura de quantidade negativa ou fora da capacidade máxima |
| **CT-RF01-03** | RF01 | RN01 | Exceção (FE02) | Tentativa de leitura para item sem associação a produto cadastrado |
| **CT-RF01-04** | RF01 | - | Alternativo (FA01) | Execução de leitura manual de contingência após falha da simulação |
| **CT-RF02-01** | RF02 | RN06, RN07, RN08, RN12 | Funcional (Caminho Feliz) | Registro manual de entrada de estoque e incremento de quantidade |
| **CT-RF02-02** | RF02 | RN08 | Exceção (FE01) | Tentativa de registro de entrada com quantidade zero ou negativa |
| **CT-RF02-03** | RF02 | RN01 | Exceção (FE02) | Tentativa de movimentação com pastilha inexistente no catálogo |
| **CT-RF02-04** | RF02 | RN09, RN10, RN12, RN16 | Funcional (FA01) | Registro de saída de estoque com saldo suficiente e decremento automático |
| **CT-RF02-05** | RF02 | RN11 | Exceção (FE03) | Tentativa de saída com quantidade superior ao saldo em estoque (saldo insuficiente) |
| **CT-RF02-06** | RF02 | RN04, RN12 | Alternativo (FA02) | Cadastro ágil de novo fornecedor durante o fluxo de entrada |
| **CT-RF02-07** | RF02 | RN13 | Regra de Negócio (RN13) | Garantia de imutabilidade: proibição de exclusão de movimentações |
| **CT-RF03-01** | RF03 | RN12, RN20 | Funcional (Caminho Feliz) | Listagem do histórico em ordem cronológica inversa (mais recentes primeiro) |
| **CT-RF03-02** | RF03 | RN20 | Funcional (Filtros) | Filtragem de histórico por produto, período e tipo de movimentação |
| **CT-RF03-03** | RF03 | RN18 | Alternativo (FA02) | Exportação de dados do histórico nos formatos CSV e PDF |
| **CT-RF03-04** | RF03 | - | Exceção (FE01) | Mensagem de feedback quando nenhum registro corresponde aos filtros |
| **CT-RF04-01** | RF04 | RN18 | Funcional (Caminho Feliz) | Geração de relatório de movimentação com intervalo de datas obrigatório |
| **CT-RF04-02** | RF04 | RN18 | Exceção (Validação) | Bloqueio de geração de relatório de movimentação sem preenchimento de período |
| **CT-RF04-03** | RF04 | RN18 | Exceção (FE01) | Exibição de aviso quando não há dados no período selecionado |
| **CT-RF05-01** | RF05 | RN18 | Funcional (Caminho Feliz) | Geração do relatório analítico de consumo com taxa acumulada e gráficos |
| **CT-RF05-02** | RF05 | RN18, RN20 | Funcional (Filtro) | Relatório de consumo filtrado por tipo de ferramenta específico |
| **CT-RF05-03** | RF05 | RN18 | Exceção (FE01) | Consulta de consumo em período sem movimentações de saída |
| **CT-RF06-01** | RF06 | RN03, RN18 | Funcional (Caminho Feliz) | Geração de lista prioritária de reposição com cálculo de compra sugerida |
| **CT-RF06-02** | RF06 | RN03 | Exceção (FE01) | Feedback amigável quando todos os produtos estão acima do nível de segurança |
| **CT-RF07-01** | RF07 | - | Funcional (Caminho Feliz) | Consulta de quantidade em estoque e nível mínimo por código SKU ou nome |
| **CT-RF07-02** | RF07 | - | Exceção (FE01) | Mensagem de retorno quando código ou nome de pastilha não for localizado |
| **CT-RF08-01** | RF08 | RN19 | Funcional (Caminho Feliz) | Exibição do Dashboard geral com os 4 KPIs e gráficos SVG de categoria e turno |
| **CT-RF08-02** | RF08 | RN19, RN20 | Alternativo (FA01) | Filtragem do Dashboard por status operacional (Normal, Baixo, Crítico) |
| **CT-RF08-03** | RF08 | RN19 | Exceção (FE01) | Exibição de estado vazio informativo quando não há itens cadastrados |
| **CT-RF09-01** | RF09 | RN07, RN10 | Funcional (Tempo Real) | Recálculo automático do saldo disponível após evento de transação |
| **CT-RF09-02** | RF09 | - | Exceção / Concorrência (FE02) | Tratamento ordenado de duas atualizações concorrentes no mesmo SKU |
| **CT-RF09-03** | RF09 | - | Exceção (FE01) | Log de auditoria para tentativa de atualização de item não localizado |
| **CT-RF10-01** | RF10 | RN03 | Funcional (Caminho Feliz) | Disparo imediato de alerta visual quando saldo <= nível mínimo de estoque |
| **CT-RF10-02** | RF10 | - | Alternativo (FA01) | Processamento de item com nível mínimo não configurado (sem falso positivo) |
| **CT-RF10-03** | RF10 | RN12 | Funcional / Auditoria | Registro do histórico de alertas de estoque disparados |
| **CT-RF11-01** | RF11 | RN01, RN02 | Funcional (Caminho Feliz) | Cadastro de novo tipo de pastilha com código único e estoque mínimo padrão |
| **CT-RF11-02** | RF11 | RN01 | Exceção (FE01) | Bloqueio e mensagem de erro ao tentar cadastrar código SKU duplicado |
| **CT-RF11-03** | RF11 | - | Alternativo (FA01) | Edição de especificações de uma pastilha existente com persistência |
| **CT-RF11-04** | RF11 | RN12 | Alternativo (FA02) | Inativação de pastilha sem perda de histórico de rastreabilidade |
| **CT-RF12-01** | RF12 | RN04 | Funcional (Caminho Feliz) | Cadastro de fornecedor com Razão Social, CNPJ/CPF e dados de contato |
| **CT-RF12-02** | RF12 | RN04 | Exceção (FE01) | Rejeição de cadastro duplicado para mesmo CNPJ/identificador |
| **CT-RF12-03** | RF12 | RN05 | Regra de Negócio (RN05) | Inativação de fornecedor impedindo novas operações sem apagar histórico |
| **CT-RF13-01** | RF13 | RN03 | Funcional (Caminho Feliz) | Configuração individual de novo nível mínimo para pastilha |
| **CT-RF13-02** | RF13 | RN03 | Exceção (FE01) | Rejeição de nível mínimo negativo ou não numérico |
| **CT-RF13-03** | RF13 | RN03 | Alternativo (FA01) | Aplicação em lote de nível mínimo comum para múltiplos produtos |
| **CT-RF14-01** | RF14 | RNF04, RNF05 | Funcional (Caminho Feliz) | Login com credenciais válidas, geração de token JWT e redirecionamento |
| **CT-RF14-02** | RF14 | RNF05 | Exceção (FE01) | Bloqueio de acesso e mensagem de erro para credenciais incorretas (HTTP 401) |
| **CT-RF14-03** | RF14 | RNF05 | Exceção | Rejeição de credenciais em formato inválido ou usuário inativo no sistema |
| **CT-RF15-01** | RF15 | - | Funcional (Caminho Feliz) | Cadastro de esteira/máquina com ID único, capacidade e setor fabril |
| **CT-RF15-02** | RF15 | - | Exceção (FE01) | Rejeição de cadastro de máquina com campos obrigatórios ausentes |
| **CT-RF15-03** | RF15 | - | Funcional | Alteração de status operacional da máquina (ativa, parada, manutenção) |
| **CT-RN14-01** | RF02 | RN14, RN15, RN17 | Regra de Negócio (Ajuste) | Ajuste manual de estoque por Administrador com justificativa obrigatória |
| **CT-RN17-01** | RF02 | RN16, RN17 | Segurança / Permissão | Bloqueio de ajuste de estoque para usuários sem perfil de Administrador |
| **CT-RNF01-01**| RNF01| - | Usabilidade | Operador conclui registro de movimentação em menos de 2 minutos sem suporte |
| **CT-RNF03-01**| RNF03| - | Compatibilidade / Layout | Ajuste automático e responsividade em resoluções Desktop e Mobile |
| **CT-RNF04-01**| RNF04| - | Segurança | Verificação de hash bcrypt para senhas e tráfego HTTPS sem exposição de chaves |
| **CT-RNF05-01**| RNF05| - | Segurança / Acesso | Acesso direto a rotas protegidas sem token redireciona para login |
| **CT-RNF07-01**| RNF07| - | Desempenho | Tempo de resposta de requisições de dashboard e estoque inferior a 2 segundos |
| **CT-RNF08-01**| RNF08| - | Manutenibilidade | Separação rigorosa entre View, Store, Service, API, Repositories e DynamoDB |

---

## 2. Especificação Detalhada dos Casos de Testes Funcionais

### RF01 - Coletar/Simular Dados de Leitura de Estoque

#### [CT-RF01-01] Coleta/leitura simulada de pastilhas com sucesso
- **Requisitos Associados:** RF01, RF09, RN06, RN07
- **Tipo:** Funcional (Caminho Feliz)
- **Pré-condições:** Usuário autenticado como Operador de Estoque; produto `PST-001` (Pastilha CNMG 120408) previamente cadastrado com saldo inicial de 100 unidades.
- **Passos de Execução:**
  1. Acessar a interface de leitura/simulação de estoque.
  2. Selecionar o ponto de leitura associado ao produto `PST-001`.
  3. Informar ou confirmar a quantidade observada de `25` unidades.
  4. Clicar no botão "Confirmar Leitura".
- **Dados de Entrada:** `sku`: "PST-001", `quantidade`: 25, `tipoOrigem`: "SIMULADOR".
- **Resultado Esperado:** O sistema valida os dados através do Subfluxo [SF01], associa a leitura ao produto, grava no histórico com timestamp e usuário, e dispara o RF09 incrementando o saldo para `125` unidades.
- **Pós-condições:** Saldo atualizado no banco DynamoDB e exibido no painel.

#### [CT-RF01-02] Leitura com valor negativo ou desproporcional (FE01)
- **Requisitos Associados:** RF01, RN08
- **Tipo:** Negativo / Exceção
- **Pré-condições:** Interface de simulação aberta; produto `PST-001` selecionado.
- **Passos de Execução:**
  1. No campo de leitura, inserir o valor `-10` ou valor exorbitante superior à capacidade máxima (ex: `99999999`).
  2. Clicar em "Confirmar Leitura".
- **Dados de Entrada:** `quantidade`: -10.
- **Resultado Esperado:** O sistema identifica valor fora da faixa permitida no passo 1 do [SF01], descarta a operação, impede atualização do banco e emite o alerta visual: *"Leitura fora da faixa permitida. Registro descartado."*
- **Pós-condições:** Saldo de `PST-001` inalterado.

#### [CT-RF01-03] Leitura com produto não cadastrado no sistema (FE02)
- **Requisitos Associados:** RF01, RN01
- **Tipo:** Negativo / Exceção
- **Pré-condições:** Ponto de leitura envia SKU inexistente no cadastro.
- **Passos de Execução:**
  1. Enviar payload de leitura simulada informando o SKU `PST-999` (não cadastrado).
- **Dados de Entrada:** `sku`: "PST-999", `quantidade`: 15.
- **Resultado Esperado:** O passo 2 do [SF01] identifica a ausência do produto, armazena o evento na fila de pendências para auditoria e gera notificação ao administrador.
- **Pós-condições:** Nenhuma alteração no saldo de outros itens.

#### [CT-RF01-04] Execução de leitura manual de contingência (FA01)
- **Requisitos Associados:** RF01
- **Tipo:** Alternativo
- **Pré-condições:** Simulador de contagem indisponível ou desconectado.
- **Passos de Execução:**
  1. Acessar a tela de contingência manual.
  2. Preencher manualmente o SKU `PST-001` e a quantidade física contada `30`.
  3. Confirmar o formulário.
- **Dados de Entrada:** `sku`: "PST-001", `quantidade`: 30, `modo`: "MANUAL_CONTINGENCIA".
- **Resultado Esperado:** O sistema aciona o Subfluxo [SF01], valida a consistência e consolida a contagem no histórico com a flag de contingência.
- **Pós-condições:** Histórico sinalizado como preenchimento manual.

---

### RF02 - Registro de Entradas e Saídas de Estoque

#### [CT-RF02-01] Registro de entrada de pastilhas com sucesso
- **Requisitos Associados:** RF02, RF09, RN06, RN07, RN08, RN12
- **Tipo:** Funcional (Caminho Feliz)
- **Pré-condições:** Usuário com perfil de Operador autenticado; produto `PST-001` com saldo atual `50`; fornecedor `FORN-001` (Sandvik Coromant) ativo.
- **Passos de Execução:**
  1. Clicar na ação "Registrar Movimentação".
  2. Selecionar o tipo de operação: "Entrada".
  3. Selecionar a pastilha `PST-001`.
  4. Informar a quantidade `50`.
  5. Selecionar o fornecedor `FORN-001`.
  6. Inserir a descrição: "Recebimento NF 10420".
  7. Confirmar o registro.
- **Dados de Entrada:**
  - `tipo`: "ENTRADA"
  - `sku`: "PST-001"
  - `quantidade`: 50
  - `fornecedorId`: "FORN-001"
  - `descricao`: "Recebimento NF 10420"
- **Resultado Esperado:** O sistema valida os campos obrigatórios (SF01), grava o registro com data/hora e ID do operador, atualiza o saldo para `100` unidades (+50) e exibe mensagem de sucesso: *"Entrada registrada com sucesso!"*.
- **Pós-condições:** Saldo incrementado e entrada visível no histórico de movimentações.

#### [CT-RF02-02] Tentativa de entrada com quantidade zero ou negativa (FE01 / RN08)
- **Requisitos Associados:** RF02, RN08
- **Tipo:** Negativo / Exceção
- **Pré-condições:** Operador no formulário de entrada.
- **Passos de Execução:**
  1. Selecionar produto `PST-001`.
  2. Informar quantidade `0` (zero) ou `-15`.
  3. Clicar em "Confirmar Registro".
- **Dados de Entrada:** `quantidade`: 0.
- **Resultado Esperado:** O sistema barra o envio com feedback em tela: *"Quantidade inválida. Informe um valor numérico maior que zero."* (HTTP 400).
- **Pós-condições:** Nenhuma movimentação é gravada e o formulário permanece aberto com foco no campo.

#### [CT-RF02-03] Registro de saída com saldo suficiente (FA01 / RN09 / RN10)
- **Requisitos Associados:** RF02, RF09, RN09, RN10, RN12
- **Tipo:** Funcional (Alternativo FA01)
- **Pré-condições:** Usuário autenticado; produto `PST-001` com saldo `100`.
- **Passos de Execução:**
  1. Clicar em "Registrar Movimentação".
  2. Selecionar o tipo "Saída".
  3. Selecionar `PST-001`.
  4. Informar quantidade `20` e motivo "Alocação na Máquina Esteira A-1".
  5. Confirmar.
- **Dados de Entrada:** `tipo`: "SAIDA", `sku`: "PST-001", `quantidade`: 20, `motivo`: "Alocação na Máquina Esteira A-1".
- **Resultado Esperado:** Validação de saldo aprovada; registro gravado; saldo decrementado para `80` unidades (100 - 20); notificação de sucesso exibida.
- **Pós-condições:** Saldo reduzido e registro auditável criado.

#### [CT-RF02-04] Tentativa de saída superior ao saldo disponível (FE03 / RN11)
- **Requisitos Associados:** RF02, RN11
- **Tipo:** Negativo / Exceção (FE03)
- **Pré-condições:** Produto `PST-001` possui saldo atual de `15` unidades.
- **Passos de Execução:**
  1. Iniciar registro de saída para `PST-001`.
  2. Informar quantidade `20` (superior ao saldo de 15).
  3. Confirmar a operação.
- **Dados de Entrada:** `sku`: "PST-001", `quantidade`: 20.
- **Resultado Esperado:** O passo 4 de [SF01] intercepta o saldo insuficiente e exibe a mensagem de bloqueio: *"Saldo insuficiente. Saldo disponível: 15 unidades."*. A transação é abortada.
- **Pós-condições:** Saldo mantido em `15`.

#### [CT-RF02-05] Imutabilidade do histórico - Não exclusão de movimentações (RN13)
- **Requisitos Associados:** RF02, RF03, RN13
- **Tipo:** Integridade de Dados / Regra de Negócio
- **Pré-condições:** Movimentação registrada existente no banco de dados.
- **Passos de Execução:**
  1. Acessar o histórico de movimentações como usuário Operador ou Administrador.
  2. Verificar as opções disponíveis na linha da movimentação.
  3. Disparar requisição manual direta `DELETE /api/movements/:id` (ou equivalente).
- **Resultado Esperado:** A interface gráfica não disponibiliza botão de exclusão. A API rejeita requisições de exclusão com código HTTP 405 (Method Not Allowed) ou 403 (Forbidden), garantindo a regra RN13.
- **Pós-condições:** O registro permanece inalterado no banco NoSQL.

---

### RF03 - Disponibilizar Histórico de Movimentações do Estoque

#### [CT-RF03-01] Consulta ao histórico com ordenação cronológica decrescente
- **Requisitos Associados:** RF03, RN12
- **Tipo:** Funcional (Caminho Feliz)
- **Pré-condições:** Existência de pelo menos 3 movimentações registradas em datas/horários diferentes.
- **Passos de Execução:**
  1. Acessar a tela "Histórico de Movimentações".
- **Resultado Esperado:** A tabela carrega listando as movimentações com as mais recentes exibidas no topo (ordem cronológica inversa). Cada linha exibe data/hora, tipo (Entrada/Saída), SKU, descrição, quantidade e usuário responsável.
- **Pós-condições:** Dados renderizados corretamente na interface.

#### [CT-RF03-02] Aplicação de filtros combinados no histórico (RN20)
- **Requisitos Associados:** RF03, RN20
- **Tipo:** Funcional
- **Pré-condições:** Histórico com registros variados de diferentes produtos e tipos.
- **Passos de Execução:**
  1. No painel de filtros, selecionar Tipo: "Entrada" e Período: "01/10/2026 a 26/10/2026".
  2. Clicar em "Filtrar".
- **Resultado Esperado:** A listagem é atualizada exibindo exclusivamente as entradas ocorridas dentro do intervalo indicado.
- **Pós-condições:** Indicador visual de filtros ativos.

#### [CT-RF03-03] Exportação do histórico para arquivos CSV e PDF (FA02)
- **Requisitos Associados:** RF03, RN18
- **Tipo:** Funcional / Exportação
- **Pré-condições:** Histórico filtrado com registros em tela.
- **Passos de Execução:**
  1. Clicar no botão "Exportar".
  2. Selecionar o formato "CSV" e posteriormente "PDF".
- **Resultado Esperado:** O navegador realiza o download do arquivo `.csv` formatado com delimitadores corretos e do arquivo `.pdf` gerado via backend com cabeçalho institucional e paginação.
- **Pós-condições:** Arquivos íntegros e compatíveis com leitores padrão.

---

### RF04, RF05, RF06 e RF07 - Relatórios e Consultas

#### [CT-RF04-01] Geração de Relatório de Movimentação com período obrigatório (RN18)
- **Requisitos Associados:** RF04, RN18
- **Tipo:** Funcional e Validação de Negócio
- **Pré-condições:** Usuário com perfil de Gestor autenticado.
- **Passos de Execução:**
  1. Acessar o módulo de Relatórios -> "Relatório de Movimentação".
  2. Tentar gerar sem selecionar as datas de início e fim.
  3. Informar o período "01/10/2026 a 25/10/2026" e clicar em "Gerar".
- **Resultado Esperado:** No passo 2, o sistema impede a geração e alerta: *"O preenchimento do período é obrigatório"*. No passo 3, o relatório é consolidado e exibido com tabela detalhada e resumo quantitativo.
- **Pós-condições:** Relatório pronto para visualização e download.

#### [CT-RF05-01] Geração de Relatório de Consumo por tipo de ferramenta
- **Requisitos Associados:** RF05, RN18
- **Tipo:** Funcional
- **Pré-condições:** Movimentações de saída efetuadas no período de apuração.
- **Passos de Execução:**
  1. Acessar Relatórios -> "Relatório de Consumo".
  2. Selecionar o mês corrente e filtrar pela categoria "Pastilhas de Usinagem".
  3. Confirmar a geração.
- **Resultado Esperado:** O sistema totaliza o consumo por tipo, calcula a taxa de utilização e exibe gráfico comparativo com dados agregados.
- **Pós-condições:** Relatório exibido em tela.

#### [CT-RF06-01] Relatório de Necessidade de Reposição de Produtos (Estoque Crítico)
- **Requisitos Associados:** RF06, RF13, RN03
- **Tipo:** Funcional (Caminho Feliz)
- **Pré-condições:** Pastilha `PST-002` com saldo `10` e estoque mínimo configurado em `50` (Abaixo do mínimo).
- **Passos de Execução:**
  1. Acessar Relatórios -> "Relatório de Necessidade de Reposição".
  2. Clicar em "Gerar".
- **Resultado Esperado:** O sistema identifica `PST-002` com saldo <= estoque mínimo, calcula a sugestão de compra (mínimo de 40 unidades para recompor o estoque de segurança) e apresenta na lista prioritária.
- **Pós-condições:** Lista gerada com prioridades coloridas.

#### [CT-RF06-02] Relatório de Reposição sem itens críticos (FE01)
- **Requisitos Associados:** RF06
- **Tipo:** Exceção (FE01)
- **Pré-condições:** Todos os produtos da base com saldo superior aos seus respectivos limites mínimos.
- **Passos de Execução:**
  1. Executar o "Relatório de Necessidade de Reposição".
- **Resultado Esperado:** O sistema exibe mensagem amigável: *"Nenhum item necessita de reposição no momento."*
- **Pós-condições:** Nenhuma pendência gerada.

#### [CT-RF07-01] Consulta da quantidade disponível por SKU e Nome
- **Requisitos Associados:** RF07
- **Tipo:** Funcional
- **Pré-condições:** Produto `PST-001` cadastrado.
- **Passos de Execução:**
  1. Digitar "PST-001" no campo de busca rápida do estoque.
  2. Limpar o campo e digitar o nome "Pastilha de usinagem".
- **Resultado Esperado:** Em ambas as buscas o sistema localiza o registro em tempo real e exibe a quantidade exata em estoque, o estoque mínimo e o status de suprimento.
- **Pós-condições:** Card do produto em destaque.

#### [CT-RF07-02] Consulta de produto inexistente (FE01)
- **Requisitos Associados:** RF07
- **Tipo:** Exceção (FE01)
- **Passos de Execução:**
  1. Buscar por um SKU inexistente como "XYZ-999".
- **Resultado Esperado:** O sistema exibe a mensagem: *"Produto não encontrado"*.

---

### RF08 - Exibir Situação do Estoque (Dashboard)

#### [CT-RF08-01] Apresentação do Dashboard e KPIs Operacionais
- **Requisitos Associados:** RF08, RN19
- **Tipo:** Funcional (Caminho Feliz)
- **Pré-condições:** Usuário autenticado com perfil válido.
- **Passos de Execução:**
  1. Acessar a página inicial (`/` ou `/dashboard`).
- **Resultado Esperado:** O Dashboard carrega com sucesso os 4 cartões de KPIs:
  1. **TOTAL INVENTORY ITEMS:** Soma total das peças em estoque com variação percentual.
  2. **LOW STOCK ALERTS:** Contagem precisa de itens com status Baixo ou Crítico.
  3. **ACTIVE MACHINES:** Proporção de máquinas ativas (ex: `8/10` ou `128/135`).
  4. **MAINTENANCE TASKS:** Quantidade de tarefas de manutenção pendentes.
  - Gráfico de pizza SVG de distribuição por Categoria.
  - Gráfico de barras SVG de produção por Turno.
- **Pós-condições:** Indicadores sincronizados com o banco de dados.

#### [CT-RF08-02] Filtragem da tabela do Dashboard por Status de Alerta (FA01)
- **Requisitos Associados:** RF08, RN19, RN20
- **Tipo:** Alternativo (FA01)
- **Passos de Execução:**
  1. No painel de controle do Dashboard, filtrar por Status: "Crítico".
- **Resultado Esperado:** A tabela exibe apenas as pastilhas cujo saldo está menor ou igual a 25% do estoque mínimo, exibindo badge vermelho ("Crítico").
- **Pós-condições:** Tabela filtrada visualmente.

---

### RF09 e RF10 - Atualização Automática e Alertas de Estoque Mínimo

#### [CT-RF09-01] Concorrência em atualizações simultâneas de saldo (FE02)
- **Requisitos Associados:** RF09
- **Tipo:** Não-Funcional / Concorrência
- **Pré-condições:** Produto `PST-001` com saldo 100.
- **Passos de Execução:**
  1. Enviar simultaneamente duas requisições de saída de 10 unidades via script/threads paralelas.
- **Resultado Esperado:** As requisições são processadas de forma atômica/sequencial sem race condition (`lost update`). O saldo final resultante é exatamente `80` (100 - 10 - 10).
- **Pós-condições:** Consistência transacional preservada.

#### [CT-RF10-01] Disparo automático de alerta quando saldo <= estoque mínimo (RN03)
- **Requisitos Associados:** RF10, RF09, RN03
- **Tipo:** Funcional (Regra de Negócio)
- **Pré-condições:** Pastilha `PST-003` com estoque mínimo configurado para `40` unidades e saldo atual de `45`.
- **Passos de Execução:**
  1. Registrar uma saída de `10` unidades de `PST-003`.
  2. O saldo é atualizado para `35` unidades (inferior a 40).
- **Resultado Esperado:** O sistema identifica automaticamente que a cota mínima foi ultrapassada, altera o status do produto para "Baixo" ou "Crítico", incrementa o KPI "LOW STOCK ALERTS" no Dashboard e exibe a notificação visual de alerta imediato.
- **Pós-condições:** Alerta registrado no log histórico de notificações.

---

### RF11 - Gerenciar Tipos de Pastilhas

#### [CT-RF11-01] Cadastro de novo tipo de pastilha com código único
- **Requisitos Associados:** RF11, RN01, RN02
- **Tipo:** Funcional (Caminho Feliz)
- **Pré-condições:** Usuário Gestor/Admin autenticado.
- **Passos de Execução:**
  1. Acessar o catálogo de produtos e clicar em "Novo Tipo / Produto".
  2. Preencher SKU: `PST-WNMG`, Nome: `Pastilha WNMG 080408`, Categoria: `Torneamento`, Setor: `Usinagem`, Turno: `Manhã`, Quantidade: `100`, Estoque Mínimo: `30`.
  3. Clicar em "Salvar".
- **Resultado Esperado:** O sistema valida a unicidade do código (SF01), cadastra o item no DynamoDB e calcula o status como "Normal". A listagem é atualizada com sucesso.
- **Pós-condições:** Novo SKU persistido na base.

#### [CT-RF11-02] Tentativa de cadastro com código de pastilha duplicado (FE01 / RN01)
- **Requisitos Associados:** RF11, RN01
- **Tipo:** Negativo / Exceção (FE01)
- **Pré-condições:** Produto com código `PST-001` já existe no banco.
- **Passos de Execução:**
  1. Tentar cadastrar um novo produto utilizando o SKU `PST-001`.
  2. Submeter o formulário.
- **Resultado Esperado:** A aplicação impede o cadastro, retornando HTTP 409 (Conflict) e a mensagem de erro: *"Código já cadastrado"* ou *"SKU já cadastrado"*.
- **Pós-condições:** Nenhum registro duplicado é criado.

#### [CT-RF11-03] Edição dos dados cadastrais de uma pastilha existente (FA01)
- **Requisitos Associados:** RF11
- **Tipo:** Alternativo (FA01)
- **Passos de Execução:**
  1. Selecionar o item `PST-001` na listagem e clicar em "Editar".
  2. Alterar o nome para `Pastilha CNMG 120408 - Revestida TiN` e o estoque mínimo para `60`.
  3. Confirmar a alteração.
- **Resultado Esperado:** As alterações são salvas, o status de suprimento é recalculado com base no novo estoque mínimo e a interface exibe os dados atualizados.
- **Pós-condições:** Registro atualizado com timestamp de modificação.

---

### RF12 - Gerenciar Fabricantes e Fornecedores

#### [CT-RF12-01] Cadastro de fornecedor com identificação obrigatória (RN04)
- **Requisitos Associados:** RF12, RN04
- **Tipo:** Funcional (Caminho Feliz)
- **Passos de Execução:**
  1. Acessar módulo de Fornecedores -> "Novo Fornecedor".
  2. Informar Razão Social: `Usinagem & Ferramentas do Vale Ltda`, CNPJ: `12.345.678/0001-90`, Contato: `contato@usivale.com.br`.
  3. Confirmar.
- **Resultado Esperado:** O sistema valida a completude dos dados (SF01), verifica a unicidade do CNPJ e grava o fornecedor com status "Ativo".
- **Pós-condições:** Fornecedor disponível para vínculo em movimentações.

#### [CT-RF12-02] Tentativa de cadastro com CNPJ duplicado (FE01)
- **Requisitos Associados:** RF12
- **Tipo:** Negativo / Exceção (FE01)
- **Passos de Execução:**
  1. Inserir dados de um novo fornecedor com o mesmo CNPJ de um fornecedor já registrado.
  2. Confirmar a submissão.
- **Resultado Esperado:** O sistema exibe mensagem: *"Fornecedor já cadastrado"* e barra a gravação.

#### [CT-RF12-03] Inativação de fornecedor e bloqueio em novas entradas (RN05)
- **Requisitos Associados:** RF12, RN05
- **Tipo:** Regra de Negócio (RN05)
- **Passos de Execução:**
  1. Localizar fornecedor cadastrado e selecionar "Inativar".
  2. Confirmar a inativação na caixa de diálogo.
  3. Ir à tela de "Registrar Movimentação de Entrada".
  4. Abrir o select de Fornecedores para nova entrada.
- **Resultado Esperado:** O fornecedor tem seu status alterado para "Inativo". Seu histórico passado é 100% preservado, mas ele não aparece mais como opção selecionável para novas movimentações de entrada.
- **Pós-condições:** Rastreabilidade mantida sem exclusão física do registro.

---

### RF13 - Configurar Níveis Mínimos de Estoque

#### [CT-RF13-01] Configuração individual de estoque mínimo
- **Requisitos Associados:** RF13, RN03
- **Tipo:** Funcional (Caminho Feliz)
- **Passos de Execução:**
  1. Acessar a tela "Configurar Níveis Mínimos".
  2. Selecionar o item `PST-001`.
  3. Alterar o nível mínimo de `50` para `75`.
  4. Clicar em "Salvar Alteração".
- **Resultado Esperado:** O valor é validado e atualizado no banco. Se o saldo atual for inferior a 75, o status é recalculado para "Baixo" ou "Crítico" instantaneamente.
- **Pós-condições:** Alertas recalculados.

#### [CT-RF13-02] Validação de valor inválido no estoque mínimo (FE01)
- **Requisitos Associados:** RF13
- **Tipo:** Negativo / Exceção
- **Passos de Execução:**
  1. No campo de nível mínimo, digitar um valor negativo (ex: `-15`) ou texto alfanumérico.
  2. Confirmar.
- **Resultado Esperado:** O sistema valida o campo e exibe a mensagem de erro: *"Valor inválido para nível mínimo"*. A atualização é bloqueada.
- **Pós-condições:** Valor anterior mantido.

---

### RF14 - Autenticar Usuário no Sistema (Login)

#### [CT-RF14-01] Login com credenciais válidas (Caminho Feliz)
- **Requisitos Associados:** RF14, RNF04, RNF05
- **Tipo:** Funcional e Segurança
- **Pré-condições:** Usuário `admin@tooltrack.com` previamente cadastrado com hash bcrypt da senha `admin123`.
- **Passos de Execução:**
  1. Acessar a rota `/login`.
  2. Preencher e-mail: `admin@tooltrack.com` e senha: `admin123`.
  3. Clicar no botão "Entrar".
- **Resultado Esperado:** A API valida a senha com `bcrypt.compare`, emite um token JWT válido contendo `sub` e `role`, o frontend armazena o token em `localStorage`, exibe feedback positivo e redireciona o usuário para o Dashboard (`/`).
- **Pós-condições:** Sessão autenticada ativa.

#### [CT-RF14-02] Tentativa de login com senha incorreta (FE01)
- **Requisitos Associados:** RF14, RNF05
- **Tipo:** Negativo / Exceção (FE01)
- **Passos de Execução:**
  1. Na tela de login, informar e-mail `admin@tooltrack.com` e senha `senha_errada`.
  2. Clicar em "Entrar".
- **Resultado Esperado:** O controlador da API retorna status HTTP 401 (Unauthorized) com código `UNAUTHORIZED`. A interface exibe aviso visual amigável: *"Credenciais inválidas. Verifique seu e-mail e senha."*
- **Pós-condições:** Nenhum token gerado; usuário permanece na página de login.

#### [CT-RF14-03] Tentativa de login com usuário inativo
- **Requisitos Associados:** RF14, RNF05
- **Tipo:** Negativo / Regra de Negócio
- **Pré-condições:** Usuário com status `ativo: false` no banco DynamoDB.
- **Passos de Execução:**
  1. Informar as credenciais do usuário desativado e clicar em "Entrar".
- **Resultado Esperado:** O sistema recusa a autenticação com mensagem: *"Usuário desativado. Entre em contato com o administrador."*

---

### RF15 - Cadastrar e Gerenciar Máquinas de Esteira

#### [CT-RF15-01] Cadastro de máquina/esteira com sucesso
- **Requisitos Associados:** RF15
- **Tipo:** Funcional (Caminho Feliz)
- **Pré-condições:** Usuário com permissão de Administrador ou Gestor autenticado.
- **Passos de Execução:**
  1. Acessar a tela "Produção" (`/producao`).
  2. Clicar em "Adicionar Nova Esteira/Máquina".
  3. Preencher ID: `MCH-2050`, Nome: `Esteira B-3`, Status: `ativa`, Setor: `Usinagem`, Produção/Hora: `1100`, Eficiência OEE: `91`.
  4. Clicar em "Salvar Máquina".
- **Resultado Esperado:** Validação Zod aprovada; registro inserido na tabela `tooltrack-machines` com ID único; modal fechado e novo card exibido na grade de produção.
- **Pós-condições:** KPI "ACTIVE MACHINES" do Dashboard incrementado.

#### [CT-RF15-02] Cadastro com dados obrigatórios ausentes (FE01)
- **Requisitos Associados:** RF15
- **Tipo:** Negativo / Exceção
- **Passos de Execução:**
  1. Abrir o modal de criação de máquina.
  2. Deixar os campos obrigatórios (ID ou Nome) vazios e clicar em "Salvar".
- **Resultado Esperado:** A interface impede o envio e exibe alerta visual de validação nos campos obrigatórios não preenchidos.
- **Pós-condições:** Formulário permanece aberto para correção.

#### [CT-RF15-03] Alteração de status operacional da máquina
- **Requisitos Associados:** RF15
- **Tipo:** Funcional
- **Passos de Execução:**
  1. No card da máquina `MCH-2050`, selecionar "Editar".
  2. Mudar o status de `ativa` para `parada` com motivo "Ajuste de formato".
  3. Confirmar alteração.
- **Resultado Esperado:** Status atualizado no banco DynamoDB; badge visual no card atualizado para a cor vermelha/amarela ("Parada"); totalizador de máquinas ativas recalculado.
- **Pós-condições:** Estado sincronizado no Dashboard.

---

### Regras de Negócio Específicas: Ajuste de Estoque (RN14, RN15, RN17)

#### [CT-RN14-01] Ajuste de estoque com justificativa por Administrador
- **Requisitos Associados:** RN14, RN15, RN17
- **Tipo:** Regra de Negócio (Caminho Feliz)
- **Pré-condições:** Usuário autenticado com perfil `admin`; pastilha `PST-001` com saldo de 80 unidades no sistema e 75 no estoque físico (diferença de inventário).
- **Passos de Execução:**
  1. Acessar a rotina de Ajuste de Estoque.
  2. Informar a nova quantidade real `75`.
  3. Preencher obrigatoriamente a justificativa: "Aferição de inventário físico mensal - perda de 5 peças por quebra".
  4. Confirmar o ajuste.
- **Resultado Esperado:** O sistema grava a movimentação sob a categoria específica "AJUSTE", registra o saldo anterior (`80`), o saldo novo (`75`), data/hora, usuário logado e a justificativa.
- **Pós-condições:** Rastreabilidade completa preservada.

#### [CT-RN17-01] Bloqueio de ajuste de estoque para operadores comuns
- **Requisitos Associados:** RN16, RN17
- **Tipo:** Segurança e Permissão
- **Pré-condições:** Usuário autenticado com perfil padrão `USER` (Operador).
- **Passos de Execução:**
  1. Tentar acessar a funcionalidade ou rota de ajuste de estoque.
  2. Tentar disparar requisição para a rota restrita de ajuste de inventário.
- **Resultado Esperado:** A interface oculta as opções restritas de ajuste para o perfil comum. Caso haja tentativa direta via API, o middleware responde com HTTP 403 (Forbidden): *"Acesso negado. Apenas administradores e responsáveis podem realizar ajustes de estoque."*
- **Pós-condições:** Saldo e histórico protegidos.

---

## 3. Especificação dos Casos de Testes Não Funcionais (RNF)

| ID do Teste | RNF | Categoria | Procedimento de Teste | Critério de Aceite / Resultado Esperado |
|---|---|---|---|---|
| **CT-RNF01-01** | RNF01 | Usabilidade | Convidar operador do chão de fábrica sem instrução técnica prévia para realizar uma entrada de estoque completa cronometrando o tempo. | A tarefa deve ser concluída com sucesso em menos de 2 minutos, sem necessidade de consulta a manuais externos. |
| **CT-RNF02-01** | RNF02 | Custo / Open Source | Auditar o manifesto de dependências (`package.json`) do frontend e backend e a fatura de serviços da nuvem AWS. | 100% das bibliotecas utilizadas devem ser de código aberto gratuito (Vue, Express, Tailwind, Zod, DynamoDB SDK) sob modelo PAY_PER_REQUEST. |
| **CT-RNF03-01** | RNF03 | Responsividade | Abrir o sistema em navegador Chrome emulando resolução Desktop (1920x1080) e Mobile (375x667). | Menus colapsam adequadamente em drawer/mobile, tabelas ganham rolagem horizontal ou formato card, e botões mantêm área de toque acessível. |
| **CT-RNF04-01** | RNF04 | Segurança de Armazenamento | Inspecionar a tabela `tooltrack-users` no Amazon DynamoDB e inspecionar tráfego de rede via DevTools. | As senhas nunca constam em texto claro; todas possuem hash com salt bcrypt. A comunicação entre cliente e servidor trafega via HTTPS. |
| **CT-RNF05-01** | RNF05 | Controle de Acesso | Abrir uma janela anônima e tentar acessar diretamente a URL `http://localhost:5173/` ou `/producao` sem efetuar login prévio. | O roteador Vue intercepta a navegação no `beforeEach`, bloqueia o acesso às rotas privadas e redireciona imediatamente para a tela `/login`. |
| **CT-RNF06-01** | RNF06 | Arquitetura e Integrações | Testar os endpoints de exportação `/api/export/products.xlsx` e `/api/export/products.pdf` com filtros ativos. | A API devolve arquivos binários padronizados estruturados, prontos para importação em sistemas legados ou ERPs industriais. |
| **CT-RNF07-01** | RNF07 | Desempenho | Medir o tempo de resposta da rota `GET /api/dashboard` e `GET /api/products` com centenas de registros inseridos. | O tempo de carregamento da resposta da API e renderização dos gráficos no navegador deve ser inferior a 2,0 segundos. |
| **CT-RNF08-01** | RNF08 | Manutenibilidade | Realizar revisão estática de código no backend e frontend verificando a divisão de camadas. | Front: `View -> Store -> Service`. Back: `Route -> Middleware -> Service -> Repository -> DynamoDB`. Nenhuma consulta direta ao banco no navegador. |

---

## 4. Registro de Execução e Evidências dos Testes

Ao executar os testes no ciclo de homologação da **Sprint 3**, preencha a planilha de evidências abaixo:

| ID do Teste | Data da Execução | Executor | Ambiente | Status | Observações / Evidências |
|---|---|---|---|---|---|
| CT-RF14-01 | 26/10/2026 | Jacquys Silva | Localhost / Chrome | APROVADO | Token JWT emitido e redirecionado para dashboard |
| CT-RF14-02 | 26/10/2026 | Jacquys Silva | Localhost / Chrome | APROVADO | Retorno 401 exibido com toast de erro |
| CT-RF08-01 | 26/10/2026 | Lucas Crispim | Localhost / Chrome | APROVADO | 4 KPIs renderizados e gráficos SVG íntegros |
| CT-RF15-01 | 26/10/2026 | Ana Lívia | Localhost / Chrome | APROVADO | Máquina criada no DynamoDB com ID e exibida em tela |
| CT-RF11-01 | 26/10/2026 | Jhônatas Silva | Localhost / Chrome | APROVADO | Produto cadastrado com cálculo de status Normal |
| CT-RF11-02 | 26/10/2026 | Jhônatas Silva | Localhost / Chrome | APROVADO | Rejeição 409 em SKU duplicado |
| CT-RNF05-01 | 26/10/2026 | Luis Consoli | Localhost / Anônima | APROVADO | Guarda de rota direcionou com sucesso para /login |
