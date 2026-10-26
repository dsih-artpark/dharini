# Stage 1: Build the NestJS app
FROM node:22-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Run the built app
FROM node:22-alpine
WORKDIR /app

# GeoLens seed data (gzipped, ~75 MB). The seeder reads it from
# src/seeder/data at startup, and nest build doesn't emit it into dist.
# Copied first so this rarely-changing layer stays cached across code changes.
COPY src/seeder/data ./src/seeder/data

# Country, state and district rows, loaded into an empty regions table at startup.
COPY regions.sql ./regions.sql

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

EXPOSE 4000

ENV PORT=4000

CMD ["node", "dist/src/main"]