// components/account/DashboardHeader.tsx
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";

interface DashboardHeaderProps {
  userName: string;
}

export default function DashboardHeader({ userName }: DashboardHeaderProps) {
  const today = format(new Date(), "d MMMM yyyy", { locale: ru });

  // Определяем время суток
  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Доброе утро" : hour < 18 ? "Добрый день" : "Добрый вечер";

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-slate-800">
          {greeting}, {userName}! 👋
        </h1>
        <p className="text-slate-500 mt-1">
          {today} | Добро пожаловать в личный кабинет
        </p>
      </div>

      <Button variant="outline" size="icon" className="relative">
        <Bell className="w-5 h-5" />
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
          3
        </span>
      </Button>
    </div>
  );
}
