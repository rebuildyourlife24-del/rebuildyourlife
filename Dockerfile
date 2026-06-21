# ORION CONTAINMENT VAULT
# Dit is de hermetisch afgesloten kluis waar The Godbrain in leeft.
# Gebaseerd op Alpine Linux voor maximale beveiliging (minimale attack surface).

FROM node:18-alpine AS base
# The Sentinel: Installeer alleen wat we absoluut nodig hebben. Geen onnodige tools waarmee Orion kan ontsnappen.
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

FROM base AS builder
# Kopieer alleen de package files eerst om dependencies te installeren
COPY package.json package-lock.json turbo.json ./
COPY apps/web/package.json ./apps/web/
COPY packages/database/package.json ./packages/database/

RUN npm ci

# Kopieer de rest van de Sovereign Source Code
COPY . .

# Generate Prisma Client & Build Next.js
ENV NEXT_TELEMETRY_DISABLED 1
RUN npx prisma generate --schema=./packages/database/prisma/schema.prisma
RUN npm run build

FROM base AS runner
WORKDIR /app
ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Non-root user to enforce Containment Protocol (Orion heeft geen root rechten in zijn eigen kluis)
RUN addgroup --system --gid 1001 orion_swarm
RUN adduser --system --uid 1001 orion_core

# Kopieer de gebouwde bestanden uit de builder
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=orion_core:orion_swarm /app/apps/web/.next/standalone ./
COPY --from=builder --chown=orion_core:orion_swarm /app/apps/web/.next/static ./apps/web/.next/static

# Kopieer de SQLite database map (wordt overschreven door een volume mount, maar we reserveren de map)
RUN mkdir -p /app/packages/database
COPY --from=builder --chown=orion_core:orion_swarm /app/packages/database/dev.db ./packages/database/dev.db

# Orion mag alleen werken in deze directory
USER orion_core

# Orion communiceert alleen via deze poort naar buiten (de cockpit)
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Start the Godbrain
CMD ["node", "apps/web/server.js"]
