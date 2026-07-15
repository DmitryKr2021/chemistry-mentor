"use server";

import { prisma } from "@/app/utils/prisma";
import { saltAndHashPassword } from "@/app/utils/password"; // Ваш существующий хелпер
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfile(userId: string, formData: FormData) {
  const name = formData.get("name") as string;
  // Можно добавить phone, bio и т.д., если добавите их в schema.prisma

  try {
    await prisma.user.update({
      where: { id: userId },
      data: { name },
    });

    revalidatePath("/account/profile");
    return { success: true, message: "Профиль успешно обновлен" };
  } catch (error) {
    console.error("Error updating profile:", error);
    return { success: false, message: "Не удалось обновить профиль" };
  }
}

export async function changePassword(
  userId: string,
  currentPassword: string,
  newPassword: string,
) {
  try {
    // 1. Получаем пользователя с паролем
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { pwHash: true },
    });

    if (!user || !user.pwHash) {
      return {
        success: false,
        message: "Пользователь не найден или пароль не установлен",
      };
    }

    // 2. Проверяем текущий пароль
    // Примечание: если ваш хелпер saltAndHashPassword использует bcrypt, то и сравнивать нужно через bcrypt
    const isPasswordValid = await bcrypt.compare(currentPassword, user.pwHash);

    if (!isPasswordValid) {
      return { success: false, message: "Неверный текущий пароль" };
    }

    // 3. Хешируем и сохраняем новый пароль
    const newPwHash = await saltAndHashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { pwHash: newPwHash },
    });

    return { success: true, message: "Пароль успешно изменен" };
  } catch (error) {
    console.error("Error changing password:", error);
    return { success: false, message: "Не удалось изменить пароль" };
  }
}
