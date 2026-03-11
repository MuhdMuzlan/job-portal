# ── Stage 1: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source and generate Prisma client
COPY prisma ./prisma/
RUN npx prisma generate

# Copy remaining source and build
COPY . .
RUN npm run build

# ── Stage 2: Runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev

# Copy Prisma files (schema + generated client + migrations)
COPY --from=builder /app/prisma ./prisma/
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma/
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma/

# Copy compiled output
COPY --from=builder /app/dist ./dist/

EXPOSE 4000

# Run migrations then start server
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/index.js"]
