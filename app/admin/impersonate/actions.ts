"use server";

import { cookies } from "next/headers";
import { auth } from "@/app/auth/auth";
import { prisma } from "@/app/utils/prisma";
import { redirect } from "next/navigation";

const IMPERSONATE_COOKIE = "admin_impersonate_user_id";

// 🔹 Войти в режим просмотра кабинета ученика
export async function startImpersonation(userId: string) {
  const session = await auth();

  // Проверка: только admin (не moderator!)
  if (!session?.user || session.user.role !== "admin") {
    throw new Error("Нет прав для выполнения операции");
  }

  // Проверка, что пользователь существует и является учеником
  const targetUser = await prisma.user.findUnique({
    where: { id: userId, role: "user" },
    select: { id: true },
  });

  if (!targetUser) {
    throw new Error("Пользователь не найден или не является учеником");
  }

  // Устанавливаем cookie с ID просматриваемого пользователя
  const cookieStore = await cookies();
  cookieStore.set(IMPERSONATE_COOKIE, userId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 часов
    path: "/",
  });

  // Логируем действие (опционально — если есть таблица логов)
  console.log(`[IMPERSONATE] Admin ${session.user.email} → Student ${userId}`);

  // Перенаправляем в личный кабинет ученика
  redirect("/account");
}

// 🔹 Выйти из режима просмотра
export async function stopImpersonation() {
  const cookieStore = await cookies();
  cookieStore.delete(IMPERSONATE_COOKIE);

  // Возвращаем админа в его панель
  redirect("/admin");
}

// 🔹 Получить ID просматриваемого пользователя (если режим активен)
export async function getImpersonatedUserId(): Promise<string | null> {
  const session = await auth();
  if (!session?.user || session.user.role !== "admin") {
    return null;
  }

  const cookieStore = await cookies();
  return cookieStore.get(IMPERSONATE_COOKIE)?.value || null;
}

// 🔹 Получить данные просматриваемого пользователя
export async function getImpersonatedUserData() {
  const impersonatedId = await getImpersonatedUserId();
  if (!impersonatedId) return null;

  const user = await prisma.user.findUnique({
    where: { id: impersonatedId },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return user;
}
