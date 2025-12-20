FROM oven/bun

ARG BUILD_TIME
ARG GIT_TAG

WORKDIR /app

COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

COPY tsconfig.json ./
COPY src ./src

RUN bun install --frozen-lockfile --production

RUN addgroup --system appuser && adduser --system --group appuser
USER appuser

ENV BUILD_TIME=${BUILD_TIME}
ENV GIT_TAG=${GIT_TAG}

CMD ["bun", "run", "start"]
