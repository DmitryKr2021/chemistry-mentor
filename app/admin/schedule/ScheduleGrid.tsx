"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { format, addWeeks, subWeeks, isToday, isSameDay } from "date-fns";
import { ru } from "date-fns/locale";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Video,
  User,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import type { WeekInfo, GroupedLessons, ScheduleLesson } from "./types";

interface ScheduleGridProps {
  weekInfo: WeekInfo;
  groupedLessons: GroupedLessons;
  hours: number[];
}

export function ScheduleGrid({
  weekInfo,
  groupedLessons,
  hours,
}: ScheduleGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [selectedLesson, setSelectedLesson] = useState<ScheduleLesson | null>(
    null,
  );

  const now = new Date();

  // Навигация по неделям
  const goToWeek = (date: Date) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("week", format(date, "yyyy-MM-dd"));
    router.push(`/admin/schedule?${params.toString()}`);
  };

  const goToPrevWeek = () => goToWeek(subWeeks(weekInfo.startDate, 1));
  const goToNextWeek = () => goToWeek(addWeeks(weekInfo.startDate, 1));
  const goToCurrentWeek = () => goToWeek(new Date());

  // Проверка, является ли урок текущим (идёт прямо сейчас)
  const isLessonHappeningNow = (lesson: ScheduleLesson) => {
    const start = new Date(lesson.startTime).getTime();
    const end = lesson.endTime
      ? new Date(lesson.endTime).getTime()
      : start + 60 * 60 * 1000;
    const nowTime = now.getTime();
    return nowTime >= start && nowTime < end;
  };

  // Цветовая схема по статусу
  const getStatusStyle = (lesson: ScheduleLesson) => {
    if (isLessonHappeningNow(lesson)) {
      return "bg-amber-100 border-amber-400 border-l-4 ring-2 ring-amber-300";
    }
    switch (lesson.status) {
      case "completed":
        return "bg-emerald-50 border-emerald-300 border-l-4 opacity-75";
      case "cancelled":
        return "bg-red-50 border-red-300 border-l-4 opacity-60";
      case "scheduled":
      default:
        return "bg-blue-50 border-blue-300 border-l-4";
    }
  };

  const getStatusBadge = (lesson: ScheduleLesson) => {
    if (isLessonHappeningNow(lesson)) {
      return (
        <Badge className="bg-amber-500 hover:bg-amber-600 text-white text-[10px] px-1.5 py-0">
          Идёт
        </Badge>
      );
    }
    switch (lesson.status) {
      case "completed":
        return (
          <Badge
            variant="secondary"
            className="bg-emerald-100 text-emerald-700 text-[10px] px-1.5 py-0"
          >
            Завершён
          </Badge>
        );
      case "cancelled":
        return (
          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
            Отменён
          </Badge>
        );
      default:
        return (
          <Badge
            variant="outline"
            className="border-blue-300 text-blue-700 text-[10px] px-1.5 py-0"
          >
            Заплан.
          </Badge>
        );
    }
  };

  return (
    <>
      {/* 🔹 ПАНЕЛЬ НАВИГАЦИИ */}
      <Card className="mb-4">
        <CardContent className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="icon"
              onClick={goToPrevWeek}
              className="h-9 w-9 flex-shrink-0"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToCurrentWeek}
              className="gap-2"
            >
              <CalendarIcon className="w-4 h-4" />
              <span className="hidden sm:inline">Сегодня</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={goToNextWeek}
              className="h-9 w-9 flex-shrink-0"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <h2 className="text-base sm:text-lg font-semibold text-gray-800 capitalize text-center sm:text-left">
            {weekInfo.weekLabel}
          </h2>

          <div className="text-xs sm:text-sm text-gray-500 text-center sm:text-right">
            Всего уроков:{" "}
            <span className="font-bold text-gray-800">
              {Object.values(groupedLessons).flat().length}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* 🔹 СЕТКА РАСПИСАНИЯ */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Шапка: дни недели */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-200 bg-gray-50 sticky top-0 z-10">
              <div className="p-2 text-xs font-semibold text-gray-500 text-center border-r border-gray-200">
                Время
              </div>
              {weekInfo.days.map((day) => {
                const isTodayColumn = isToday(day);
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "p-2 text-center border-r border-gray-200 last:border-r-0",
                      isTodayColumn && "bg-blue-50",
                    )}
                  >
                    <div className="text-xs text-gray-500 capitalize">
                      {format(day, "EEEE", { locale: ru })}
                    </div>
                    <div
                      className={cn(
                        "text-lg font-bold mt-0.5",
                        isTodayColumn ? "text-blue-600" : "text-gray-800",
                      )}
                    >
                      {format(day, "d")}
                    </div>
                    {isTodayColumn && (
                      <div className="text-[10px] text-blue-600 font-semibold mt-0.5">
                        Сегодня
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Тело: часы × дни */}
            <div>
              {hours.map((hour) => {
                const isCurrentHour =
                  now.getHours() === hour &&
                  weekInfo.days.some((d) => isSameDay(d, now));

                return (
                  <div
                    key={hour}
                    className={cn(
                      "grid grid-cols-[80px_repeat(7,1fr)] border-b border-gray-100 last:border-b-0",
                      isCurrentHour && "bg-amber-50/30",
                    )}
                  >
                    {/* Метка часа */}
                    <div
                      className={cn(
                        "p-2 text-xs font-semibold text-gray-500 text-center border-r border-gray-200 flex items-center justify-center",
                        isCurrentHour && "text-amber-600 font-bold",
                      )}
                    >
                      {hour.toString().padStart(2, "0")}:00
                    </div>

                    {/* Ячейки дней */}
                    {weekInfo.days.map((day) => {
                      const dayKey = format(day, "yyyy-MM-dd");
                      const hourKey = hour.toString().padStart(2, "0");
                      const cellKey = `${dayKey}-${hourKey}`;
                      const lessons = groupedLessons[cellKey] || [];
                      const isTodayCell = isToday(day);

                      return (
                        <div
                          key={cellKey}
                          className={cn(
                            "min-h-[70px] p-1 border-r border-gray-100 last:border-r-0 relative",
                            isTodayCell && "bg-blue-50/20",
                          )}
                        >
                          {lessons.map((lesson) => (
                            <button
                              key={lesson.id}
                              onClick={() => setSelectedLesson(lesson)}
                              className={cn(
                                "w-full text-left p-1.5 rounded mb-1 last:mb-0 cursor-pointer transition-all hover:shadow-md hover:scale-[1.02] border",
                                getStatusStyle(lesson),
                              )}
                            >
                              <div className="flex items-start justify-between gap-1 mb-0.5">
                                <span className="text-[11px] font-semibold text-gray-800 line-clamp-1 flex-1">
                                  {lesson.studentName}
                                </span>
                                {getStatusBadge(lesson)}
                              </div>
                              <div className="text-[10px] text-gray-600 line-clamp-1">
                                {lesson.topic || "Без темы"}
                              </div>
                              {lesson.meetingLink && (
                                <div className="flex items-center gap-0.5 mt-0.5 text-[10px] text-blue-600">
                                  <Video className="w-2.5 h-2.5" />
                                  <span className="truncate">Онлайн</span>
                                </div>
                              )}
                            </button>
                          ))}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>

      {/* 🔹 МОДАЛЬНОЕ ОКНО С ДЕТАЛЯМИ УРОКА */}
      {selectedLesson && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedLesson(null)}
        >
          <Card
            className="max-w-md w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-xl font-bold text-gray-800">
                  Детали урока
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLesson(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Ученик</p>
                    <p className="font-semibold text-gray-800">
                      {selectedLesson.studentName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedLesson.studentEmail}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500">Тема</p>
                  <p className="font-medium text-gray-800">
                    {selectedLesson.topic || "Не указана"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Время</p>
                    <p className="font-medium text-gray-800">
                      {format(
                        new Date(selectedLesson.startTime),
                        "d MMMM yyyy, EEEE",
                        {
                          locale: ru,
                        },
                      )}
                      <br />
                      <span className="text-sm">
                        {format(new Date(selectedLesson.startTime), "HH:mm")}
                        {selectedLesson.endTime &&
                          ` – ${format(
                            new Date(selectedLesson.endTime),
                            "HH:mm",
                          )}`}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-xs text-gray-500 mb-1">Статус</p>
                  {getStatusBadge(selectedLesson)}
                </div>

                {selectedLesson.meetingLink && (
                  <Button asChild className="w-full gap-2">
                    <a
                      href={selectedLesson.meetingLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Video className="w-4 h-4" />
                      Открыть ссылку на урок
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
