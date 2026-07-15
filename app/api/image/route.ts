import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const filePath = searchParams.get("path");

  if (!filePath) {
    return new NextResponse("No path provided", { status: 400 });
  }

  try {
    // 🔒 Безопасность: проверяем, что путь находится внутри нашей директории с постами
    const postsRoot =
      process.env.BLOG_CONTENT_PATH ||
      "d:/React_Apps/Chemistry-tutor/chemistry-tutor/posts/Day 01-50";
    const absolutePath = path.resolve(/* turbopackIgnore: true */ filePath);

    if (
      !absolutePath.startsWith(
        path.resolve(/* turbopackIgnore: true */ postsRoot),
      )
    ) {
      return new NextResponse("Forbidden: Invalid path", { status: 403 });
    }

    // Читаем файл
    const fileBuffer = await fs.readFile(absolutePath);
    const ext = path.extname(absolutePath).toLowerCase();

    // Определяем Content-Type
    const contentType = ext === ".png" ? "image/png" : "image/jpeg";

    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Type": contentType,
        // Кэшируем изображения на 1 год для ускорения загрузки
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error reading image:", error);
    return new NextResponse("Image not found", { status: 404 });
  }
}
