import { prisma } from "../utils/prisma";
import { TestStartForm } from "./TestStartForm";

export const metadata = {
  title: "Тестирование по химии | Определение уровня",
  description:
    "Пройдите тест из 10 вопросов и узнайте свой уровень подготовки по химии",
};

export default async function TestPage() {
  // Загружаем 10 случайных активных вопросов
  const questions = await prisma.testQuestion.findMany({
    where: { isActive: true },
    orderBy: { order: "asc" },
    take: 10,
  });

  // Если вопросов меньше 10 — берём все
  const selectedQuestions =
    questions.length >= 10 ? questions.slice(0, 10) : questions;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Заголовок */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl shadow-lg mb-4">
            <span className="text-4xl">🧪</span>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Тестирование по химии
          </h1>
          <p className="text-lg text-gray-600">
            Определите свой уровень подготовки перед началом занятий
          </p>
        </div>

        {/* Информационные карточки */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">📝</div>
            <div className="font-semibold text-gray-900">10 вопросов</div>
            <div className="text-sm text-gray-500">
              Разного уровня сложности
            </div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">⏱️</div>
            <div className="font-semibold text-gray-900">~15 минут</div>
            <div className="text-sm text-gray-500">Без ограничения времени</div>
          </div>
          <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
            <div className="text-3xl mb-2">📊</div>
            <div className="font-semibold text-gray-900">Разбор ошибок</div>
            <div className="text-sm text-gray-500">Подробные пояснения</div>
          </div>
        </div>

        {/* Форма */}
        <TestStartForm questions={selectedQuestions} />

        {/* Что вас ждёт */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Что вы получите?
          </h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>Оценку своего уровня</strong> — начинающий, средний или
                продвинутый
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>Разбор ошибок</strong> с подробными пояснениями по
                каждому вопросу
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>Рекомендации</strong> по темам, которые стоит подтянуть
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <span className="text-gray-700">
                <strong>Индивидуальный план</strong> подготовки на пробном
                занятии
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
