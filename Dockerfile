# Development-only Dockerfile for the Dostra CRM frontend.
#
# This image is intentionally optimized for local development:
# - uses the Vite dev server instead of a production build
# - keeps dev dependencies because TypeScript, ESLint, and Vite are needed in dev
# - exposes the default Vite port
# - serves on 0.0.0.0 so Docker port mapping works from the host machine
#
# For production, use a separate Dockerfile that builds static assets and serves them
# through nginx, a CDN, or another production web server.

FROM node:22-bookworm-slim

# Frontend application path inside the container.
WORKDIR /app

# Copy only the package manifests first so Docker can cache dependency installation.
COPY package.json package-lock.json ./

# Install exact dependencies from the lockfile for a reproducible development environment.
RUN npm ci

# Copy the full frontend source into the container.
COPY . .

# Vite's development server listens on port 5173 by default.
EXPOSE 5173

# Start the frontend in development mode.
# - use the Vite dev server
# - bind to all interfaces so the app is reachable through Docker port publishing
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
