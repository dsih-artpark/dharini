# syntax=docker.io/docker/dockerfile:1
# Multi-stage Dockerfile for Next.js

# Use ARG to make Node version configurable from .nvmrc
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS base
WORKDIR /app
RUN apk add --no-cache libc6-compat ca-certificates

# -----------------------
# Dependencies
# -----------------------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm install

# -----------------------
# Builder stage
# -----------------------
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# NEXT_PUBLIC_* settings are not set here: they are read when the container
# starts (see env.ts), so one image works for every deployment.
ENV NODE_ENV=production

RUN npm run build

# -----------------------
# Runner (runtime)
# -----------------------
ARG NODE_VERSION=22
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app

RUN addgroup --system nodejs && adduser --system --ingroup nodejs nextjs

ARG PORT=3000
ENV NODE_ENV=production \
    PORT=${PORT}

EXPOSE ${PORT}

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

USER nextjs

HEALTHCHECK --interval=10s --timeout=5s --start-period=40s --retries=3 \
    CMD sh -c "wget --no-verbose --tries=1 --spider http://127.0.0.1:${PORT} || exit 1"

CMD ["node", "server.js"]
