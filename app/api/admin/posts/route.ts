import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/app/auth/auth";
import { prisma } from "@/app/utils/prisma";
import { slugify } from "@/app/utils/slugify";

const createPostSchema = z.object({
  title: z.string().min(1, "Заголовок обязателен"),
  contentHtml: z.string().min(1, "Контент обязателен"),
  excerpt: z.string().optional(),
  imagePath: z.string().nullable(),
  dayNumber: z.string().min(1, "День обязателен"),
  rubric: z.string().min(1, "Рубрика обязательна"),
});

export async function POST(request: NextRequest) {
  try {
    // Проверка авторизации
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json();

    // Валидация через Zod
    const validatedData = createPostSchema.parse(body);

    // Генерируем slug
    const slug = slugify(`${validatedData.rubric}-${validatedData.title}`);

    // Проверяем, нет ли поста с таким slug
    const existing = await prisma.blogPost.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: "Пост с таким названием уже существует" },
        { status: 400 },
      );
    }

    // Создаём пост
    const post = await prisma.blogPost.create({
      data: {
        slug,
        title: validatedData.title,
        rubric: validatedData.rubric,
        dayNumber: validatedData.dayNumber,
        contentHtml: validatedData.contentHtml,
        excerpt: validatedData.excerpt,
        imagePath: validatedData.imagePath,
        sourcePath: `upload/${validatedData.dayNumber}/${validatedData.rubric}/${validatedData.title}`,
        tags: [validatedData.dayNumber, validatedData.rubric],
      },
    });

    return NextResponse.json({ success: true, post }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Ошибка валидации", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Create post error:", error);
    return NextResponse.json(
      { error: "Ошибка создания поста" },
      { status: 500 },
    );
  }
}
