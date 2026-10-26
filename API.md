# API ToolTrack

Documentação dos endpoints REST do backend do ToolTrack.

**Base URL:** `http://localhost:3001/api`

**Autenticação:** JWT no header `Authorization: Bearer <token>`

**Formato:** JSON (exceto exportações XLSX/PDF)

**Datas:** ISO 8601 (`YYYY-MM-DD`)

Todas as rotas também funcionam sem o prefixo `/api` (ex.: `/products`).

---

## Health

### GET /api/health

Pública.

```json
{ "status": "ok" }
```

---

## Auth

### POST /api/auth/login

Pública. Autentica e-mail e senha.

**Corpo**

```json
{
  "email": "admin@tooltrack.com",
  "password": "senha"
}
```

**Resposta 200**

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1dWlkIn0.assinatura",
  "user": {
    "id": "uuid",
    "nome": "Administrador",
    "email": "admin@tooltrack.com",
    "role": "admin"
  }
}
```

Erros: `400` corpo inválido, `401` credenciais incorretas.

### GET /api/auth/me

Bearer JWT. Retorna o usuário autenticado, sem `passwordHash`.

---

## Lookups

### GET /api/lookups

Bearer JWT. Domínios fixos para selects.

**Resposta 200**

```json
{
  "setores": ["Usinagem", "Montagem"],
  "categorias": ["Pastilha", "Ferramenta"],
  "turnos": ["Manhã", "Tarde", "Noite"]
}
```

---

## Dashboard

### GET /api/dashboard

Bearer JWT. KPIs, distribuição por categoria e produção por turno.

**Query params:** `setor`, `turno`, `categoria`, `data`. Todos opcionais.

**Resposta 200**

```json
{
  "kpis": {
    "totalItems": {
      "value": 1234,
      "formatted": "1,234",
      "change": "↑4.2%",
      "isPositive": true
    },
    "lowStock": {
      "value": 12,
      "formatted": "12",
      "change": "↓2",
      "isPositive": true
    },
    "activeMachines": {
      "active": 8,
      "total": 10,
      "formatted": "8/10",
      "change": "80.0% Up",
      "isPositive": true
    },
    "maintenanceTasks": {
      "value": 3,
      "formatted": "3",
      "change": "Due today",
      "isPositive": false
    },
    "cards": [
      {
        "id": "METRIC#001",
        "title": "TOTAL INVENTORY ITEMS",
        "value": "1,234",
        "change": "↑4.2%",
        "isPositive": true,
        "variant": "blue"
      },
      {
        "id": "METRIC#002",
        "title": "LOW STOCK ALERTS",
        "value": "12",
        "change": "↓2",
        "isPositive": true,
        "variant": "red"
      },
      {
        "id": "METRIC#003",
        "title": "ACTIVE MACHINES",
        "value": "8/10",
        "change": "80.0% Up",
        "isPositive": true,
        "variant": "green"
      },
      {
        "id": "METRIC#004",
        "title": "MAINTENANCE TASKS",
        "value": "3",
        "change": "Due today",
        "isPositive": false,
        "variant": "dark"
      }
    ]
  },
  "categoria": [
    {
      "nome": "Pastilha",
      "name": "Pastilha",
      "quantidade": 800,
      "count": 800,
      "percentual": 64.8,
      "percentage": 64.8,
      "color": "#1E2A4A"
    }
  ],
  "turno": [
    {
      "turno": "Manhã",
      "shift": "Manhã",
      "quantidade": 120,
      "count": 120,
      "percentual": 50.0,
      "percentage": 50.0,
      "color": "#1E2A4A"
    },
    {
      "turno": "Noite",
      "shift": "Noite",
      "quantidade": 80,
      "count": 80,
      "percentual": 33.3,
      "percentage": 33.3,
      "color": "#4A6DB5"
    },
    {
      "turno": "Tarde",
      "shift": "Tarde",
      "quantidade": 40,
      "count": 40,
      "percentual": 16.7,
      "percentage": 16.7,
      "color": "#8A9BCB"
    }
  ],
  "recentes": [
    {
      "id": "RECENT#PROD",
      "title": "Produtos",
      "description": "Cadastre e gerencie seus produtos",
      "route": "/producao"
    }
  ]
}
```

A resposta não inclui a lista de produtos. Para isso, use `GET /api/products`.

---

## Products

### GET /api/products

Bearer JWT. Lista produtos com filtros e paginação por cursor.

**Query params:** `setor`, `turno`, `categoria`, `status`, `search`, `limit`, `cursor`.

**Resposta 200**

```json
{
  "items": [
    {
      "sku": "PST-001",
      "nome": "Pastilha de usinagem X",
      "categoria": "Pastilha",
      "setor": "Usinagem",
      "turno": "Manhã",
      "quantidade": 120,
      "estoqueMinimo": 50,
      "status": "Normal",
      "dataCadastro": "2026-08-01T10:00:00.000Z"
    }
  ],
  "nextCursor": "eyJza3V5IjoiUFNULTAwMSJ9"
}
```

### GET /api/products/:sku

Bearer JWT. Retorna um produto. `404` se não existir.

### POST /api/products

Bearer JWT. Cria um produto; o `status` é calculado automaticamente.

**Corpo**

```json
{
  "sku": "PST-001",
  "nome": "Pastilha de usinagem X",
  "categoria": "Pastilha",
  "setor": "Usinagem",
  "turno": "Manhã",
  "quantidade": 120,
  "estoqueMinimo": 50
}
```

Cálculo do status: `Crítico` se `quantidade ≤ 0,25 × estoqueMinimo`; `Baixo` se `quantidade < estoqueMinimo`; caso contrário `Normal`.

Erros: `400` validação, `409` SKU já cadastrado.

### PUT /api/products/:sku

Bearer JWT. Atualiza campos (todos opcionais) e recalcula o `status`.

### DELETE /api/products/:sku

Bearer JWT. Remove o produto.

```json
{ "deleted": true, "sku": "PST-001" }
```

---

## Production

### GET /api/production

Bearer JWT. Consulta apontamentos de produção.

**Query params:** `turno`, `data`, `dataInicio`, `dataFim`.

**Resposta 200**

```json
[
  {
    "turno": "Manhã",
    "dataId": "2026-08-01#Manhã",
    "data": "2026-08-01",
    "quantidade": 120,
    "setor": "Usinagem",
    "categoria": "Pastilha",
    "maquinaId": "MCH-1024"
  }
]
```

### POST /api/production

Bearer JWT. Registra um apontamento.

**Corpo**

```json
{
  "turno": "Manhã",
  "data": "2026-08-01",
  "quantidade": 120,
  "setor": "Usinagem",
  "categoria": "Pastilha",
  "maquinaId": "MCH-1024"
}
```

Obrigatórios: `turno`, `data`, `quantidade`. Opcionais: `setor`, `categoria`, `maquinaId`.

---

## Machines

### GET /api/machines

Bearer JWT. Lista máquinas e esteiras.

**Query params:** `search`, `status`.

**Resposta 200**

```json
[
  {
    "id": "MCH-1024",
    "name": "Esteira A-1",
    "status": "ativa",
    "setor": "Usinagem",
    "producaoHora": 1240,
    "eficienciaOEE": 94,
    "extraInfo": "Última manutenção: 02/07/2026"
  }
]
```

### GET /api/machines/:id

Bearer JWT. Retorna uma máquina. `404` se não existir.

### POST /api/machines

Bearer JWT. Cadastra uma máquina.

**Corpo**

```json
{
  "id": "MCH-1024",
  "name": "Esteira A-1",
  "status": "ativa",
  "setor": "Usinagem",
  "producaoHora": 1240,
  "eficienciaOEE": 94,
  "extraInfo": "Última manutenção: 02/07/2026"
}
```

Obrigatórios: `id`, `name`, `status`. Opcionais: `setor`, `producaoHora`, `eficienciaOEE`, `extraInfo`.

### PUT /api/machines/:id

Bearer JWT. Atualiza os dados (todos os campos opcionais).

### DELETE /api/machines/:id

Bearer JWT. Remove a máquina.

```json
{ "deleted": true, "id": "MCH-1024" }
```

---

## Profile

### GET /api/profile

Bearer JWT. Dados do usuário autenticado.

**Resposta 200**

```json
{
  "id": "uuid",
  "nome": "Administrador",
  "email": "admin@tooltrack.com",
  "cargo": "Gestor",
  "departamento": "TI",
  "telefone": "+55 11 99999-0000",
  "localizacao": "Taubaté-SP",
  "idFuncionario": "FUNC-001",
  "role": "admin"
}
```

### PUT /api/profile

Bearer JWT. Atualiza o próprio perfil. Todos os campos opcionais; `password` exige mínimo de 6 caracteres.

**Corpo**

```json
{
  "nome": "Administrador",
  "cargo": "Gestor",
  "departamento": "TI",
  "telefone": "+55 11 99999-0000",
  "localizacao": "Taubaté-SP",
  "idFuncionario": "FUNC-001",
  "password": "novaSenha123"
}
```

---

## Users

Todas as rotas exigem Bearer JWT + perfil **admin**.

### GET /api/users

Lista os usuários, sem `passwordHash`.

### POST /api/users

Cadastra um usuário.

**Corpo**

```json
{
  "email": "operador@tooltrack.com",
  "password": "senha123",
  "role": "USER",
  "ativo": true,
  "nome": "Operador",
  "cargo": "Operador de Estoque",
  "departamento": "Produção",
  "localizacao": "Taubaté-SP"
}
```

Defaults: `role = "USER"`, `ativo = true`. Senha com mínimo de 6 caracteres.

Erros: `400` validação, `409` e-mail já cadastrado.

### PUT /api/users/:id

Atualiza dados, papel, status ou senha. Mesmos campos do `POST`, todos opcionais.

### DELETE /api/users/:id

Remove o usuário.

```json
{ "deleted": true, "id": "uuid" }
```

---

## Exportação

### GET /api/export/products.xlsx

Bearer JWT. Planilha Excel dos produtos filtrados. Query params iguais aos de `GET /api/products`, sem paginação.

### GET /api/export/products.pdf

Bearer JWT. Relatório PDF dos produtos filtrados. Query params iguais aos de `GET /api/products`, sem paginação.

---

## Códigos de Erro

Formato padrão:

```json
{
  "code": "UNAUTHORIZED",
  "message": "Token inválido ou expirado"
}
```

| HTTP | Código | Situação |
|---|---|---|
| 400 | `VALIDATION_ERROR` | Dados inválidos |
| 401 | `UNAUTHORIZED` | Token ausente, inválido ou expirado |
| 403 | `FORBIDDEN` | Perfil sem permissão |
| 404 | `NOT_FOUND` | Recurso inexistente |
| 409 | `CONFLICT` / `EMAIL_ALREADY_EXISTS` | Duplicidade |
| 500 | `INTERNAL_SERVER_ERROR` | Erro não tratado |
| 503 | `AWS_CREDENTIALS_EXPIRED` | Credenciais do AWS Academy expiradas |

### AWS_CREDENTIALS_EXPIRED

Sessões do AWS Academy expiram periodicamente. Para resolver:

1. Iniciar o lab novamente no console do AWS Academy.
2. Copiar as credenciais em **AWS Details → AWS CLI (Show)**.
3. Atualizar `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` e `AWS_SESSION_TOKEN` em `backend/.env`.
4. Reiniciar o backend.
