FROM oven/bun:1 as base
WORKDIR /usr/src/app

COPY packages/compile/src src

ENTRYPOINT ["bun", "run", "src/main.ts"]
