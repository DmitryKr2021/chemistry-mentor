import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/app/utils/prisma";
import { auth } from "@/app/auth/auth";

const ContentSchema = z.object({
  content: z
    .string()
    .min(10, "Минимум 10 символов")
    .max(2000, "Максимум 2000 символов"),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    const allowedRoles = ["moderator", "admin"] as const;
    const userRole = session?.user?.role as string | undefined;

    if (
      !session?.user?.role ||
      !allowedRoles.includes(userRole as "moderator" | "admin")
    ) {
      console.warn("🚫 Access denied for role:", userRole);
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json(
        { error: "Пустое тело запроса" },
        { status: 400 },
      );
    }
    const parsed = ContentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Текст должен быть от 10 до 2000 символов" },
        { status: 400 },
      );
    }

    // 🔹 Проверяем, существует ли отзыв
    const existing = await prisma.review.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
    }

    const review = await prisma.review.update({
      where: { id },
      data: { content: parsed.data.content },
    });

    console.log("✅ Review updated:", review.id);
    return NextResponse.json(review);
  } catch (error: unknown) {
    const err = error instanceof Error ? error : new Error(String(error));

    console.error("❌ Content update error:", {
      name: err.name,
      message: err.message,
      code: (err as { code?: string }).code, // 🔹 Безопасное приведение без any
    });

    // 🔹 Проверка кода через опциональную цепочку
    if ((err as { code?: string }).code === "P2025") {
      return NextResponse.json({ error: "Отзыв не найден" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Внутренняя ошибка сервера", message: err.message },
      { status: 500 },
    );
  }
}
