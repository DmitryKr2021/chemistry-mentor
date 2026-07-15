// app/components/account/UpcomingLessons.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, Video, BookOpen, FileText } from "lucide-react";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import Link from "next/link";

// 🔹 Тип домашнего задания (соответствует модели Prisma)
export interface Homework {
  id: string;
  title: string;
  topic: string | null;
  description: string | null;
  dueDate: Date;
  status: string;
  grade: number | null;
  feedback: string | null;
  fileUrl: string | null;
  studentFile: string | null;
  userId: string;
  lessonId: string;
  createdAt: Date;
  updatedAt: Date;
}

// 🔹 Тип урока (соответствует модели Prisma)
export interface Lesson {
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
  // 🔹 homework — это объект или null, а не строка!
  homework?: Homework | null;
}

interface UpcomingLessonsProps {
  lessons: Lesson[];
}

export default function UpcomingLessons({ lessons }: UpcomingLessonsProps) {
  return (
    <Card>
      <CardHeader className="flex flex-col min-[530px]:flex-row min-[530px]:items-center min-[530px]:justify-between gap-3">
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Ближайшие уроки
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">
            Расписание ваших занятий
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="self-start min-[530px]:self-auto"
          asChild
        >
          <Link href="/account/schedule">
            <Calendar className="w-4 h-4 mr-2" />
            Все уроки
          </Link>
        </Button>
      </CardHeader>

      <CardContent>
        {lessons.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <Calendar className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>На ближайшее время уроков не запланировано</p>
          </div>
        ) : (
          <div className="space-y-3">
            {lessons.map((lesson) => {
              // 🔹 Расчёт времени до урока
              const now = new Date();
              const minutesUntil = Math.round(
                (lesson.startTime.getTime() - now.getTime()) / (1000 * 60),
              );
              const isSoon = minutesUntil > 0 && minutesUntil <= 60;

              return (
                <div
                  key={lesson.id}
                  className={`flex flex-col min-[530px]:flex-row min-[530px]:items-center min-[530px]:justify-between p-4 rounded-lg border transition-colors gap-3 ${
                    isSoon
                      ? "bg-indigo-50 border-indigo-300"
                      : lesson.meetingLink
                        ? "bg-emerald-50 border-emerald-200 hover:border-emerald-300"
                        : "bg-slate-50 border-slate-200 hover:border-emerald-300"
                  }`}
                >
                  {/* 🔹 Блок с информацией */}
                  <div className="flex flex-col min-[400px]:flex-row items-center min-[400px]:items-start gap-3 min-[530px]:gap-4 w-full min-[530px]:w-auto">
                    {/* Иконка календаря */}
                    <div
                      className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isSoon
                          ? "bg-indigo-100"
                          : lesson.meetingLink
                            ? "bg-emerald-100"
                            : "bg-slate-100"
                      }`}
                    >
                      <Calendar
                        className={`w-6 h-6 ${
                          isSoon
                            ? "text-indigo-600"
                            : lesson.meetingLink
                              ? "text-emerald-600"
                              : "text-slate-600"
                        }`}
                      />
                    </div>

                    {/* Текст */}
                    <div className="min-w-0 flex-1 text-center min-[400px]:text-left">
                      <h4 className="font-semibold text-slate-800 text-sm min-[530px]:text-base break-words">
                        {lesson.topic || lesson.subject}
                      </h4>

                      {/* Предмет и формат */}
                      <div className="flex flex-wrap items-center justify-center min-[400px]:justify-start gap-2 text-xs text-slate-500 mt-1">
                        <span className="font-medium">{lesson.subject}</span>
                        {lesson.format === "online" && <span>• 💻 Онлайн</span>}
                        {lesson.format === "offline" && <span>• 🏠 Очно</span>}
                      </div>

                      {/* Дата и время */}
                      <div className="flex flex-wrap items-center justify-center min-[400px]:justify-start gap-2 min-[530px]:gap-3 text-xs min-[530px]:text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 min-[530px]:w-4 min-[530px]:h-4 flex-shrink-0" />
                          {format(lesson.startTime, "d MMMM yyyy", {
                            locale: ru,
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 min-[530px]:w-4 min-[530px]:h-4 flex-shrink-0" />
                          {format(lesson.startTime, "HH:mm")}
                          {lesson.endTime && (
                            <> — {format(lesson.endTime, "HH:mm")}</>
                          )}
                        </span>
                        {isSoon && (
                          <Badge
                            variant="destructive"
                            className="text-xs animate-pulse"
                          >
                            ⏰ Скоро
                          </Badge>
                        )}
                      </div>

                      {/* 🔹 Домашнее задание (если есть) */}
                      {lesson.homework && (
                        <div className="mt-2 flex items-start gap-2 p-2 bg-amber-50 border border-amber-200 rounded-md text-left">
                          <BookOpen className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="text-xs font-semibold text-amber-900 flex items-center gap-2">
                              📚 ДЗ: {lesson.homework.title}
                              {lesson.homework.status === "completed" && (
                                <span className="text-green-600">✓</span>
                              )}
                            </div>
                            {lesson.homework.description && (
                              <p className="text-xs text-amber-800 mt-0.5 line-clamp-2">
                                {lesson.homework.description}
                              </p>
                            )}
                            <div className="flex items-center gap-3 mt-1 text-xs text-amber-700">
                              <span>
                                📅 до{" "}
                                {format(lesson.homework.dueDate, "d MMM", {
                                  locale: ru,
                                })}
                              </span>
                              {lesson.homework.fileUrl && (
                                <a
                                  href={lesson.homework.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-1 text-blue-600 hover:underline"
                                >
                                  <FileText className="w-3 h-3" />
                                  Файл
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* 🔹 Блок с действиями */}
                  <div className="flex items-center justify-between min-[530px]:justify-end gap-2 w-full min-[530px]:w-auto pt-2 min-[530px]:pt-0 border-t min-[530px]:border-t-0 border-slate-200">
                    <Badge
                      variant="outline"
                      className={`capitalize text-xs ${
                        lesson.status === "scheduled"
                          ? "text-blue-700 border-blue-300 bg-blue-50"
                          : lesson.status === "completed"
                            ? "text-green-700 border-green-300 bg-green-50"
                            : "text-slate-700"
                      }`}
                    >
                      {lesson.status === "scheduled"
                        ? "Запланирован"
                        : lesson.status === "completed"
                          ? "Проведён"
                          : lesson.status === "cancelled"
                            ? "Отменён"
                            : lesson.status}
                    </Badge>

                    {lesson.meetingLink && (
                      <Button
                        asChild
                        size="sm"
                        className="bg-red-500 hover:bg-red-600 text-xs min-[530px]:text-sm"
                      >
                        <a
                          href={lesson.meetingLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Video className="w-3 h-3 min-[530px]:w-4 min-[530px]:h-4 mr-1 min-[530px]:mr-2" />
                          Войти
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
