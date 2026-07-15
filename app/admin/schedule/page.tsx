import { prisma } from "@/app/utils/prisma";
import { ScheduleGrid } from "./ScheduleGrid";
import { startOfWeek, endOfWeek, addDays, format, parseISO } from "date-fns";
import { ru } from "date-fns/locale";
import type { GroupedLessons, WeekInfo } from "./types";

interface PageProps {
  searchParams: Promise<{ week?: string }>;
}

// Часовой диапазон расписания (8:00 – 22:00)
const START_HOUR = 8;
const END_HOUR = 22;
const HOURS = Array.from(
  { length: END_HOUR - START_HOUR },
  (_, i) => START_HOUR + i,
);

export default async function AdminSchedulePage({ searchParams }: PageProps) {
  const params = await searchParams;

  // Определяем дату начала недели из URL или берём текущую
  const referenceDate = params.week ? parseISO(params.week) : new Date();

  const startDate = startOfWeek(referenceDate, { weekStartsOn: 1 }); // Понедельник
  const endDate = endOfWeek(startDate, { weekStartsOn: 1 }); // Воскресенье
  const days = Array.from({ length: 7 }, (_, i) => addDays(startDate, i));

  const weekLabel = `${format(startDate, "d", { locale: ru })} ${format(
    startDate,
    "LLLL",
    { locale: ru },
  )} – ${format(endDate, "d", { locale: ru })} ${format(endDate, "LLLL", {
    locale: ru,
  })} ${format(endDate, "yyyy")}`;

  const weekInfo: WeekInfo = { startDate, endDate, days, weekLabel };

  // Получаем все уроки за неделю из БД
  const groupedLessons: GroupedLessons = {};

  try {
    const lessons = await prisma.lesson.findMany({
      where: {
        startTime: {
          gte: startDate,
          lte: endDate,
        },
      },
      orderBy: { startTime: "asc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    // Группируем уроки по дню и часу
    lessons.forEach((lesson) => {
      const dayKey = format(lesson.startTime, "yyyy-MM-dd");
      const hourKey = lesson.startTime.getHours().toString().padStart(2, "0");
      const key: `${string}-${string}` = `${dayKey}-${hourKey}`;

      if (!groupedLessons[key]) groupedLessons[key] = [];

      groupedLessons[key].push({
        id: lesson.id,
        topic: lesson.topic,
        startTime: lesson.startTime,
        endTime: lesson.endTime,
        status: lesson.status,
        meetingLink: lesson.meetingLink,
        studentName: lesson.user?.name || "Без имени",
        studentEmail: lesson.user?.email || "—",
      });
    });
  } catch (error) {
    console.error("Ошибка загрузки расписания:", error);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 sm:p-6 max-w-[1600px] mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Сводное расписание
          </h1>
          <p className="text-gray-600 mt-1">
            Все занятия всех учеников на неделю
          </p>
        </div>

        <ScheduleGrid
          weekInfo={weekInfo}
          groupedLessons={groupedLessons}
          hours={HOURS}
        />
      </main>
    </div>
  );
}
