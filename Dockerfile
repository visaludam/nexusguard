# syntax=docker/dockerfile:1

# ---- Build stage ----
FROM node:20-slim AS build
WORKDIR /app

# Install all deps (incl. dev) for the build; cached unless the lockfile changes
COPY package.json package-lock.json ./
RUN npm ci

# Build the Vite client and bundle the server (-> dist/ and dist/server.cjs)
COPY . .
RUN npm run build

# ---- Runtime stage ----
FROM node:20-slim
WORKDIR /app
ENV NODE_ENV=production

# Only production dependencies are needed at runtime
COPY package.json package-lock.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copy the built client assets and bundled server
COPY --from=build /app/dist ./dist

# Cloud Run injects PORT (default 8080); the server reads process.env.PORT
EXPOSE 8080
CMD ["node", "dist/server.cjs"]
