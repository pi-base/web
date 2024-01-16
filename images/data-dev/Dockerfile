# See https://pnpm.io/docker
FROM node:20-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

EXPOSE 3141/tcp
EXPOSE 4173/tcp

RUN corepack enable

VOLUME /data

COPY . /app
WORKDIR /app

COPY ./images/data-dev/entrypoint.sh /app/entrypoint.sh
RUN chmod +x /app/entrypoint.sh

RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

ENTRYPOINT ["/bin/bash", "/app/entrypoint.sh"]
