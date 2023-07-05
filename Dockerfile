FROM node:18-alpine AS builder
WORKDIR /app

ARG BUILD_ROOT_URL
ENV NEXT_PUBLIC_ROOT_URL $BUILD_ROOT_URL
ARG BUILD_SITE_ID
ENV NEXT_PUBLIC_SITE_ID $BUILD_SITE_ID
ARG BUILD_ANALYTICS_URL
ENV NEXT_PUBLIC_ANALYTICS_URL $BUILD_ANALYTICS_URL
ARG BUILD_ANALYTICS_SITE_ID
ENV NEXT_PUBLIC_ANALYTICS_SITE_ID $BUILD_ANALYTICS_SITE_ID

RUN npm install -g pnpm
COPY package.json ./
COPY prisma ./prisma
RUN pnpm install

COPY . .

ENV NODE_ENV=production
RUN npx prisma generate
RUN pnpm build

FROM node:18-alpine
WORKDIR /app

ENV NODE_ENV=production
RUN npm install prisma
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["npm", "run", "start:prod"]
