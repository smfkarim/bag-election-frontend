# Stage 1: Base image with dependencies
FROM node:22.21.0-alpine3.22 AS base

RUN apk add --no-cache g++ make py3-pip libc6-compat

WORKDIR /app

COPY package*.json ./

EXPOSE 3000

# Stage 2: Install dependencies and build the app
FROM base AS builder

RUN npm install --legacy-peer-deps

COPY . .

COPY .env.example .env

RUN npm run build

# Stage 3: Production image
FROM base AS production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

USER nextjs

WORKDIR /app

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

CMD ["npm", "start"]