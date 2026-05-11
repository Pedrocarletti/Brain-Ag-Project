# Rural Producers API

API REST backend para cadastro de produtores rurais, fazendas, safras, culturas plantadas e consulta de dashboard agregado.

## Tecnologias

- Node.js, TypeScript e NestJS
- PostgreSQL
- Prisma ORM com migrations e seed
- Docker e Docker Compose
- Jest e Supertest
- Swagger/OpenAPI em `/docs`
- Validação com `class-validator` e `class-transformer`
- Tratamento global de erros e logs HTTP estruturados com Pino

## Arquitetura

O projeto usa separação por módulos de domínio:

```txt
src/
  common/          filtros, interceptors e validators reutilizáveis
  config/          validação de ambiente
  database/        PrismaModule e PrismaService
  modules/
    producers/
    farms/
    harvests/
    crops/
    planted-crops/
    dashboard/
```

Controllers recebem DTOs e delegam a orquestração aos services. Repositories concentram o acesso ao Prisma. Regras de negócio ficam nos services e validators.

## Como rodar com Docker

```bash
docker compose up -d
```

A API ficará disponível em:

```txt
http://localhost:3000
```

Swagger:

```txt
http://localhost:3000/docs
```

## Como rodar localmente

```bash
npm install
npm run frontend:install
cp .env.example .env
docker compose up -d postgres
npx prisma migrate dev
npx prisma db seed
npm run start:dev
```

Em outro terminal, rode o frontend:

```bash
npm run frontend:dev
```

Frontend:

```txt
http://localhost:5173
```

Swagger:

```txt
http://localhost:3000/docs
```

## Scripts úteis

```bash
npm run build
npm run test
npm run test:e2e
npm run lint
npm audit --audit-level=moderate
npm run frontend:build
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run db:reset
```

## Regras de negócio principais

- CPF/CNPJ é obrigatório, validado e armazenado sem máscara.
- Não é permitido cadastrar dois produtores com o mesmo documento.
- A soma de `agriculturalArea + vegetationArea` não pode ultrapassar `totalArea`.
- `totalArea` deve ser maior que zero.
- Áreas agricultável e de vegetação não podem ser negativas.
- As regras de área também são protegidas por constraints no PostgreSQL.
- Cultura não pode ser duplicada pelo mesmo nome, inclusive variando maiúsculas/minúsculas.
- Safra não pode ser duplicada por nome ou ano. O nome também é validado de forma case-insensitive.
- A mesma cultura não pode ser cadastrada duas vezes para a mesma fazenda e safra.

## Endpoints

As listagens principais aceitam paginação:

```http
GET /producers?page=1&limit=20&search=joao
GET /farms?page=1&limit=20&search=santa&state=MG
GET /harvests?page=1&limit=20&search=2026
GET /crops?page=1&limit=20&search=soja
GET /planted-crops?page=1&limit=20
```

Formato de resposta paginada:

```json
{
  "data": [],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 0,
    "totalPages": 0
  }
}
```

### Producers

```http
POST /producers
GET /producers
GET /producers/:id
PATCH /producers/:id
DELETE /producers/:id
```

Exemplo:

```json
{
  "document": "123.456.789-09",
  "name": "João da Silva"
}
```

### Farms

```http
POST /farms
GET /farms
GET /farms/:id
GET /farms/by-producer/:producerId
PATCH /farms/:id
DELETE /farms/:id
```

Exemplo:

```json
{
  "producerId": "uuid-do-produtor",
  "farmName": "Fazenda Santa Clara",
  "city": "Uberaba",
  "state": "MG",
  "totalArea": 1000,
  "agriculturalArea": 700,
  "vegetationArea": 200
}
```

### Harvests

```http
POST /harvests
GET /harvests
GET /harvests/:id
PATCH /harvests/:id
DELETE /harvests/:id
```

### Crops

```http
POST /crops
GET /crops
GET /crops/:id
PATCH /crops/:id
DELETE /crops/:id
```

### Planted Crops

```http
POST /planted-crops
GET /planted-crops
GET /planted-crops/by-farm/:farmId
DELETE /planted-crops/:id
```

### Dashboard

```http
GET /dashboard
```

Retorno:

```json
{
  "totalFarms": 15,
  "totalHectares": 7000,
  "farmsByState": [{ "state": "MG", "count": 10 }],
  "farmsByCrop": [{ "crop": "Soja", "count": 8 }],
  "landUse": {
    "agriculturalArea": 5000,
    "vegetationArea": 2000
  }
}
```

`farmsByCrop.count` representa a quantidade de fazendas distintas com determinada cultura plantada.

## Testes

Unitários:

```bash
npm run test
```

E2E:

```bash
copy .env.test.example .env.test
docker compose up -d postgres-test
npm run test:e2e
```

Os testes e2e usam `.env.test`, executam `prisma migrate deploy` automaticamente e apontam para o banco `rural_producers_test` na porta `5433`.

O bootstrap dos testes e2e usa a mesma configuração global da aplicação real: pipes, filtro global de erros, serializer e logger.

## Possíveis melhorias futuras

- Autenticação e autorização.
- Auditoria de alterações.
- Métricas Prometheus.
- Testcontainers para banco isolado nos testes e2e.
- CI com lint, build, testes unitários e e2e.
