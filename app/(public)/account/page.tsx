// app/account/page.tsx
import { prisma } from "@/app/utils/prisma";
import DashboardHeader from "@/app/components/account/DashboardHeader";
import UpcomingLessons from "@/app/components/account/UpcomingLessons";
import ProgressChart from "@/app/components/account/ProgressChart";
import HomeworkList from "@/app/components/account/HomeworkList";
import { Card, CardContent } from "@/components/ui/card";
import {
  Calendar as CalendarIcon,
  BookOpen,
  Award,
  Clock,
  LucideIcon,
} from "lucide-react";
import { getActualUserId } from "@/app/utils/getActualUserId";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  const textColor = color.replace("bg-", "text-");

  return (
    <Card className="border-slate-200 p-0">
      <CardContent className="p-6">
        <div className="flex items-center gap-4">
          <div
            className={`w-12 h-12 rounded-lg ${color} bg-opacity-10 flex items-center justify-center`}
          >
            <Icon className={`w-6 h-6 ${textColor}`} />
          </div>
          <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default async function AccountDashboard() {
  const userId = await getActualUserId();

  // 🔹 Получаем данные ученика
  const student = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      // 🔹 Уроки с домашними заданиями
      studentLessons: {
        where: {
          startTime: { gte: new Date() },
          status: "scheduled", // ← Только запланированные
        },
        orderBy: { startTime: "asc" },
        take: 3,
        include: {
          homework: true, // ← ✅ ДОБАВЛЕНО: подтягиваем ДЗ для каждого урока
        },
      },
      homeworks: {
        where: { status: { not: "completed" } },
        orderBy: { dueDate: "asc" },
        take: 4,
        include: {
          lesson: {
            select: { topic: true, startTime: true },
          },
        },
      },
    },
  });

  // 🔹 Получаем статистику
  const totalLessons = await prisma.lesson.count({
    where: { userId, status: "completed" },
  });

  const completedHomeworks = await prisma.homework.count({
    where: { userId, status: "completed" },
  });

  const avgGrade = await prisma.homework.aggregate({
    where: { userId, grade: { not: null } },
    _avg: { grade: true },
  });

  // 🔹 Расчёт часов обучения (более точный)
  const lessonsWithDuration = await prisma.lesson.findMany({
    where: { userId, status: "completed" },
    select: { startTime: true, endTime: true },
  });

  const totalHours = lessonsWithDuration.reduce((sum, lesson) => {
    if (!lesson.endTime) return sum + 1; // По умолчанию 1 час
    const durationMs = lesson.endTime.getTime() - lesson.startTime.getTime();
    return sum + durationMs / (1000 * 60 * 60);
  }, 0);

  return (
    <div className="space-y-8 w-full">
      {/* Приветствие */}
      <DashboardHeader userName={student?.name || "Ученик"} />

      {/* Быстрая статистика */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Проведено уроков"
          value={totalLessons}
          icon={CalendarIcon}
          color="bg-blue-500"
        />
        <StatCard
          title="Выполнено ДЗ"
          value={completedHomeworks}
          icon={BookOpen}
          color="bg-emerald-500"
        />
        <StatCard
          title="Средний балл"
          value={avgGrade._avg.grade?.toFixed(1) || "N/A"}
          icon={Award}
          color="bg-amber-500"
        />
        <StatCard
          title="Часов обучения"
          value={Math.round(totalHours * 10) / 10 || totalLessons * 1.5}
          icon={Clock}
          color="bg-purple-500"
        />
      </div>

      {/* Ближайшие уроки и календарь */}
      <UpcomingLessons lessons={student?.studentLessons || []} />

      {/* Прогресс обучения */}
      <ProgressChart />

      {/* Домашние задания — ИСПРАВЛЕНО: homework → homeworks */}
      <HomeworkList homeworks={student?.homeworks || []} />
    </div>
  );
}
