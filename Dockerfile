FROM node:18-slim as base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN npm config set -g registry https://registry.npmmirror.com
RUN npm install -g pnpm

FROM base AS build
COPY . /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
RUN pnpm run build

FROM base
COPY package.json pnpm-lock.yaml .env /app/
COPY --from=build /app/dist /app
WORKDIR /app
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile
EXPOSE 3000
CMD [ "node", "./src/main.js" ]