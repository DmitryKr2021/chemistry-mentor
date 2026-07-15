"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Filter,
  Plus,
} from "lucide-react";
import { Lesson } from "./types";
import CommonButton from "@/app/components/common/CommonButton";

// 🔹 НОВЫЙ ТИП: гарантированно нормализованные даты
interface NormalizedLesson extends Omit<Lesson, "startTime" | "endTime"> {
  startTime: Date;
  endTime: Date;
}

interface ScheduleClientProps {
  lessons: Lesson[];
  userName: string;
}

export function ScheduleClient({ lessons }: ScheduleClientProps) {
  const [filter, setFilter] = useState<"all" | "upcoming" | "past">("all");

  // 🔹 Явно указываем тип NormalizedLesson[]
  const normalizedLessons: NormalizedLesson[] = lessons.map((lesson) => ({
    ...lesson,
    startTime: new Date(lesson.startTime),
    endTime: lesson.endTime
      ? new Date(lesson.endTime)
      : new Date(new Date(lesson.startTime).getTime() + 60 * 60 * 1000),
  }));

  const now = new Date();

  // Фильтрация уроков
  const filteredLessons = normalizedLessons.filter((lesson) => {
    if (filter === "upcoming") return lesson.startTime >= now;
    if (filter === "past") return lesson.startTime < now;
    return true;
  });

  // Сортировка: ближайшие сначала
  const sortedLessons = [...filteredLessons].sort(
    (a, b) => a.startTime.getTime() - b.startTime.getTime(),
  );

  // Группировка по датам
  const groupedLessons = sortedLessons.reduce<
    Record<string, NormalizedLesson[]>
  >((acc, lesson) => {
    const dateKey = lesson.startTime.toLocaleDateString("ru-RU", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
    if (!acc[dateKey]) acc[dateKey] = [];
    acc[dateKey].push(lesson);
    return acc;
  }, {});

  // 🔹 Теперь функция принимает NormalizedLesson, где startTime гарантированно Date
  const getStatusBadge = (lesson: NormalizedLesson) => {
    const isPast = lesson.startTime < now;
    if (lesson.status === "cancelled") {
      return (
        <Badge variant="destructive" className="gap-1">
          <XCircle className="w-3 h-3" />
          Отменён
        </Badge>
      );
    }
    if (lesson.status === "completed" || isPast) {
      return (
        <Badge
          variant="secondary"
          className="gap-1 bg-slate-100 text-slate-600"
        >
          <CheckCircle2 className="w-3 h-3" />
          Завершён
        </Badge>
      );
    }
    // Проверяем, идёт ли урок прямо сейчас
    const diffMinutes = (lesson.startTime.getTime() - now.getTime()) / 60000;
    if (diffMinutes <= 0 && diffMinutes > -90) {
      return (
        <Badge className="gap-1 bg-emerald-500 hover:bg-emerald-600">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          Идёт сейчас
        </Badge>
      );
    }
    if (diffMinutes <= 30) {
      return (
        <Badge className="gap-1 bg-amber-500 hover:bg-amber-600">
          <AlertCircle className="w-3 h-3" />
          Скоро начнётся
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="border-emerald-200 text-emerald-700">
        Запланирован
      </Badge>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <CommonButton className="bg-emerald-600 hover:bg-emerald-700 gap-2">
        <Plus className="w-4 h-4" />
        Записаться на урок
      </CommonButton>

      {/* Фильтры */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 max-[500px]:h-auto max-[500px]:pt-10">
        <Tabs
          value={filter}
          onValueChange={(v) => setFilter(v as "all" | "upcoming" | "past")}
        >
          <TabsList className="min-[500px]:bg-green-100 bg-white flex w-full h-auto gap-2 p-2 min-[500px]:inline-flex min-[500px]:w-auto min-[500px]:gap-0 min-[500px]:p-1 max-[500px]:flex-col rounded-sm">
            <TabsTrigger
              value="all"
              className="gap-2 cursor-pointer w-full justify-center h-10 rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:font-semibold min-[500px]:w-auto min-[500px]:justify-start min-[500px]:h-9 min-[500px]:rounded-md min-[500px]:bg-transparent min-[500px]:data-[state=active]:bg-white min-[500px]:data-[state=active]:shadow-sm"
            >
              <Filter className="w-4 h-4 flex-shrink-0" />
              Все
            </TabsTrigger>

            <TabsTrigger
              value="upcoming"
              className="gap-2 cursor-pointer w-full justify-center h-10 rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:font-semibold min-[500px]:w-auto min-[500px]:justify-start min-[500px]:h-9 min-[500px]:rounded-md min-[500px]:bg-transparent min-[500px]:data-[state=active]:bg-white min-[500px]:data-[state=active]:shadow-sm"
            >
              <CalendarIcon className="w-4 h-4 flex-shrink-0" />
              Предстоящие
            </TabsTrigger>

            <TabsTrigger
              value="past"
              className="gap-2 cursor-pointer w-full justify-center h-10 rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:font-semibold min-[500px]:w-auto min-[500px]:justify-start min-[500px]:h-9 min-[500px]:rounded-md min-[500px]:bg-transparent min-[500px]:data-[state=active]:bg-white min-[500px]:data-[state=active]:shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Прошедшие
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <p className="text-sm text-slate-500 max-[500px]:mt-5">
          Показано уроков:{" "}
          <span className="font-semibold text-slate-700">
            {sortedLessons.length}
          </span>
        </p>
      </div>

      {/* Список уроков по датам */}
      {sortedLessons.length === 0 ? (
        <Card className="py-16 text-center">
          <CardContent>
            <CalendarIcon className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">
              Уроков не найдено
            </h3>
            <p className="text-slate-500 mt-1">
              {filter === "upcoming"
                ? "У вас пока нет запланированных уроков."
                : "По выбранному фильтру уроки не найдены."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLessons).map(([date, dateLessons]) => {
            const isToday =
              new Date(dateLessons[0].startTime).toDateString() ===
              now.toDateString();
            return (
              <div key={date}>
                <div className="flex items-center gap-3 mb-3">
                  <h2
                    className={cn(
                      "text-lg font-semibold",
                      isToday ? "text-emerald-700" : "text-slate-700",
                    )}
                  >
                    {isToday
                      ? "Сегодня"
                      : date.charAt(0).toUpperCase() + date.slice(1)}
                  </h2>
                  {isToday && (
                    <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
                      Сегодня
                    </Badge>
                  )}
                  <div className="flex-1 h-px bg-slate-200" />
                </div>

                <div className="grid gap-3">
                  {dateLessons.map((lesson) => {
                    const isPast = lesson.startTime < now;
                    return (
                      <Card
                        key={lesson.id}
                        className={cn(
                          "transition-all hover:shadow-md",
                          isPast && "opacity-75",
                          "p-0",
                        )}
                      >
                        <CardContent className="p-0">
                          <div className="flex flex-col sm:flex-row">
                            {/* Цветная полоса слева */}
                            <div
                              className={cn(
                                "w-full sm:w-2 sm:min-h-full rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none",
                                lesson.status === "cancelled"
                                  ? "bg-red-400"
                                  : lesson.status === "completed" || isPast
                                    ? "bg-slate-300"
                                    : "bg-gradient-to-b from-emerald-400 to-cyan-500",
                              )}
                            />

                            {/* Содержимое */}
                            <div className="flex-1 p-5">
                              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                <div className="flex-1">
                                  <div className="flex flex-wrap items-center gap-2 mb-2">
                                    {getStatusBadge(lesson)}
                                    <Badge
                                      variant="outline"
                                      className={cn(
                                        "gap-1",
                                        lesson.format === "online"
                                          ? "border-blue-200 text-blue-700"
                                          : "border-orange-200 text-orange-700",
                                      )}
                                    >
                                      {lesson.format === "online" ? (
                                        <Video className="w-3 h-3" />
                                      ) : (
                                        <MapPin className="w-3 h-3" />
                                      )}
                                      {lesson.format === "online"
                                        ? "Онлайн"
                                        : "Очно"}
                                    </Badge>
                                  </div>

                                  <h3 className="text-lg font-semibold text-slate-800 mb-1">
                                    {lesson.topic}
                                  </h3>

                                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                                    <div className="flex items-center gap-1.5">
                                      <Clock className="w-4 h-4" />
                                      <span>
                                        {lesson.startTime.toLocaleTimeString(
                                          "ru-RU",
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          },
                                        )}{" "}
                                        –{" "}
                                        {lesson.endTime.toLocaleTimeString(
                                          "ru-RU",
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          },
                                        )}
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                {/* Кнопки действий */}
                                <div className="flex sm:flex-col gap-2 sm:items-end">
                                  {lesson.format === "online" &&
                                    lesson.meetingLink &&
                                    !isPast &&
                                    lesson.status !== "cancelled" && (
                                      <CommonButton
                                        size="sm"
                                        className="w-full"
                                      >
                                        <a
                                          href={lesson.meetingLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="flex items-center gap-2 whitespace-nowrap"
                                        >
                                          <Video className="w-4 h-4" />
                                          Подключиться
                                        </a>
                                      </CommonButton>
                                    )}
                                  {!isPast && lesson.status !== "cancelled" && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="cursor-pointer"
                                    >
                                      Подробнее
                                    </Button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
