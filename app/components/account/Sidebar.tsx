"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  User,
  Calendar,
  BookOpen,
  GraduationCap,
  MessageSquare,
  Settings,
  LogOut,
  Home,
  FileText,
  Menu,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { handleSignOut } from "@/app/actions/handleSignOut";
import { useState, useEffect, useRef } from "react";

const menuItems = [
  { href: "/account", label: "Главная", icon: Home },
  { href: "/account/profile", label: "Мой профиль", icon: User },
  { href: "/account/schedule", label: "Расписание уроков", icon: Calendar },
  { href: "/account/materials", label: "Учебные материалы", icon: BookOpen },
  { href: "/account/homework", label: "Домашние задания", icon: FileText },
  { href: "/account/progress", label: "Мои оценки", icon: GraduationCap },
  {
    href: "/account/support",
    label: "Связь с репетитором",
    icon: MessageSquare,
  },
  { href: "/account/settings", label: "Настройки", icon: Settings },
];

interface SidebarProps {
  userName: string;
}

export default function Sidebar({ userName }: SidebarProps) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Закрываем меню при клике вне его
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Блокировка прокрутки при открытом меню
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Контент меню (общий для мобильной и десктопной версий)
  const menuContent = (
    <>
      {/* Логотип и имя */}
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold flex-shrink-0">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-slate-800 text-sm">{userName}</p>
              <p className="text-xs text-slate-500">Ученик</p>
            </div>
          </div>
          {/* Кнопка закрытия (только для мобильной версии) */}
          <button
            className="min-[1300px]:hidden p-1 hover:bg-slate-100 rounded"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-label="Закрыть меню"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>
      </div>

      {/* Меню навигации */}
      <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Кнопка выхода */}
      <div className="p-4 border-t border-slate-200">
        <form action={handleSignOut} className="w-full">
          <Button
            type="submit"
            variant="outline"
            className="w-full justify-start gap-3 text-slate-600 hover:text-red-600 hover:border-red-200 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5" />
            Выйти
          </Button>
        </form>
      </div>
    </>
  );

  return (
    <>
      {/* 🔹 ДЕСКТОПНАЯ ВЕРСИЯ (>= 1300px): фиксированный сайдбар */}
      <aside className="hidden min-[1300px]:flex left-0 top-0 h-screen w-64 bg-white border-r border-slate-200 shadow-sm flex-col">
        {menuContent}
      </aside>

      {/* 🔹 МОБИЛЬНАЯ ВЕРСИЯ (< 1300px): гамбургер + выезжающее меню */}
      <div className="min-[1300px]:hidden">
        {/* Верхняя панель с гамбургером */}
        <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-sm w-full">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Открыть меню"
            >
              <Menu className="w-6 h-6 text-slate-700" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                {userName.charAt(0).toUpperCase()}
              </div>
              <p className="font-semibold text-slate-800 text-sm hidden sm:block">
                {userName}
              </p>
            </div>
          </div>
        </header>

        {/* Затемнение фона */}
        {isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Выезжающее меню слева */}
        <div
          ref={mobileMenuRef}
          className={cn(
            "fixed top-0 left-0 h-screen w-72 bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ease-in-out",
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {menuContent}
        </div>
      </div>
    </>
  );
}
