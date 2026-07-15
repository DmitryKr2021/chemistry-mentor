"use server";

import { prisma } from "@/app/utils/prisma";
import { revalidatePath } from "next/cache";
import { auth } from "@/app/auth/auth";

// 🔹 Добавление нового урока
export async function createLesson(formData: FormData) {
  const session = await auth();
  if (
    !session?.user?.id ||
    !["admin", "moderator"].includes(session.user.role)
  ) {
    return { success: false, message: "Нет прав для выполнения операции" };
  }

  try {
    const userId = formData.get("userId") as string;
    const topic = formData.get("topic") as string | null;
    const startTimeStr = formData.get("startTime") as string;
    const endTimeStr = formData.get("endTime") as string;
    const meetingLink = formData.get("meetingLink") as string | null;
    // const homework = formData.get("homework") as string | null;
    const notes = formData.get("notes") as string | null;

    if (!userId || !startTimeStr || !endTimeStr) {
      return { success: false, message: "Заполните обязательные поля" };
    }

    const startTime = new Date(startTimeStr);
    const endTime = new Date(endTimeStr);

    if (endTime <= startTime) {
      return {
        success: false,
        message: "Время окончания должно быть позже начала",
      };
    }

    await prisma.lesson.create({
      data: {
        userId,
        topic: topic || null,
        startTime,
        endTime,
        meetingLink: meetingLink || null,
        // homework: homework || undefined,

        notes: notes || null,
        status: "scheduled",
      },
    });

    revalidatePath("/admin/schedule");
    return { success: true, message: "Урок успешно добавлен" };
  } catch (error) {
    console.error("Ошибка создания урока:", error);
    return { success: false, message: "Не удалось добавить урок" };
  }
}

// 🔹 Добавление домашнего задания
export async function createHomework(formData: FormData) {
  const session = await auth();
  if (
    !session?.user?.id ||
    !["admin", "moderator"].includes(session.user.role)
  ) {
    return { success: false, message: "Нет прав для выполнения операции" };
  }

  try {
    const lessonId = formData.get("lessonId") as string;
    const userId = formData.get("userId") as string;
    const title = formData.get("title") as string;
    const topic = formData.get("topic") as string | null;
    const description = formData.get("description") as string | null;
    const dueDateStr = formData.get("dueDate") as string;
    const fileUrl = formData.get("fileUrl") as string | null;

    if (!userId || !title || !dueDateStr) {
      return { success: false, message: "Заполните обязательные поля" };
    }

    const dueDate = new Date(dueDateStr);

    await prisma.homework.create({
      data: {
        userId,
        lessonId,
        title,
        topic: topic || null,
        description: description || null,
        dueDate,
        fileUrl: fileUrl || null,
        status: "assigned",
      },
    });

    revalidatePath("/admin/homework");
    return { success: true, message: "Домашнее задание успешно добавлено" };
  } catch (error) {
    console.error("Ошибка создания домашнего задания:", error);
    return { success: false, message: "Не удалось добавить задание" };
  }
}

// 🔹 Получение списка всех учеников
export async function getAllStudents() {
  try {
    const students = await prisma.user.findMany({
      where: { role: "user" },
      select: {
        id: true,
        name: true,
        email: true,
      },
      orderBy: { name: "asc" },
    });
    return students;
  } catch (error) {
    console.error("Ошибка получения списка учеников:", error);
    return [];
  }
}
