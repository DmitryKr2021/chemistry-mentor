"use server";

import { prisma } from "@/app/utils/prisma";
import { auth } from "@/app/auth/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
// 🔹 Импортируем типы
import type { Consent, ConsentType } from "@/types/consent";

const CURRENT_POLICY_VERSION = "1.0";

async function getRequestMetadata() {
  const headersList = await headers();
  const ipAddress =
    headersList.get("x-forwarded-for")?.split(",")[0].trim() ||
    headersList.get("x-real-ip") ||
    "unknown";
  const userAgent = headersList.get("user-agent") || "unknown";
  return { ipAddress, userAgent };
}

export async function saveConsent(
  consentType: ConsentType,
  email?: string,
): Promise<{ success: boolean; message: string }> {
  try {
    const session = await auth();
    const { ipAddress, userAgent } = await getRequestMetadata();

    const userId = session?.user?.id || null;
    const consentEmail = email || session?.user?.email || null;

    if (userId) {
      const existingConsent = await prisma.consent.findFirst({
        where: {
          userId,
          consentType,
          isActive: true,
        },
      });

      if (existingConsent) {
        return { success: true, message: "Согласие уже было дано ранее" };
      }
    }

    await prisma.consent.create({
      data: {
        userId,
        email: consentEmail,
        policyVersion: CURRENT_POLICY_VERSION,
        consentType,
        ipAddress,
        userAgent,
        isActive: true,
      },
    });

    revalidatePath("/privacy");
    return { success: true, message: "Согласие успешно сохранено" };
  } catch (error) {
    console.error("Ошибка сохранения согласия:", error);
    return { success: false, message: "Не удалось сохранить согласие" };
  }
}

export async function checkUserConsent(
  consentType: ConsentType,
): Promise<boolean> {
  const session = await auth();
  if (!session?.user?.id) return false;

  const consent = await prisma.consent.findFirst({
    where: {
      userId: session.user.id,
      consentType,
      isActive: true,
    },
  });

  return !!consent;
}

export async function revokeConsent(
  consentId: string,
): Promise<{ success: boolean; message: string }> {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, message: "Не авторизован" };
  }

  try {
    const consent = await prisma.consent.findFirst({
      where: { id: consentId, userId: session.user.id },
    });

    if (!consent) {
      return { success: false, message: "Согласие не найдено" };
    }

    await prisma.consent.update({
      where: { id: consentId },
      data: {
        isActive: false,
        revokedAt: new Date(),
      },
    });

    revalidatePath("/privacy");
    return { success: true, message: "Согласие успешно отозвано" };
  } catch (error) {
    console.error("Ошибка отзыва согласия:", error);
    return { success: false, message: "Не удалось отозвать согласие" };
  }
}

export async function getUserConsents(): Promise<Consent[]> {
  const session = await auth();
  if (!session?.user?.id) return [];

  const consents = await prisma.consent.findMany({
    where: { userId: session.user.id },
    orderBy: { consentDate: "desc" },
  });

  return consents;
}
