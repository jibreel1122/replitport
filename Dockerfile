# Use official Node.js LTS image
FROM node:20-alpine as deps

WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Build stage
FROM node:20-alpine as build
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN npm run build

# Production runtime image
FROM node:20-alpine as runner
WORKDIR /app
ENV NODE_ENV=production

# Only copy production artifacts
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist

# Vercel sets PORT env; app reads it, default 5000
EXPOSE 5000

CMD ["node", "dist/index.js"]

