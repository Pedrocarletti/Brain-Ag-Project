FROM node:22-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

FROM node:22-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rural_producers?schema=public" npx prisma generate && npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
COPY prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY scripts ./scripts
RUN npm ci --omit=dev \
  && DATABASE_URL="postgresql://postgres:postgres@localhost:5432/rural_producers?schema=public" npx prisma generate \
  && npm cache clean --force
COPY --from=build /app/dist ./dist
EXPOSE 3000
USER node
CMD ["sh", "-c", "node scripts/validate-runtime-env.mjs && npx prisma migrate deploy && node dist/main.js"]
