# syntax=docker/dockerfile:1

# Next.js 13 OG-image generator.
# Uses the native @resvg/resvg-js addon, so build and run on the same Linux
# base to keep the prebuilt binary compatible. Debian slim (glibc) is used
# for the most reliable native-module support.
FROM node:18-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

# ---- Install all deps (incl. dev) needed to build ----
FROM base AS deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

# ---- Build the Next.js app ----
FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# ---- Install production-only deps for the runtime image ----
FROM base AS prod-deps
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# ---- Runtime ----
FROM base AS runner
ENV NODE_ENV=production
ENV PORT=3000

# Run as an unprivileged user
RUN groupadd --system --gid 1001 nodejs \
 && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=builder  /app/.next        ./.next
# public/ holds the Inter fonts read at runtime via a relative path (public/fonts/*.ttf)
COPY --from=builder  /app/public       ./public
COPY --from=builder  /app/package.json ./package.json

USER nextjs

EXPOSE 3000
# `yarn start` -> `next start --port ${PORT-3000}`
CMD ["yarn", "start"]
