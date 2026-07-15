// components/channel/ChannelRubrics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FlaskConical,
  TestTube,
  Brain,
  Lightbulb,
  Target,
  MessageCircle,
  Calendar,
  FileQuestion,
} from "lucide-react";

const rubrics = [
  {
    icon: FlaskConical,
    title: "🧪 Теория простым языком",
    description: "Сложные темы химии объясняю на пальцах с примерами из жизни",
    color: "bg-blue-500",
    tags: ["Органика", "Неорганика", "Физхимия"],
  },
  {
    icon: TestTube,
    title: "⚗️ Разбор задач",
    description: "Пошаговое решение задач ЕГЭ, ОГЭ и олимпиадного уровня",
    color: "bg-emerald-500",
    tags: ["ЕГЭ", "ОГЭ", "Олимпиады"],
  },
  {
    icon: Brain,
    title: "🧠 Лайфхаки и мнемоника",
    description:
      "Как запомнить таблицу Менделеева, ряды активности и другие таблицы",
    color: "bg-amber-500",
    tags: ["Запоминание", "Таблицы", "Правила"],
  },
  {
    icon: Lightbulb,
    title: "💡 Интересные факты",
    description: "Химия вокруг нас: от готовки до космоса",
    color: "bg-purple-500",
    tags: ["Факты", "Эксперименты", "История"],
  },
  {
    icon: Target,
    title: "🎯 Подготовка к экзаменам",
    description: "Стратегии, тайминг, разбор ловушек в заданиях",
    color: "bg-red-500",
    tags: ["ЕГЭ", "ОГЭ", "Стратегия"],
  },
  {
    icon: MessageCircle,
    title: "💬 Вопрос-ответ",
    description: "Отвечаю на ваши вопросы в комментариях и отдельных постах",
    color: "bg-cyan-500",
    tags: ["Помощь", "Консультации"],
  },
  {
    icon: Calendar,
    title: "📅 Марафоны и челленджи",
    description: "30 дней химии, недельные интенсивы, совместная подготовка",
    color: "bg-pink-500",
    tags: ["Марафоны", "Челленджи"],
  },
  {
    icon: FileQuestion,
    title: "📝 Домашние задания",
    description: "Регулярные ДЗ с проверкой и разбором ошибок",
    color: "bg-indigo-500",
    tags: ["Практика", "ДЗ", "Проверка"],
  },
];

export default function ChannelRubrics() {
  return (
    <section className="py-20 px-4 bg-slate-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
            Рубрики канала
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Контент, который поможет понять химию и сдать экзамены на отлично
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {rubrics.map((rubric, index) => {
            const Icon = rubric.icon;
            return (
              <Card
                key={index}
                className="border-0 shadow-md hover:shadow-xl transition-all hover:-translate-y-1 bg-white"
              >
                <CardHeader className="pb-3">
                  <div
                    className={`w-12 h-12 rounded-xl ${rubric.color} bg-opacity-10 flex items-center justify-center mb-3`}
                  >
                    <Icon
                      className={`w-6 h-6 ${rubric.color.replace("bg-", "text-")}`}
                    />
                  </div>
                  <CardTitle className="text-lg font-bold text-slate-900">
                    {rubric.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                    {rubric.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {rubric.tags.map((tag, tagIndex) => (
                      <Badge
                        key={tagIndex}
                        variant="secondary"
                        className="text-xs bg-slate-100 text-slate-700 hover:bg-slate-200"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
