FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
COPY . /app
WORKDIR /app

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store  pnpm i --frozen-lockfile
RUN pnpm build

FROM node:20-slim AS production-stage
ENV NODE_ENV=production
ENV PORT=8787
ENV DATA_DIR=/app/data
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app
COPY --from=build /app/package.json /app/pnpm-lock.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm i --prod --frozen-lockfile
COPY --from=build /app/dist ./dist
COPY --from=build /app/server ./server
EXPOSE 8787
CMD ["node", "server/index.js"]
