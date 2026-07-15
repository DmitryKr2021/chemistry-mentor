// components/account/HomeworkList.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FileText, Clock, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";
import { type VariantProps } from "class-variance-authority";

// 🔹 Тип для варианта бейджа (из shadcn/ui)
type BadgeVariant = VariantProps<typeof Badge>["variant"];

// 🔹 Интерфейс для конфигурации статуса
interface StatusConfig {
  label: string;
  variant: BadgeVariant;
  color: string;
}

// 🔹 Типизированный объект конфигурации
const statusConfig: Record<string, StatusConfig> = {
  assigned: { label: "Назначено", variant: "outline", color: "text-blue-600" },
  in_progress: {
    label: "В работе",
    variant: "secondary",
    color: "text-amber-600",
  },
  submitted: {
    label: "На проверке",
    variant: "secondary",
    color: "text-purple-600",
  },
  completed: {
    label: "Выполнено",
    variant: "default",
    color: "text-emerald-600",
  },
};

export interface Homework {
  id: string;
  title: string;
  topic: string | null; // ← Может быть null
  dueDate: Date;
  status: string;
  grade: number | null; // ← Может быть null
  fileUrl: string | null; // ← Может быть null
  description: string | null;
  feedback: string | null;
  studentFile: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface HomeworkListProps {
  homeworks: Homework[];
}

export default function HomeworkList({ homeworks }: HomeworkListProps) {
  return (
    <Card>
      {/* 🔹 АДАПТИВНЫЙ ЗАГОЛОВОК */}
      <CardHeader className="flex flex-col items-start gap-3 min-[530px]:flex-row min-[530px]:items-center min-[530px]:justify-between min-[530px]:gap-0">
        <div>
          <CardTitle className="text-xl font-bold text-slate-800">
            Домашние задания
          </CardTitle>
          <p className="text-sm text-slate-500 mt-1">Ваши текущие задачи</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full min-[530px]:w-auto"
        >
          <FileText className="w-4 h-4 mr-2" />
          Все задания
        </Button>
      </CardHeader>

      <CardContent>
        {homeworks.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Все задания выполнены! Отличная работа! 🎉</p>
          </div>
        ) : (
          <div className="space-y-3">
            {homeworks.map((hw) => {
              const status: StatusConfig =
                statusConfig[hw.status] || statusConfig.assigned;
              return (
                <div
                  key={hw.id}
                  className="flex flex-col min-[530px]:flex-row min-[530px]:items-center justify-between p-3 min-[530px]:p-4 border border-slate-200 rounded-lg hover:shadow-md transition-shadow bg-white gap-3"
                >
                  {/* 🔹 ВЕРХНЯЯ ЧАСТЬ: иконка + информация */}
                  <div className="flex flex-col min-[400px]:flex-row items-center min-[400px]:items-start gap-3 min-[530px]:gap-4 w-full min-[530px]:w-auto">
                    {/* Иконка - на мобильных по центру сверху, на ≥400px - слева */}
                    <div className="w-12 h-12 min-[530px]:w-10 min-[530px]:h-10 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                      <FileText className="w-6 h-6 min-[530px]:w-5 min-[530px]:h-5 text-blue-600" />
                    </div>

                    {/* Текст */}
                    <div className="min-w-0 flex-1 text-center min-[400px]:text-left w-full">
                      <h4 className="font-semibold text-slate-800 text-sm min-[530px]:text-base break-words">
                        {hw.title || `Домашнее задание #${hw.id.slice(0, 4)}`}
                      </h4>
                      <div className="flex flex-wrap items-center justify-center min-[400px]:justify-start gap-2 min-[530px]:gap-3 text-xs min-[530px]:text-sm text-slate-500 mt-1">
                        {hw.topic && (
                          <span className="break-words">{hw.topic}</span>
                        )}
                        <span className="flex items-center gap-1 flex-shrink-0">
                          <Clock className="w-3 h-3 min-[530px]:w-4 min-[530px]:h-4" />
                          {formatDistanceToNow(hw.dueDate, {
                            addSuffix: true,
                            locale: ru,
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* 🔹 НИЖНЯЯ ЧАСТЬ: статус + оценка + кнопка */}
                  <div className="flex items-center justify-between min-[530px]:justify-end gap-2 w-full min-[530px]:w-auto pt-2 min-[530px]:pt-0 border-t min-[530px]:border-t-0 border-slate-100">
                    <Badge variant={status.variant} className={status.color}>
                      {status.label}
                    </Badge>

                    {hw.grade && (
                      <span className="text-xs min-[530px]:text-sm font-bold text-emerald-600">
                        {hw.grade} баллов
                      </span>
                    )}

                    {hw.fileUrl && (
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="w-4 h-4" />
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
