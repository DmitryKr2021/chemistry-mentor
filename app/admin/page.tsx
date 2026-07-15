import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Панель администратора
      </h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* 🔹 Ссылки на Яндекс.Телемост */}
        <Link
          href="/admin/upcoming-lessons"
          className="block p-6 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-lg shadow hover:shadow-md transition-shadow border border-emerald-200"
        >
          <h2 className="text-xl font-semibold mb-2">🔗 Ссылки на уроки</h2>
          <p className="text-gray-600">
            Отправка ссылок на Яндекс.Телемост ученикам перед занятиями.
          </p>
        </Link>

        <Link
          href="/admin/view-students"
          className="block p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-lg shadow hover:shadow-md transition-shadow border border-indigo-200"
        >
          <h2 className="text-xl font-semibold mb-2">👁️ Кабинеты учеников</h2>
          <p className="text-gray-600">
            Просмотр личных кабинетов всех учеников от их имени.
          </p>
        </Link>

        <Link
          href="/admin/schedule"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">📅 Сводное расписание</h2>
          <p className="text-gray-600">
            Расписание всех учеников на неделю с почасовой разбивкой.
          </p>
        </Link>

        <Link
          href="/admin/manage-schedule"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">🗓️ Добавить урок</h2>
          <p className="text-gray-600">
            Создание нового занятия в расписании ученика.
          </p>
        </Link>

        <Link
          href="/admin/manage-homework"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">📝 Назначить задание</h2>
          <p className="text-gray-600">
            Добавление домашнего задания для конкретного ученика.
          </p>
        </Link>

        <Link
          href="/admin/moderation"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">📋 Модерация отзывов</h2>
          <p className="text-gray-600">Проверка и одобрение новых отзывов.</p>
        </Link>

        <Link
          href="/admin/addReview"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">⭐ Добавить отзыв</h2>
          <p className="text-gray-600">Ручное добавление отзыва в базу.</p>
        </Link>

        <Link
          href="/admin/users"
          className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow border border-gray-200"
        >
          <h2 className="text-xl font-semibold mb-2">
            👥 Модерация пользователей
          </h2>
          <p className="text-gray-600">
            Управление пользователями: добавление, редактирование, удаление.
          </p>
        </Link>
        <Link
          href="/admin/posts/new"
          className="block p-6 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg shadow hover:shadow-md transition-shadow border border-purple-200"
        >
          <h2 className="text-xl font-semibold mb-2">
            📰 Добавить пост в блог
          </h2>
          <p className="text-gray-600">
            Загрузка DOCX-файлов с постами и изображениями. Автоматическая
            конвертация в HTML.
          </p>
        </Link>
      </div>
    </div>
  );
}
