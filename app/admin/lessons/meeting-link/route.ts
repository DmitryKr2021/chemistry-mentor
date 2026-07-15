// app/api/admin/lessons/meeting-link/route.ts
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { sendMeetingLinkEmail } from "@/app/utils/email";
import { prisma } from "@/app/utils/prisma";
import { auth } from "@/app/auth/auth";

const schema = z.object({
  lessonId: z.string().min(1),
  meetingLink: z.string().url("Некорректная ссылка"),
});

export async function POST(request: NextRequest) {
  try {
    // 🔹 Проверка авторизации
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const body = await request.json();
    const { lessonId, meetingLink } = schema.parse(body);

    console.log("meetingLink==", meetingLink);

    // 🔹 Получаем урок с данными ученика
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { user: true },
    });

    if (!lesson) {
      return NextResponse.json({ error: "Урок не найден" }, { status: 404 });
    }

    // 🔹 Сохраняем ссылку в БД
    const updatedLesson = await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        meetingLink,
      },
    });

    // 🔹 Форматируем дату и время из DateTime
    const lessonDate = lesson.startTime.toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    const lessonTime = lesson.startTime.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
    });

    // 🔹 Отправляем email ученику "в фоне"
    sendMeetingLinkEmail({
      studentEmail: lesson.user.email,
      studentName: lesson.user.name,
      lessonDate,
      lessonTime,
      meetingLink,
      topic: lesson.topic,
    }).catch((err) => {
      console.error("Ошибка отправки email:", err);
    });

    return NextResponse.json({
      success: true,
      message: "Ссылка добавлена и отправлена ученику на email",
      lesson: updatedLesson,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Ошибка валидации", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error adding meeting link:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}

// 🔹 DELETE — удалить ссылку
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Доступ запрещён" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get("lessonId");

    if (!lessonId) {
      return NextResponse.json(
        { error: "Не указан lessonId" },
        { status: 400 },
      );
    }

    await prisma.lesson.update({
      where: { id: lessonId },
      data: {
        meetingLink: null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error removing meeting link:", error);
    return NextResponse.json({ error: "Ошибка сервера" }, { status: 500 });
  }
}
