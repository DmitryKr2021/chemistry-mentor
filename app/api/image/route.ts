// app/api/image/route.ts
import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

// 🔹 Корень с постами: в Docker это /app/posts/Day 01-50,
// на Windows при локальной разработке — путь из .env
const POSTS_ROOT = process.env.BLOG_CONTENT_PATH || "/app/posts/Day 01-50";

export async function GET(request: NextRequest) {
  const rawPath = request.nextUrl.searchParams.get("path");

  if (!rawPath) {
    return new NextResponse("No path provided", { status: 400 });
  }

  try {
    // 🔹 ШАГ 1: Извлекаем относительную часть пути.
    // Работает и с Windows-путями (d:/React_Apps/.../posts/Day 01-50/Day 001/...)
    // и с Linux-путями (/app/posts/Day 01-50/Day 001/...)
    // и с уже относительными путями (Day 001/...)
    let relativePath = rawPath;

    // Ищем маркер "Day 01-50" в пути и берём всё, что после него
    const marker = "Day 01-50";
    const markerIndex = rawPath.indexOf(marker);
    if (markerIndex !== -1) {
      relativePath = rawPath.slice(markerIndex + marker.length);
      // Убираем начальный слэш или обратный слэш
      relativePath = relativePath.replace(/^[\\/]+/, "");
    }

    // Заменяем обратные слэши (Windows) на прямые (Linux)
    relativePath = relativePath.replace(/\\/g, "/");

    // 🔹 ШАГ 2: Декодируем URL-кодирование (%20 → пробел, кириллица)
    try {
      relativePath = decodeURIComponent(relativePath);
    } catch {
      // Если не удалось декодировать — используем как есть
    }

    // 🔹 ШАГ 3: Склеиваем с корнем постов
    const absolutePath = path.resolve(POSTS_ROOT, relativePath);

    // 🔹 ШАГ 4: Проверка безопасности (защита от ../ и выхода за пределы папки)
    const resolvedRoot = path.resolve(POSTS_ROOT);
    if (!absolutePath.startsWith(resolvedRoot)) {
      console.error("⛔ Forbidden path attempt:", rawPath);
      return new NextResponse("Forbidden: Invalid path", { status: 403 });
    }

    // 🔹 ШАГ 5: Читаем файл
    const fileBuffer = await fs.readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();

    // 🔹 ШАГ 6: Определяем Content-Type (расширенный список)
    const contentTypes: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".gif": "image/gif",
      ".webp": "image/webp",
      ".svg": "image/svg+xml",
      ".bmp": "image/bmp",
    };
    const contentType = contentTypes[ext] || "image/jpeg";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    // 🔹 Подробный лог для диагностики
    console.error("❌ Error reading image:", {
      requestedPath: rawPath,
      postsRoot: POSTS_ROOT,
      error: error instanceof Error ? error.message : String(error),
    });
    return new NextResponse("Image not found", { status: 404 });
  }
}
