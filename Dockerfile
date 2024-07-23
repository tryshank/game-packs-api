# Stage 1: Build the application
FROM node:18-alpine AS builder

RUN npm install -g pnpm

WORKDIR /usr/src/app

COPY package.json pnpm-lock.yaml ./

RUN pnpm install

COPY . .

RUN pnpm run build

# Stage 2: Create the final image
FROM node:18-alpine

WORKDIR /usr/src/app

RUN npm install -g pnpm

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --prod

COPY --from=builder /usr/src/app/dist ./dist

USER node

CMD ["node", "dist/main"]