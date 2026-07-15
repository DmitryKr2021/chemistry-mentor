"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/app/auth/auth";
import { prisma } from "@/app/utils/prisma";

export type AddReviewState = {
  success: boolean;
  error?: string;
};

export async function addReviewAction(
  _prevState: AddReviewState,
  formData: FormData,
): Promise<AddReviewState> {
  const session = await auth();
  const allowedRoles = ["moderator", "admin"];

  if (!session || !allowedRoles.includes(session?.user?.role as string)) {
    return { success: false, error: "Недостаточно прав" };
  }

  const authorName = (formData.get("authorName") as string)?.trim();
  const authorEmail = (formData.get("authorEmail") as string)?.trim() || null;
  const content = (formData.get("content") as string)?.trim();
  const ratingRaw = formData.get("rating") as string;
  const createdAtRaw = (formData.get("createdAt") as string)?.trim();

  const rating = parseInt(ratingRaw, 10);

  if (!authorName || !content || !rating || rating < 1 || rating > 5) {
    return { success: false, error: "Заполните обязательные поля корректно" };
  }

  try {
    await prisma.review.create({
      data: {
        authorName,
        authorEmail: authorEmail ?? "",
        content,
        rating,
        status: "approved", // сразу одобрен
        createdAt: createdAtRaw ? new Date(createdAtRaw) : new Date(),
      },
    });
  } catch (e) {
    console.error(e);
    return { success: false, error: "Ошибка при сохранении отзыва" };
  }

  revalidatePath("/admin/moderation");
  return { success: true };
}
