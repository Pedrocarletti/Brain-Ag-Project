# Prompt Backend — Teste Técnico Produtores Rurais

Você é um desenvolvedor backend sênior especialista em Node.js, TypeScript, NestJS, PostgreSQL, Prisma ORM, Docker, testes automatizados, arquitetura em camadas, Clean Code, SOLID, observabilidade e documentação OpenAPI.

Preciso que você desenvolva uma API REST completa para um teste técnico de cadastro de produtores rurais.

O foco deve ser **somente backend**.

---

## Objetivo da aplicação

Criar uma API REST para gerenciar produtores rurais, suas propriedades/fazendas, safras e culturas plantadas.

A aplicação deve permitir:

- Cadastro, edição, listagem e exclusão de produtores rurais.
- Validação de CPF ou CNPJ.
- Cadastro de uma ou mais propriedades rurais para cada produtor.
- Cadastro de safras.
- Cadastro de culturas plantadas por propriedade e por safra.
- Dashboard com indicadores agregados.

---

## Stack obrigatória

Utilize:

- Node.js
- TypeScript
- NestJS
- PostgreSQL
- Prisma ORM
- Docker
- Docker Compose
- Jest para testes unitários e integrados
- Swagger/OpenAPI para documentação da API
- Logger estruturado para observabilidade

---

## Requisitos de negócio

### Produtor rural

Cada produtor rural deve possuir:

- `id`
- `document`: CPF ou CNPJ
- `documentType`: CPF ou CNPJ
- `name`: nome do produtor
- `createdAt`
- `updatedAt`

Regras:

- CPF ou CNPJ deve ser obrigatório.
- CPF ou CNPJ deve ser válido.
- Não permitir dois produtores com o mesmo CPF/CNPJ.
- Um produtor pode ter 0, 1 ou várias propriedades rurais.
- Deve ser possível criar, editar, listar, buscar por id e excluir produtor.

---

### Propriedade rural / Fazenda

Cada propriedade deve possuir:

- `id`
- `producerId`
- `farmName`: nome da fazenda/propriedade
- `city`
- `state`
- `totalArea`: área total em hectares
- `agriculturalArea`: área agricultável em hectares
- `vegetationArea`: área de vegetação em hectares
- `createdAt`
- `updatedAt`

Regras:

- A propriedade deve pertencer a um produtor rural.
- A soma de `agriculturalArea + vegetationArea` não pode ultrapassar `totalArea`.
- `totalArea` deve ser maior que zero.
- `agriculturalArea` e `vegetationArea` não podem ser negativas.
- Uma propriedade pode ter 0, 1 ou várias culturas plantadas por safra.
- Deve ser possível criar, editar, listar, buscar por id e excluir propriedades.

---

### Safra

Cada safra deve possuir:

- `id`
- `name`: exemplo `Safra 2021`, `Safra 2022`
- `year`
- `createdAt`
- `updatedAt`

Regras:

- Não permitir safras duplicadas com mesmo nome ou mesmo ano, se fizer sentido.
- Deve ser possível criar, editar, listar, buscar por id e excluir safras.

---

### Cultura

Cada cultura deve possuir:

- `id`
- `name`: exemplo `Soja`, `Milho`, `Café`, `Algodão`, `Cana-de-açúcar`
- `createdAt`
- `updatedAt`

Regras:

- Não permitir culturas duplicadas com o mesmo nome.
- Deve ser possível criar, editar, listar, buscar por id e excluir culturas.

---

### Cultura plantada

A cultura plantada representa qual cultura foi plantada em determinada fazenda e em determinada safra.

Cada registro deve possuir:

- `id`
- `farmId`
- `cropId`
- `harvestId`
- `createdAt`
- `updatedAt`

Regras:

- Uma fazenda pode ter várias culturas por safra.
- Uma mesma cultura não deve ser duplicada para a mesma fazenda na mesma safra.
- Deve ser possível criar, listar e excluir culturas plantadas.

Exemplo:

```txt
Fazenda Santa Clara
  Safra 2021
    Soja
    Milho
  Safra 2022
    Café
```

---

## Dashboard

Criar endpoint para dashboard com os seguintes dados:

```http
GET /dashboard
```

Deve retornar:

- `totalFarms`: total de fazendas cadastradas.
- `totalHectares`: soma total de hectares registrados considerando `totalArea` das propriedades.

Também deve retornar dados agregados para gráficos de pizza.

---

### Distribuição por estado

Exemplo:

```json
{
  "farmsByState": [
    {
      "state": "MG",
      "count": 10
    },
    {
      "state": "SP",
      "count": 5
    }
  ]
}
```

---

### Distribuição por cultura plantada

Exemplo:

```json
{
  "farmsByCrop": [
    {
      "crop": "Soja",
      "count": 8
    },
    {
      "crop": "Milho",
      "count": 6
    }
  ]
}
```

---

### Uso do solo

A soma deve considerar todas as propriedades cadastradas.

Exemplo:

```json
{
  "landUse": {
    "agriculturalArea": 5000,
    "vegetationArea": 2000
  }
}
```

---

### Retorno final esperado do dashboard

```json
{
  "totalFarms": 15,
  "totalHectares": 7000,
  "farmsByState": [
    {
      "state": "MG",
      "count": 10
    }
  ],
  "farmsByCrop": [
    {
      "crop": "Soja",
      "count": 8
    }
  ],
  "landUse": {
    "agriculturalArea": 5000,
    "vegetationArea": 2000
  }
}
```

---

## Arquitetura esperada

Estruture o projeto usando arquitetura em camadas, com separação clara de responsabilidades.

Sugestão:

```txt
src/
  main.ts
  app.module.ts

  common/
    filters/
    interceptors/
    decorators/
    exceptions/
    logger/
    validators/

  config/
    env.validation.ts
    database.config.ts

  database/
    prisma.service.ts
    prisma.module.ts

  modules/
    producers/
      controllers/
      services/
      dto/
      entities/
      repositories/
      producers.module.ts

    farms/
      controllers/
      services/
      dto/
      entities/
      repositories/
      farms.module.ts

    harvests/
      controllers/
      services/
      dto/
      entities/
      repositories/
      harvests.module.ts

    crops/
      controllers/
      services/
      dto/
      entities/
      repositories/
      crops.module.ts

    planted-crops/
      controllers/
      services/
      dto/
      entities/
      repositories/
      planted-crops.module.ts

    dashboard/
      controllers/
      services/
      dashboard.module.ts
```

Use os princípios:

- SOLID
- Clean Code
- KISS
- DRY com moderação
- Separação entre Controller, Service e Repository
- DTOs para entrada e saída
- Validações com `class-validator` e `class-transformer`
- Tratamento global de erros
- Padronização de respostas
- Logs em pontos importantes

---

## Banco de dados

Utilize PostgreSQL com Prisma ORM.

Crie o schema Prisma completo com as entidades:

- `Producer`
- `Farm`
- `Harvest`
- `Crop`
- `PlantedCrop`

Relacionamentos:

- `Producer` 1:N `Farm`
- `Farm` 1:N `PlantedCrop`
- `Harvest` 1:N `PlantedCrop`
- `Crop` 1:N `PlantedCrop`

Criar constraints importantes:

- `document` único em `Producer`
- `name` único em `Crop`
- `year` único em `Harvest`
- constraint única em `PlantedCrop` para evitar duplicidade da mesma cultura na mesma fazenda e safra:
  - `farmId + cropId + harvestId`

Use migrations do Prisma.

Inclua seed com dados mockados para facilitar testes e visualização do dashboard.

---

## Endpoints esperados

### Producers

```http
POST /producers
GET /producers
GET /producers/:id
PATCH /producers/:id
DELETE /producers/:id
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

---

## Validações obrigatórias

### CPF/CNPJ

Criar um validator reutilizável para CPF e CNPJ.

Deve validar:

- CPF válido
- CNPJ válido
- Remover máscara antes de validar
- Aceitar valores como:
  - `123.456.789-09`
  - `12345678909`
  - `12.345.678/0001-99`
  - `12345678000199`

Retornar erro claro caso inválido.

---

### Áreas da fazenda

Validar:

```txt
agriculturalArea + vegetationArea <= totalArea
```

Caso contrário, retornar erro 400 com mensagem clara:

```txt
A soma da área agricultável com a área de vegetação não pode ultrapassar a área total da fazenda.
```

---

### Duplicidade

Tratar erros de duplicidade do Prisma e retornar mensagens amigáveis, por exemplo:

- CPF/CNPJ já cadastrado.
- Cultura já cadastrada.
- Safra já cadastrada.
- Essa cultura já foi cadastrada para essa fazenda nessa safra.

---

## Observabilidade

Adicionar logs estruturados.

Use o logger do NestJS ou Pino.

Registrar logs em operações relevantes:

- Criação de produtor
- Atualização de produtor
- Exclusão de produtor
- Criação de fazenda
- Erros de validação
- Erros inesperados
- Consultas do dashboard

Criar um interceptor ou middleware para logar requisições HTTP com:

- método
- path
- statusCode
- tempo de resposta

---

## Tratamento de erros

Criar um filtro global de exceções para padronizar respostas de erro.

Formato sugerido:

```json
{
  "statusCode": 400,
  "message": "Mensagem do erro",
  "error": "Bad Request",
  "timestamp": "2026-01-01T00:00:00.000Z",
  "path": "/farms"
}
```

Tratar:

- `BadRequestException`
- `NotFoundException`
- `ConflictException`
- Erros do Prisma
- Erros inesperados

---

## Documentação

Configurar Swagger/OpenAPI em:

```http
/docs
```

Documentar todos os endpoints com:

- descrição
- request body
- response
- status codes
- exemplos de payload

Adicionar decorators do Swagger nos DTOs.

---

## Testes

Criar testes unitários e integrados.

### Testes unitários obrigatórios

Criar testes para:

- Validação de CPF
- Validação de CNPJ
- Regra de área da fazenda
- Service de produtores
- Service de fazendas
- Service de dashboard

---

### Testes integrados/e2e obrigatórios

Criar testes para:

- Criar produtor com CPF válido
- Impedir produtor com CPF inválido
- Impedir produtor duplicado
- Criar fazenda válida
- Impedir fazenda quando `agriculturalArea + vegetationArea > totalArea`
- Criar safra
- Criar cultura
- Criar cultura plantada
- Impedir cultura plantada duplicada para mesma fazenda/safra/cultura
- Consultar dashboard

Use banco de teste isolado via Docker ou configuração separada.

---

## Docker

Criar:

- `Dockerfile` para a API
- `docker-compose.yml` com:
  - app NestJS
  - postgres

Variáveis de ambiente:

```env
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/rural_producers?schema=public
```

Criar também `.env.example`.

---

## Scripts no package.json

Incluir scripts úteis:

```json
{
  "start": "nest start",
  "start:dev": "nest start --watch",
  "build": "nest build",
  "test": "jest",
  "test:watch": "jest --watch",
  "test:e2e": "jest --config ./test/jest-e2e.json",
  "lint": "eslint \"{src,test}/**/*.ts\" --fix",
  "prisma:generate": "prisma generate",
  "prisma:migrate": "prisma migrate dev",
  "prisma:deploy": "prisma migrate deploy",
  "prisma:seed": "tsx prisma/seed.ts",
  "db:reset": "prisma migrate reset"
}
```

---

## README

Criar um `README.md` claro contendo:

- Descrição do projeto
- Tecnologias utilizadas
- Arquitetura da aplicação
- Como rodar com Docker
- Como rodar localmente
- Como executar migrations
- Como executar seed
- Como rodar testes
- Link da documentação Swagger
- Exemplos de requisições
- Explicação das principais regras de negócio
- Possíveis melhorias futuras

---

## Qualidade esperada

O código deve ser:

- Limpo
- Testável
- Bem organizado
- Fácil de manter
- Com nomes claros
- Sem regras de negócio dentro dos controllers
- Com validações centralizadas quando fizer sentido
- Com DTOs bem definidos
- Com tratamento de erro profissional
- Com documentação Swagger completa
- Com seed funcional
- Com Docker funcionando

---

## Resultado esperado

Ao final, gere o projeto completo com todos os arquivos necessários.

Não entregue apenas trechos de código.

Implemente a aplicação inteira de forma funcional, pronta para subir em um repositório GitHub.

Garanta que os comandos abaixo funcionem:

```bash
docker compose up -d
npm install
npx prisma migrate dev
npx prisma db seed
npm run start:dev
npm run test
npm run test:e2e
```

A API deve iniciar em:

```http
http://localhost:3000
```

A documentação Swagger deve ficar em:

```http
http://localhost:3000/docs
```

Antes de finalizar, revise se todos os requisitos do teste técnico foram atendidos.

---

## Instrução importante para o Codex

Não simplifique a solução.

Quero uma implementação profissional, como se fosse enviada para uma vaga backend real.

Priorize:

- Consistência
- Boas práticas
- Validações
- Testes
- Documentação
- Organização de pastas
- Observabilidade
- Tratamento de erros
- Código pronto para avaliação técnica
