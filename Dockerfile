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
RUN npm run build

# Stage 3: Production image
FROM base AS production

RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001

WORKDIR /app

# Copy build artifacts from the builder stage
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# OPTIONAL: copy .env from builder into the production image (NOT recommended for secrets)
# If you need the example env baked in for convenience, uncomment the line below.
# WARNING: copying a real `.env` into an image bakes secrets into the image. Prefer runtime env injection.
# If you intentionally want to bake `.env` into the image (e.g., for a disposable staging image),
# uncomment the next line or ensure a `.env` exists in the build context and is copied from the builder.
COPY --from=builder /app/.env .env

# Ensure the runtime user can write to Next.js cache and other runtime locations.
# Do this while still root (before switching to the non-root user).
RUN mkdir -p /app/.next/cache/images \
	&& mkdir -p /app/.next/cache \
	# ensure .env is also owned by runtime user if present
	&& chown -R nextjs:nodejs /app/.next /app/node_modules /app/public /app /app/.env \
	&& chmod -R u+rwX /app/.next /app/node_modules /app/public /app

# Switch to non-root user for runtime
USER nextjs

CMD ["npm", "start"]