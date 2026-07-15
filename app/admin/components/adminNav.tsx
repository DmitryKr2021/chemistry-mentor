"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { href: "/admin/view-students", label: "Кабинеты учеников", icon: "👁️" },
    { href: "/admin/schedule", label: "Сводное расписание", icon: "📅" },
    { href: "/admin/manage-schedule", label: "Добавить урок", icon: "➕" },
    { href: "/admin/manage-homework", label: "Добавить ДЗ", icon: "📝" },
    { href: "/admin/moderation", label: "Модерация отзывов", icon: "📋" },
    { href: "/admin/addReview", label: "Добавить отзыв", icon: "⭐" },
    { href: "/admin/users", label: "Пользователи", icon: "👥" },
    { href: "/admin/posts/new", label: "Добавить пост", icon: "📰" },
    {
      href: "/admin/upcoming-lessons",
      label: "Ссылка на подключение",
      icon: "🔗",
    },
  ];

  return (
    <nav className="bg-white border-b sticky top-0 z-10">
      <div className="flex gap-1 mx-auto px-6">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`px-4 py-3 font-medium transition-colors border-b-2 -mb-px ${
                isActive
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-600 hover:text-gray-900"
              }`}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
