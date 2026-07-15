import { prisma } from "@/app/utils/prisma";
import { redirect } from "next/navigation";
import { HomeworkClient } from "./HomeworkClient";
import { getActualUserId } from "@/app/utils/getActualUserId";

export interface HomeworkData {
  id: string;
  title: string;
  topic: string | null;
  dueDate: Date;
  status: string;
  grade: number | null;
  fileUrl: string | null;
  description: string | null;
  feedback: string | null;
  studentFile: string | null;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export default async function HomeworkPage() {
  const userId = await getActualUserId();
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true },
  });

  if (!user) {
    redirect("/");
  }

  const userName = user.name || "Ученик";
  let homeworks: HomeworkData[] = [];

  try {
    const dbHomeworks = await prisma.homework.findMany({
      where: { userId: userId },
      orderBy: { dueDate: "asc" },
    });

    homeworks = dbHomeworks.map((hw) => ({
      id: hw.id,
      title: hw.title || "Домашнее задание",
      topic: hw.topic,
      dueDate: hw.dueDate,
      status: hw.status || "assigned",
      grade: hw.grade,
      fileUrl: hw.fileUrl,
      description: hw.description,
      feedback: hw.feedback,
      studentFile: hw.studentFile,
      userId: hw.userId,
      createdAt: hw.createdAt,
      updatedAt: hw.updatedAt,
    }));
  } catch (error) {
    console.error("Ошибка загрузки домашних заданий:", error);
    // Используем демо-данные, если таблица ещё не создана
    homeworks = getDemoHomeworks();
  }

  return <HomeworkClient homeworks={homeworks} userName={userName} />;
}

function getDemoHomeworks(): HomeworkData[] {
  const now = new Date();
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const in5Days = new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000);
  const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);

  return [
    {
      id: "1",
      title: "Решение задач по органической химии",
      topic: "Органическая химия: Алканы",
      dueDate: in2Days,
      status: "assigned",
      grade: null,
      fileUrl: "/files/homework1.pdf",
      description:
        "Решить задачи №1-15 из учебника. Показать все этапы решения.",
      feedback: null,
      studentFile: null,
      userId: "demo",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "2",
      title: "Подготовка к контрольной работе",
      topic: "Неорганическая химия",
      dueDate: in5Days,
      status: "in_progress",
      grade: null,
      fileUrl: "/files/homework2.pdf",
      description: "Повторить темы: кислоты, основания, соли. Решить 10 задач.",
      feedback: null,
      studentFile: null,
      userId: "demo",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "3",
      title: "Лабораторная работа: Химические реакции",
      topic: "Химические реакции",
      dueDate: yesterday,
      status: "submitted",
      grade: null,
      fileUrl: "/files/homework3.pdf",
      description: "Оформить отчёт по лабораторной работе.",
      feedback: null,
      studentFile: "/files/student_work3.pdf",
      userId: "demo",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "4",
      title: "Тест по периодической системе",
      topic: "Периодическая система элементов",
      dueDate: in7Days,
      status: "completed",
      grade: 85,
      fileUrl: "/files/homework4.pdf",
      description: "Пройти онлайн-тест на 20 вопросов.",
      feedback: "Отличная работа! Обрати внимание на тему гибридизации.",
      studentFile: null,
      userId: "demo",
      createdAt: now,
      updatedAt: now,
    },
  ];
}
