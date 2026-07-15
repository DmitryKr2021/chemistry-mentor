// app/account/schedule/page.tsx
import { prisma } from "@/app/utils/prisma";
import { ScheduleClient } from "./scheduleClient";
import { Lesson } from "./types";
import { redirect } from "next/navigation";
import { getActualUserId } from "@/app/utils/getActualUserId";
import type { Metadata } from "next";

// 🔹 Кэширование на 60 секунд для производительности
export const revalidate = 60;

// 🔹 SEO-метаданные
export const metadata: Metadata = {
  title: "Моё расписание | Репетитор по химии",
  description:
    "Расписание занятий по химии, ссылки на онлайн-встречи и домашние задания",
};

export default async function SchedulePage() {
  // 🔹 1. Получаем ID текущего пользователя
  const userId = await getActualUserId();

  // 🔹 2. Получаем данные пользователя
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    redirect("/");
  }

  const userName = user.name || "Ученик";

  let lessons: Lesson[] = [];
  let errorOccurred = false;

  try {
    // 🔹 3. Получаем ТОЛЬКО уроки текущего пользователя
    const dbLessons = await prisma.lesson.findMany({
      where: {
        userId: userId,
        status: { in: ["scheduled", "completed"] }, // Исключаем отменённые
      },
      orderBy: { startTime: "asc" },
      include: {
        user: { select: { name: true } },
      },
    });

    // 🔹 4. Трансформируем данные с fallback-значениями
    lessons = dbLessons.map((lesson) => {
      // Если endTime null, ставим время начала + 1 час
      const safeEndTime =
        lesson.endTime || new Date(lesson.startTime.getTime() + 60 * 60 * 1000);

      return {
        id: lesson.id,
        topic: lesson.topic, // ← ДОБАВЛЕНО
        title: lesson.topic || "Тема урока не указана",
        subject: lesson.subject || "Химия",
        startTime: lesson.startTime,
        endTime: safeEndTime,
        status:
          (lesson.status as "scheduled" | "completed" | "cancelled") ||
          "scheduled",
        format: (lesson.format as "online" | "offline") || "online",
        meetingLink: lesson.meetingLink,
        notes: lesson.notes,
        userId: lesson.userId, // ← ДОБАВЛЕНО
        tutorId: lesson.tutorId, // ← ДОБАВЛЕНО
        createdAt: lesson.createdAt, // ← ДОБАВЛЕНО
        updatedAt: lesson.updatedAt, // ← ДОБАВЛЕНО
      };
    });
  } catch (error) {
    console.error("Ошибка загрузки расписания:", error);
    errorOccurred = true;
  }

  // 🔹 Статистика для UI
  const now = new Date();
  const upcomingCount = lessons.filter(
    (l) => l.startTime > now && l.status === "scheduled",
  ).length;
  const completedCount = lessons.filter((l) => l.status === "completed").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-50 to-indigo-200">
      {/* 🔹 Декоративный фон */}
      <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] pointer-events-none" />

      <div className="relative container mx-auto px-4 py-8 max-w-6xl">
        {/* 🔹 Заголовок с приветствием */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <span className="text-2xl">📅</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Расписание занятий
              </h1>
              <p className="text-gray-600">
                Здравствуйте,{" "}
                <span className="font-semibold text-indigo-600">
                  {userName}
                </span>
                !
              </p>
            </div>
          </div>
        </div>

        {/* 🔹 Быстрая статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-gradient-to-br from-purple-50 to-pink-50 border-purple-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">📚</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {lessons.length}
                </div>
                <div className="text-sm text-gray-500">Всего занятий</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow bg-gradient-to-br from-emerald-50 to-cyan-50 border-emerald-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">⏰</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {upcomingCount}
                </div>
                <div className="text-sm text-gray-500">Предстоящих</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-5 shadow-sm border hover:shadow-md transition-shadow bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {completedCount}
                </div>
                <div className="text-sm text-gray-500">Проведённых</div>
              </div>
            </div>
          </div>
        </div>

        {/* 🔹 Сообщение об ошибке */}
        {errorOccurred && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-amber-900">
                  Не удалось загрузить расписание
                </p>
                <p className="text-sm text-amber-700 mt-1">
                  Попробуйте обновить страницу. Если проблема сохраняется,
                  обратитесь к репетитору.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* 🔹 Основной контент */}
        <ScheduleClient lessons={lessons} userName={userName} />

        {/* 🔹 Подсказка для пустого состояния */}
        {lessons.length === 0 && !errorOccurred && (
          <div className="mt-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="text-center">
              <div className="text-4xl mb-3">🎓</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                У вас пока нет запланированных занятий
              </h3>
              <p className="text-gray-600 mb-4">
                Свяжитесь с репетитором для записи на пробное занятие
              </p>
              <a
                href="/contacts"
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                <span>📞</span>
                Связаться с репетитором
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
