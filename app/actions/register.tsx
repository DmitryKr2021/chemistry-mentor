"use server";

import { IFormData } from "@/types/form-data";
import { saltAndHashPassword } from "@/app/utils/password";
import { prisma } from "@/app/utils/prisma";
import { headers } from "next/headers";
import {
  sendWelcomeEmail,
  sendAdminNewUserNotification,
} from "@/app/utils/email"; // 🔹 НОВОЕ: импорт функции
import { after } from "next/server";
import myDomain from "../config/site.config";

type RegisterResult =
  | {
      success: true;
      user: {
        id: string;
        name: string;
        email: string;
        pwHash: string;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  | { success: false; error: string };

export async function registerUser(
  formData: IFormData,
): Promise<RegisterResult> {
  const { name, email, password, confirmPassword, consent } = formData;

  // 🔹 Проверка согласия
  if (!consent) {
    return {
      success: false,
      error: "Необходимо согласие на обработку персональных данных",
    };
  }

  if (password !== confirmPassword) {
    return { success: false, error: "Пароли не совпадают" };
  }

  if (password.length < 6) {
    return { success: false, error: "Пароль должен быть не менее 6 символов" };
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser)
      return {
        success: false,
        error: "Пользователь с таким email уже существует",
      };

    const pwHash = await saltAndHashPassword(password);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        pwHash,
      },
    });

    // 🔹 Сохраняем согласие на обработку персональных данных
    try {
      const headersList = await headers();
      const ipAddress =
        headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
        headersList.get("x-real-ip") ||
        "unknown";
      const userAgent = headersList.get("user-agent") || "unknown";

      await prisma.consent.create({
        data: {
          userId: user.id,
          email: user.email,
          policyVersion: "1.0",
          consentType: "registration",
          ipAddress,
          userAgent,
          isActive: true,
        },
      });

      console.log(`[CONSENT] Saved for user ${user.id} from IP ${ipAddress}`);
    } catch (consentError) {
      console.error("Ошибка сохранения согласия:", consentError);
    }

    // 🔹 Отправка приветственного email в фоне
    // Используем after() из Next.js — это гарантирует, что email отправится
    // даже после того, как Server Action вернёт результат
    after(async () => {
      try {
        // Получаем URL сайта из переменных окружения
        const siteUrl =
          process.env.NEXT_PUBLIC_SITE_URL ||
          process.env.NEXTAUTH_URL ||
          `${myDomain}`;

        const result = await sendWelcomeEmail({
          studentEmail: user.email,
          studentName: user.name,
          siteUrl,
        });

        if (result.success) {
          console.log(
            `✅ [EMAIL] Приветственное письмо отправлено на ${user.email}`,
          );
        } else {
          console.error(
            `❌ [EMAIL] Не удалось отправить письмо на ${user.email}:`,
            result.error,
          );
        }

        // 2. Отправляем уведомление администратору
        const adminResult = await sendAdminNewUserNotification({
          userName: user.name,
          userEmail: user.email,
          userId: user.id,
        });

        if (adminResult.success) {
          console.log(
            `✅ [ADMIN EMAIL] Уведомление о новом пользователе отправлено админу`,
          );
        } else {
          console.error(
            `❌ [ADMIN EMAIL] Ошибка отправки уведомления админу:`,
            adminResult.error,
          );
        }
      } catch (emailError) {
        // Ошибка email не должна ломать регистрацию
        console.error(
          "❌ [EMAIL] Критическая ошибка отправки email:",
          emailError,
        );
      }
    });

    return { success: true, user };
  } catch (error) {
    console.error("Ошибка регистрации", error);
    return { success: false, error: "Ошибка при регистрации" };
  }
}
