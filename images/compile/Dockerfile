# See https://pnpm.io/docker
FROM node:18-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable

VOLUME /data

COPY . /app
WORKDIR /app

FROM base AS prod-deps
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

FROM base AS build
RUN --mount=type=cache,id=pnpm,target=/pnpm/store \
    pnpm install --frozen-lockfile && \
    pnpm run --filter core build && \
    pnpm run --filter compile build && \
    pnpm deploy --filter compile --prod /prod/compile

FROM base
COPY --from=build /prod/compile /app

ENTRYPOINT ["node", "/app/dist/esm/main.js"]
