// app/actions/user.ts
"use server";

import { prisma } from "@/app/utils/prisma";
import { auth } from "@/app/auth/auth";

export type CurrentUserData = {
  name: string;
  email: string;
  phone: string | null;
} | null;

/**
 * 🔹 Получение данных текущего залогиненного пользователя
 */
export async function getCurrentUser(): Promise<CurrentUserData> {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return null;
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
      },
    });

    if (!user) {
      return null;
    }

    return {
      name: user.name,
      email: user.email,
      phone: user.phone,
    };
  } catch (error) {
    console.error("Ошибка получения данных пользователя:", error);
    return null;
  }
}
