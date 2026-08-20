import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import mammoth from "mammoth";
import { auth } from "@/app/auth/auth";

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const formData = await request.formData();
    const docxFile = formData.get("docx") as File;
    const imageFile = formData.get("image") as File;
    const dayNumber = formData.get("dayNumber") as string;
    const rubric = formData.get("rubric") as string;

    if (!docxFile || !dayNumber || !rubric) {
      return NextResponse.json(
        { error: "Отсутствуют обязательные поля" },
        { status: 400 },
      );
    }

    // Создаём папку для загрузок
    const uploadDir = path.join(
      process.cwd(),
      "public",
      "uploads",
      "blog",
      dayNumber,
      rubric,
    );
    await mkdir(uploadDir, { recursive: true });

    // Сохраняем DOCX
    const docxBuffer = Buffer.from(await docxFile.arrayBuffer());
    const docxPath = path.join(uploadDir, docxFile.name);
    await writeFile(docxPath, docxBuffer);

    // Конвертируем DOCX → HTML
    const result = await mammoth.convertToHtml({ path: docxPath });
    let html = result.value;

    // Оборачиваем первый <p> в <h2>
    html = html.replace(
      /^<p>(.*?)<\/p>/,
      '<h2 class="text-3xl font-bold mb-6">$1</h2>',
    );

    let imagePath: string | null = null;

    // Сохраняем изображение (если есть)
    if (imageFile) {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
      const imagePathFull = path.join(uploadDir, imageFile.name);
      await writeFile(imagePathFull, imageBuffer);
      imagePath = `/uploads/blog/${dayNumber}/${rubric}/${imageFile.name}`;
    }

    // Извлекаем заголовок из имени файла (без расширения)
    const title = docxFile.name.replace(/\.docx$/i, "");

    return NextResponse.json({
      success: true,
      data: {
        title,
        contentHtml: html,
        imagePath,
        dayNumber,
        rubric,
        excerpt: html
          .replace(/<\/(p|h[1-6]|div|li)>/gi, " ")
          .replace(/<[^>]*>/g, "")
          .replace(/\s+/g, " ")
          .trim()
          .slice(0, 160),
      },
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Ошибка загрузки файлов" },
      { status: 500 },
    );
  }
}
