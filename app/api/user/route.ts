import { NextResponse } from "next/server";
import { auth } from "@/app/auth/auth";
import { prisma } from "@/app/utils/prisma";

export async function GET() {
  try {
    const session = await auth();

    // 🔒 Проверяем авторизацию
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: "Требуется авторизация" },
        { status: 401 },
      );
    }

    // 🗃️ Запрашиваем только нужные поля по email (гарантированно есть в JWT)
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, name: true, email: true },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден в базе" },
        { status: 404 },
      );
    }

    // ✅ Возвращаем данные клиенту
    return NextResponse.json({
      id: user.id,
      name: user.name ?? "",
      email: user.email,
    });
  } catch (error) {
    console.error("Ошибка загрузки профиля:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" },
      { status: 500 },
    );
  }
}
