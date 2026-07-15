import { prisma } from "@/app/utils/prisma";
import { auth } from "@/app/auth/auth";
import { redirect } from "next/navigation";
import { ImpersonateButton } from "./ImpersonateButton";
import { Search } from "lucide-react";

export default async function ViewStudentsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string }>;
}) {
  const session = await auth();

  // Только admin
  if (!session?.user || session.user.role !== "admin") {
    redirect("/admin");
  }

  const params = await searchParams;
  const search = params.search || "";

  // Получаем всех учеников с фильтрацией
  const students = await prisma.user.findMany({
    where: {
      role: "user",
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      _count: {
        select: {
          studentLessons: true,
          homeworks: true,
        },
      },
    },
    orderBy: { name: "asc" },
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            👁️ Просмотр кабинетов учеников
          </h1>
          <p className="text-gray-600 mt-1">
            Выберите ученика, чтобы увидеть его личный кабинет от его имени
          </p>
        </div>

        {/* 🔹 Поиск */}
        <div className="mb-6 bg-white p-4 rounded-lg border border-gray-200">
          <form className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Поиск по имени или email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </form>
        </div>

        {/* 🔹 Список учеников */}
        {students.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              {search
                ? "Ученики не найдены по вашему запросу"
                : "Ученики пока не зарегистрированы"}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            {/* Заголовок таблицы */}
            <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase">
              <div className="col-span-4">Ученик</div>
              <div className="col-span-3">Email</div>
              <div className="col-span-2 text-center">Уроков</div>
              <div className="col-span-1 text-center">ДЗ</div>
              <div className="col-span-2 text-right">Действие</div>
            </div>

            {/* Строки */}
            {students.map((student) => (
              <div
                key={student.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-6 py-4 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <div className="sm:col-span-4">
                  <p className="font-semibold text-gray-800">
                    {student.name || "Без имени"}
                  </p>
                  <p className="text-xs text-gray-500 sm:hidden">
                    {student.email}
                  </p>
                </div>
                <div className="hidden sm:block sm:col-span-3 text-sm text-gray-600 truncate">
                  {student.email}
                </div>
                <div className="hidden sm:block sm:col-span-2 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-700 font-semibold text-sm">
                    {student._count.studentLessons}
                  </span>
                </div>
                <div className="hidden sm:block sm:col-span-1 text-center">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-purple-50 text-purple-700 font-semibold text-sm">
                    {student._count.homeworks}
                  </span>
                </div>
                <div className="sm:col-span-2 flex sm:justify-end">
                  <ImpersonateButton userId={student.id} />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-4 text-sm text-gray-500">
          Всего учеников:{" "}
          <span className="font-semibold text-gray-700">{students.length}</span>
        </div>
      </main>
    </div>
  );
}
