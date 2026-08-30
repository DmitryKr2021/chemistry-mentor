# 🔹 ЭТАП 1: Установка зависимостей
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Копируем только файлы пакетов для кэширования слоя
COPY package.json package-lock.json* ./
RUN npm install

# 🔹 ЭТАП 2: Сборка приложения
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Копируем папку с постами в образ
COPY ./posts ./posts

# Генерируем Prisma Client (обязательно!)
RUN npx prisma generate

# Собираем Next.js (это создаст папку .next/standalone)
RUN npm run build

# 🔹 ЭТАП 3: Минимальный production-образ
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
# ARG RESEND_API_KEY
# ENV RESEND_API_KEY=${RESEND_API_KEY}

# Создаем непривилегированного пользователя для безопасности
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 🔹 КОПИРУЕМ ТОЛЬКО ТО, ЧТО НУЖНО ДЛЯ ЗАПУСКА (Никакого COPY . . !)
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./
COPY --from=builder /app/posts ./posts
COPY --from=deps /app/node_modules ./node_modules

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Применяем миграции БД и запускаем сервер - для деплоя БД
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"] 

# Используем db push, который более гибок для локальной разработки
# CMD ["sh", "-c", "npx prisma db push --accept-data-loss && node server.js"]