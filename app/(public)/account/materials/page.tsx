import { ChemistryModule, Topic } from "./types";

// Демо-данные (замените на загрузку из БД)
const demoModules: ChemistryModule[] = [
  {
    id: "organic",
    title: "Органическая химия",
    description: "Основы органической химии для подготовки к ЕГЭ",
    topics: [
      {
        id: "alcohols",
        title: "Спирты и фенолы",
        theory:
          "## Спирты\n\nСпирты — это органические соединения, содержащие одну или несколько гидроксильных групп (-OH)...\n\n### Классификация\n- Одноатомные\n- Двухатомные\n- Многоатомные",
        videoUrl: "https://youtube.com/watch?v=example",
        status: "available",
        practice: [
          {
            id: "p1",
            question: "Какой спирт образуется при гидратации этилена?",
            type: "test",
            difficulty: "easy",
            options: ["Метанол", "Этанол", "Пропанол", "Бутанол"],
            correctAnswer: "Этанол",
            explanation:
              "При гидратации этилена (C₂H₄ + H₂O) образуется этанол (C₂H₅OH) по правилу Марковникова.",
          },
          {
            id: "p2",
            question:
              "Рассчитайте массу этанола, полученного из 112 л этилена (н.у.), если выход реакции составляет 80%.",
            type: "calculation",
            difficulty: "medium",
            correctAnswer: 184,
            explanation:
              "n(C₂H₄) = 112/22.4 = 5 моль. По уравнению n(C₂H₅OH) = 5 моль. m(теор) = 5 × 46 = 230 г. m(практ) = 230 × 0.8 = 184 г.",
          },
        ],
      },
      {
        id: "aldehydes",
        title: "Альдегиды и кетоны",
        theory: "## Альдегиды\n\nАльдегиды содержат карбонильную группу...",
        status: "locked",
        practice: [],
      },
    ],
  },
  {
    id: "inorganic",
    title: "Неорганическая химия",
    description: "Общая и неорганическая химия",
    topics: [
      {
        id: "periodic-table",
        title: "Периодический закон",
        theory: "## Периодический закон Д.И. Менделеева...",
        status: "completed",
        practice: [],
      },
    ],
  },
];

export default async function MaterialsPage() {
  // 🔹 Здесь тип ChemistryModule используется для типизации данных
  const modules: ChemistryModule[] = demoModules;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Учебные материалы</h1>
        <p className="text-slate-500 mt-1">
          Теория, видео и задачи для подготовки к экзаменам
        </p>
      </div>

      <div className="grid gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.id} module={module} />
        ))}
      </div>
    </div>
  );
}

// 🔹 Компонент карточки модуля — использует тип ChemistryModule
function ModuleCard({ module }: { module: ChemistryModule }) {
  const completedTopics = module.topics.filter(
    (t) => t.status === "completed",
  ).length;
  const totalTopics = module.topics.length;
  const progress = totalTopics > 0 ? (completedTopics / totalTopics) * 100 : 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">{module.title}</h2>
          {module.description && (
            <p className="text-sm text-slate-500 mt-1">{module.description}</p>
          )}
        </div>
        <span className="text-sm text-slate-500">
          {completedTopics}/{totalTopics} тем
        </span>
      </div>

      {/* Прогресс-бар */}
      <div className="mb-4">
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Список тем */}
      <div className="space-y-2">
        {module.topics.map((topic) => (
          <TopicItem key={topic.id} topic={topic} />
        ))}
      </div>
    </div>
  );
}

// 🔹 Компонент темы — использует тип Topic
function TopicItem({ topic }: { topic: Topic }) {
  const statusConfig = {
    locked: {
      icon: "🔒",
      color: "text-slate-400",
      bg: "bg-slate-50",
      label: "Заблокировано",
    },
    available: {
      icon: "📖",
      color: "text-blue-600",
      bg: "bg-blue-50",
      label: "Доступно",
    },
    completed: {
      icon: "✅",
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      label: "Пройдено",
    },
  };

  const status = statusConfig[topic.status];

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg ${status.bg} border border-slate-200`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{status.icon}</span>
        <div>
          <h3 className={`font-medium ${status.color}`}>{topic.title}</h3>
          <p className="text-xs text-slate-500">
            {topic.practice.length} задач • {status.label}
          </p>
        </div>
      </div>
      {topic.videoUrl && (
        <span className="text-xs text-slate-500">🎥 Видео</span>
      )}
    </div>
  );
}
