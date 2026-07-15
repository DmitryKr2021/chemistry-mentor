// components/account/HomeworkCard.tsx
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

type HomeworkCardProps = {
  id: string;
  topic: string;
  title: string;
  dueDate: Date;
  status: "assigned" | "submitted" | "checked" | "returned";
  grade?: number; // оценка 1-10 или баллы ЕГЭ
  feedback?: string;
};

export function HomeworkCard({
  topic,
  title,
  dueDate,
  status,
  grade,
  feedback,
}: HomeworkCardProps) {
  const statusConfig = {
    assigned: { label: "Назначено", variant: "outline" as const },
    submitted: { label: "На проверке", variant: "secondary" as const },
    checked: { label: "Проверено", variant: "default" as const },
    returned: { label: "На доработке", variant: "destructive" as const },
  };

  return (
    <div className="p-4 border rounded-lg hover:shadow-md transition bg-white">
      <div className="flex justify-between items-start mb-2">
        <span className="text-sm font-medium text-slate-500">{topic}</span>
        <Badge variant={statusConfig[status].variant}>
          {statusConfig[status].label}
        </Badge>
      </div>

      <h4 className="font-semibold text-slate-800 mb-3">{title}</h4>

      <div className="flex items-center justify-between text-sm">
        <span className="text-slate-500">
          🕐 До: {formatDistanceToNow(dueDate, { addSuffix: true, locale: ru })}
        </span>

        {grade && (
          <span className="font-bold text-[var(--button-yellow)]">
            {grade} баллов
          </span>
        )}
      </div>

      {feedback && status === "checked" && (
        <div className="mt-3 p-2 bg-slate-50 rounded text-sm text-slate-700">
          💬 {feedback}
        </div>
      )}

      <div className="mt-4 flex gap-2">
        {status === "assigned" && (
          <Button size="sm" className="w-full">
            Начать выполнение
          </Button>
        )}
        {status === "returned" && (
          <Button size="sm" variant="destructive" className="w-full">
            Исправить ошибки
          </Button>
        )}
        {status === "checked" && (
          <Button size="sm" variant="outline" className="w-full">
            Посмотреть решение
          </Button>
        )}
      </div>
    </div>
  );
}

// полезные функции date-fns для вашего проекта

// import {
//   formatDistanceToNow,  // "через 2 часа"
//   format,               // "15 мая 2024, 18:30"
//   isPast,               // дедлайн прошёл?
//   addDays,              // +7 дней к дате
//   differenceInDays,     // сколько дней между датами
// } from "date-fns";
// import { ru } from "date-fns/locale";

// // Пример: проверка просрочки ДЗ
// const isOverdue = isPast(dueDate) && status !== 'checked';

// // Пример: красивая дата урока
// const lessonDate = format(lessonTime, "d MMMM yyyy, HH:mm", { locale: ru });
// // → "15 мая 2024, 18:30"
