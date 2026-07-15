"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  Filter,
  Download,
  Upload,
  Eye,
} from "lucide-react";
import { formatDistanceToNow, isPast, isToday } from "date-fns";
import { ru } from "date-fns/locale";
import { HomeworkData } from "./page";

interface StatusConfig {
  label: string;
  variant: "default" | "secondary" | "destructive" | "outline";
  color: string;
  bgColor: string;
}

const statusConfig: Record<string, StatusConfig> = {
  assigned: {
    label: "Назначено",
    variant: "outline",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  in_progress: {
    label: "В работе",
    variant: "secondary",
    color: "text-amber-600",
    bgColor: "bg-amber-50",
  },
  submitted: {
    label: "На проверке",
    variant: "secondary",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  completed: {
    label: "Выполнено",
    variant: "default",
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
  },
};

interface HomeworkClientProps {
  homeworks: HomeworkData[];
  userName: string;
}

export function HomeworkClient({ homeworks, userName }: HomeworkClientProps) {
  const [filter, setFilter] = useState<
    "all" | "assigned" | "in_progress" | "submitted" | "completed"
  >("all");
  const [selectedHomework, setSelectedHomework] = useState<HomeworkData | null>(
    null,
  );

  // Фильтрация
  const filteredHomeworks = homeworks.filter((hw) => {
    if (filter === "all") return true;
    return hw.status === filter;
  });

  // Сортировка: срочные сначала
  const sortedHomeworks = [...filteredHomeworks].sort((a, b) => {
    // Сначала задания с просроченным сроком
    const aOverdue = isPast(a.dueDate) && a.status !== "completed";
    const bOverdue = isPast(b.dueDate) && b.status !== "completed";

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;

    // Затем по дате сдачи
    return a.dueDate.getTime() - b.dueDate.getTime();
  });

  // Статистика
  const assignedCount = homeworks.filter(
    (hw) => hw.status === "assigned",
  ).length;
  const inProgressCount = homeworks.filter(
    (hw) => hw.status === "in_progress",
  ).length;
  const completedCount = homeworks.filter(
    (hw) => hw.status === "completed",
  ).length;
  const overdueCount = homeworks.filter(
    (hw) => isPast(hw.dueDate) && hw.status !== "completed",
  ).length;

  const getStatusBadge = (hw: HomeworkData) => {
    const status = statusConfig[hw.status] || statusConfig.assigned;
    const isOverdue = isPast(hw.dueDate) && hw.status !== "completed";

    return (
      <div className="flex items-center gap-2">
        <Badge variant={status.variant} className={status.color}>
          {status.label}
        </Badge>
        {isOverdue && (
          <Badge variant="destructive" className="gap-1">
            <AlertCircle className="w-3 h-3" />
            Просрочено
          </Badge>
        )}
      </div>
    );
  };

  const getDueDateStatus = (dueDate: Date, status: string) => {
    if (status === "completed") {
      return <span className="text-emerald-600 font-medium">Выполнено</span>;
    }

    const isOverdue = isPast(dueDate);
    const isDueToday = isToday(dueDate);

    if (isOverdue) {
      return (
        <span className="text-red-600 font-semibold">
          Просрочено{" "}
          {formatDistanceToNow(dueDate, { addSuffix: true, locale: ru })}
        </span>
      );
    }

    if (isDueToday) {
      return (
        <span className="text-amber-600 font-semibold">
          Сегодня до{" "}
          {dueDate.toLocaleTimeString("ru-RU", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      );
    }

    return (
      <span className="text-slate-600">
        {formatDistanceToNow(dueDate, { addSuffix: true, locale: ru })}
      </span>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Заголовок */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Домашние задания</h1>
        <p className="text-slate-500 mt-1">
          {userName}, вот ваши текущие задания и их статусы.
        </p>
      </div>

      {/* Статистика */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-100 p-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Назначено</p>
                <p className="text-3xl font-bold text-blue-700 mt-1">
                  {assignedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100 p-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">В работе</p>
                <p className="text-3xl font-bold text-amber-700 mt-1">
                  {inProgressCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100 p-0">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 font-medium">Выполнено</p>
                <p className="text-3xl font-bold text-emerald-700 mt-1">
                  {completedCount}
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        {overdueCount > 0 && (
          <Card className="bg-gradient-to-br from-red-50 to-pink-50 border-red-100 p-0">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 font-medium">
                    Просрочено
                  </p>
                  <p className="text-3xl font-bold text-red-700 mt-1">
                    {overdueCount}
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <AlertCircle className="w-6 h-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Фильтры */}
      <div className="flex flex-col min-[700px]:flex-row min-[700px]:items-center min-[700px]:justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 max-[700px]:h-auto max-[700px]:pt-20">
        <Tabs
          value={filter}
          onValueChange={(v) =>
            setFilter(
              v as
                | "all"
                | "assigned"
                | "in_progress"
                | "submitted"
                | "completed",
            )
          }
        >
          <TabsList className="min-[700px]:bg-green-100 bg-white flex w-full h-auto gap-2 p-2 min-[700px]:inline-flex min-[700px]:w-auto min-[700px]:gap-0 min-[700px]:p-1 max-[700px]:flex-col rounded-sm">
            <TabsTrigger
              value="all"
              className="gap-2 cursor-pointer w-full justify-center h-10 rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:font-semibold min-[700px]:w-auto min-[700px]:justify-start min-[700px]:h-9 min-[700px]:rounded-md min-[700px]:bg-transparent min-[700px]:data-[state=active]:bg-white min-[700px]:data-[state=active]:shadow-sm"
            >
              <Filter className="w-4 h-4 flex-shrink-0" />
              Все
            </TabsTrigger>

            <TabsTrigger
              value="assigned"
              className="gap-2 cursor-pointer w-full justify-center h-10 rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:font-semibold min-[700px]:w-auto min-[700px]:justify-start min-[700px]:h-9 min-[700px]:rounded-md min-[700px]:bg-transparent min-[700px]:data-[state=active]:bg-white min-[700px]:data-[state=active]:shadow-sm"
            >
              <FileText className="w-4 h-4" />
              Назначено
            </TabsTrigger>

            <TabsTrigger
              value="in_progress"
              className="gap-2 cursor-pointer w-full justify-center h-10 rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:font-semibold min-[700px]:w-auto min-[700px]:justify-start min-[700px]:h-9 min-[700px]:rounded-md min-[700px]:bg-transparent min-[700px]:data-[state=active]:bg-white min-[700px]:data-[state=active]:shadow-sm"
            >
              <Clock className="w-4 h-4" />В работе
            </TabsTrigger>
            <TabsTrigger
              value="completed"
              className="gap-2 cursor-pointer w-full justify-center h-10 rounded-lg bg-slate-100 text-slate-600 transition-all hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm data-[state=active]:font-semibold min-[700px]:w-auto min-[700px]:justify-start min-[700px]:h-9 min-[700px]:rounded-md min-[700px]:bg-transparent min-[700px]:data-[state=active]:bg-white min-[700px]:data-[state=active]:shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Выполнено
            </TabsTrigger>
          </TabsList>
        </Tabs>
        <p className="text-sm text-slate-500 max-[700px]:mt-10">
          Показано заданий:{" "}
          <span className="font-semibold text-slate-700">
            {sortedHomeworks.length}
          </span>
        </p>
      </div>

      {/* Список заданий */}
      {sortedHomeworks.length === 0 ? (
        <Card className="py-16 text-center">
          <CardContent>
            <CheckCircle2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-700">
              Заданий не найдено
            </h3>
            <p className="text-slate-500 mt-1">
              {filter === "all"
                ? "У вас пока нет домашних заданий."
                : "По выбранному фильтру заданий не найдено."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {sortedHomeworks.map((hw) => {
            const isOverdue = isPast(hw.dueDate) && hw.status !== "completed";

            return (
              <Card
                key={hw.id}
                className={cn(
                  "transition-all hover:shadow-md",
                  isOverdue && "border-red-200 bg-red-50/30",
                )}
              >
                <CardContent className="p-0">
                  <div className="flex flex-col sm:flex-row">
                    {/* Цветная полоса слева */}
                    <div
                      className={cn(
                        "w-full sm:w-2 sm:min-h-full rounded-t-lg sm:rounded-l-lg sm:rounded-tr-none",
                        isOverdue
                          ? "bg-red-400"
                          : hw.status === "completed"
                            ? "bg-emerald-400"
                            : hw.status === "in_progress"
                              ? "bg-amber-400"
                              : "bg-blue-400",
                      )}
                    />

                    {/* Содержимое */}
                    <div className="flex-1 p-5">
                      <div className="flex flex-col min-[900px]:flex-row min-[900px]:items-start gap-4 w-full">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            {getStatusBadge(hw)}
                          </div>

                          <h3 className="text-lg font-semibold text-slate-800 mb-1">
                            {hw.title}
                          </h3>

                          {hw.topic && (
                            <p className="text-sm text-slate-500 mb-2">
                              📚 {hw.topic}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 mt-2">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-4 h-4" />
                              <span>
                                Срок: {getDueDateStatus(hw.dueDate, hw.status)}
                              </span>
                            </div>
                            {hw.grade && (
                              <div className="flex items-center gap-1.5">
                                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                <span className="font-semibold text-emerald-600">
                                  {hw.grade} баллов
                                </span>
                              </div>
                            )}
                          </div>

                          {hw.description && (
                            <p className="text-sm text-slate-600 mt-3 line-clamp-2">
                              {hw.description}
                            </p>
                          )}

                          {hw.feedback && hw.status === "completed" && (
                            <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                              <p className="text-sm text-emerald-800">
                                💬 <span className="font-semibold">Отзыв:</span>{" "}
                                {hw.feedback}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Кнопки действий */}
                        {/* 🔹 Контейнер: вертикально на мобильных, горизонтально и прижат вправо от 540px */}
                        <div className="flex flex-col gap-2 w-full min-[540px]:flex-row min-[540px]:w-auto min-[540px]:items-end">
                          {hw.fileUrl && (
                            <Button
                              asChild
                              variant="outline"
                              size="sm"
                              className="gap-2 w-full justify-center min-[540px]:w-auto min-[540px]:justify-start"
                            >
                              <a
                                href={hw.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                <Download className="w-4 h-4" />
                                Скачать задание
                              </a>
                            </Button>
                          )}

                          {hw.status === "assigned" && (
                            <Button
                              size="sm"
                              className="gap-2 bg-blue-600 hover:bg-blue-700 w-full justify-center min-[540px]:w-auto min-[540px]:justify-start"
                            >
                              <Upload className="w-4 h-4" />
                              Начать выполнение
                            </Button>
                          )}

                          {hw.status === "in_progress" && (
                            <Button
                              size="sm"
                              className="gap-2 bg-amber-600 hover:bg-amber-700 w-full justify-center min-[540px]:w-auto min-[540px]:justify-start"
                            >
                              <Upload className="w-4 h-4" />
                              Загрузить решение
                            </Button>
                          )}

                          {hw.status === "submitted" && (
                            <Button
                              size="sm"
                              variant="secondary"
                              className="gap-2 w-full justify-center min-[540px]:w-auto min-[540px]:justify-start"
                              disabled
                            >
                              <Clock className="w-4 h-4" />
                              На проверке
                            </Button>
                          )}

                          {hw.status === "completed" && (
                            <Button
                              variant="outline"
                              size="sm"
                              className="gap-2 w-full justify-center min-[540px]:w-auto min-[540px]:justify-start"
                              onClick={() => setSelectedHomework(hw)}
                            >
                              <Eye className="w-4 h-4" />
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
      )}

      {/* Модальное окно с деталями (опционально) */}
      {selectedHomework && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-slate-800">
                  {selectedHomework.title}
                </h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedHomework(null)}
                >
                  ✕
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-slate-500">Тема</p>
                  <p className="font-medium">{selectedHomework.topic || "—"}</p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Описание</p>
                  <p className="text-slate-700">
                    {selectedHomework.description || "Описание отсутствует"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-slate-500">Срок выполнения</p>
                  <p className="font-medium">
                    {selectedHomework.dueDate.toLocaleDateString("ru-RU", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>

                {selectedHomework.grade && (
                  <div>
                    <p className="text-sm text-slate-500">Оценка</p>
                    <p className="text-2xl font-bold text-emerald-600">
                      {selectedHomework.grade} баллов
                    </p>
                  </div>
                )}

                {selectedHomework.feedback && (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                    <p className="text-sm font-semibold text-emerald-800 mb-1">
                      Отзыв преподавателя:
                    </p>
                    <p className="text-emerald-700">
                      {selectedHomework.feedback}
                    </p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setSelectedHomework(null)}
                  >
                    Закрыть
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
