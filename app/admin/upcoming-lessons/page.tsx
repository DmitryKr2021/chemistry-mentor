// app/admin/upcoming-lessons/page.tsx
import { prisma } from "@/app/utils/prisma";
import { MeetingLinkManager } from "./MeetingLinkManager";

interface LessonWithUser {
  id: string;
  topic: string | null;
  subject: string;
  startTime: Date;
  endTime: Date | null;
  meetingLink: string | null;
  format: string;
  status: string;
  notes: string | null;
  userId: string;
  tutorId: string | null;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export const metadata = {
  title: "Ссылки на уроки | Админ-панель",
};

export default async function UpcomingLessonsPage() {
  const now = new Date();

  // 🔹 Все будущие уроки со статусом "scheduled"
  const allLessons = await prisma.lesson.findMany({
    where: {
      startTime: { gte: now },
      status: "scheduled",
    },
    include: { user: true },
    orderBy: [{ startTime: "asc" }],
  });

  // 🔹 Разделяем на две группы
  const needsLink = allLessons.filter((l) => !l.meetingLink);
  const hasLink = allLessons.filter((l) => l.meetingLink);

  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">🔗 Ссылки на уроки</h1>
        <p className="text-sm text-gray-600">
          Добавьте ссылку на Яндекс.Телемост перед уроком — она отправится
          ученику на email
        </p>
      </div>

      {/* 🔹 СЕКЦИЯ 1: Требуют ссылку (главное) */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
          <span className="text-amber-600">⚠️ Требуют ссылку</span>
          <span className="text-sm font-normal text-gray-500">
            ({needsLink.length})
          </span>
        </h2>

        {needsLink.length === 0 ? (
          <div className="p-6 bg-green-50 border border-green-200 rounded-lg text-center">
            <p className="text-green-700 font-medium">
              ✅ Все уроки имеют ссылки
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {needsLink.map((lesson) => (
              <LessonCard key={lesson.id} lesson={lesson} urgent />
            ))}
          </div>
        )}
      </section>

      {/* 🔹 СЕКЦИЯ 2: Ссылки уже добавлены (для справки) */}
      {hasLink.length > 0 && (
        <section>
          <details>
            <summary className="text-lg font-semibold mb-3 cursor-pointer flex items-center gap-2 text-gray-600 hover:text-gray-900">
              <span>✅ Ссылки добавлены</span>
              <span className="text-sm font-normal">({hasLink.length})</span>
            </summary>
            <div className="space-y-2 mt-3">
              {hasLink.map((lesson) => (
                <LessonCard key={lesson.id} lesson={lesson} />
              ))}
            </div>
          </details>
        </section>
      )}
    </div>
  );
}

// 🔹 Компонент карточки урока
function LessonCard({
  lesson,
  urgent = false,
}: {
  lesson: LessonWithUser;
  urgent?: boolean;
}) {
  const now = new Date();

  // 🔹 Форматируем время из DateTime
  const startTimeStr = lesson.startTime.toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTimeStr = lesson.endTime
    ? lesson.endTime.toLocaleTimeString("ru-RU", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  // 🔹 Форматируем дату
  const dateStr = lesson.startTime.toLocaleDateString("ru-RU", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  // 🔹 Расчёт времени до урока
  const minutesUntil = Math.round(
    (lesson.startTime.getTime() - now.getTime()) / (1000 * 60),
  );
  const isSoon = minutesUntil > 0 && minutesUntil <= 60; // В течение часа

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        urgent
          ? isSoon
            ? "bg-red-50 border-red-300" // 🔥 Срочно — в течение часа
            : "bg-amber-50 border-amber-200"
          : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-start justify-between gap-4 flex-wrap">
        {/* Информация */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xl font-bold text-indigo-600">
              {startTimeStr}
            </span>
            {endTimeStr && (
              <span className="text-sm text-gray-500">→ {endTimeStr}</span>
            )}
            <span className="text-sm text-gray-600">• {dateStr}</span>
            {isSoon && urgent && (
              <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                🔥 Скоро
              </span>
            )}
          </div>

          {/* Имя ученика */}
          <div className="font-medium">👤 {lesson.user.name || "Ученик"}</div>

          {/* Предмет и формат */}
          <div className="text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
            <span>📚 {lesson.subject}</span>
            {lesson.format === "online" && <span>• 💻 Онлайн</span>}
            {lesson.format === "offline" && <span>• 🏠 Очно</span>}
          </div>

          {/* Тема */}
          {lesson.topic && (
            <div className="text-sm text-gray-700 mt-1">
              📝 <b>Тема:</b> {lesson.topic}
            </div>
          )}

          {/* Ссылка на встречу (если есть) */}
          {lesson.meetingLink && (
            <a
              href={lesson.meetingLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-600 hover:underline mt-2 inline-block truncate max-w-sm"
            >
              🔗 {lesson.meetingLink}
            </a>
          )}
        </div>

        {/* Форма */}
        <MeetingLinkManager
          lessonId={lesson.id}
          initialLink={lesson.meetingLink}
        />
      </div>
    </div>
  );
}
