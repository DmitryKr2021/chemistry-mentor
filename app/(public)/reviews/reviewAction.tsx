"use client";

import { useState } from "react";
import ReviewDialog from "../../forms/review.form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LogIn, UserPlus } from "lucide-react";
import { useAuthStore } from "@/app/store/auth.store";
import { useOpenAuthModal } from "@/app/store/useAuthModalStore";

export default function ReviewAction() {
  const { session, status } = useAuthStore();
  const { open } = useOpenAuthModal();

  // Локальное состояние для управления диалогом "Требуется авторизация"
  const [isAuthDialogOpen, setIsAuthDialogOpen] = useState(false);

  const handleLoginClick = () => {
    setIsAuthDialogOpen(false); // Закрываем диалог-предупреждение
    open("login"); // Открываем модалку логина
  };

  const handleRegisterClick = () => {
    setIsAuthDialogOpen(false); // Закрываем диалог-предупреждение
    open("register"); // Открываем модалку регистрации
  };

  // Состояние загрузки
  if (status === "loading") {
    return (
      <div className="h-[76px] w-full flex items-center justify-center text-slate-400">
        Загрузка...
      </div>
    );
  }

  // 🚫 НЕАВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ
  if (!session) {
    return (
      <div className="flex justify-center">
        <Dialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen}>
          <DialogTrigger asChild>
            <Button
              variant="default"
              className={`min-w-fit whitespace-nowrap bg-[var(--button-yellow)] text-slate-900 px-4 sm:px-8 py-3 rounded-lg font-bold hover:bg-green-300 transition shadow-lg hover:shadow-green-400/50 cursor-pointer`}
            >
              Оставить отзыв
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[450px] bg-white rounded-lg">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-slate-800">
                Требуется авторизация
              </DialogTitle>
              <DialogDescription>
                Оставлять отзывы могут только зарегистрированные пользователи.
                Пожалуйста, войдите в аккаунт или создайте новый.
              </DialogDescription>
            </DialogHeader>

            <div className="flex flex-col gap-3 py-4">
              {/* Убрали Link href="#", теперь это чистая кнопка с onClick */}
              <Button
                className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-md cursor-pointer"
                onClick={handleLoginClick}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Войти
              </Button>

              <Button
                variant="outline"
                className="w-full rounded-md cursor-pointer"
                onClick={handleRegisterClick}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Регистрация
              </Button>
            </div>
            {/* Добавляем onOpenChange для закрытия по клику вне окна или на Esc */}
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ✅ АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ
  return <ReviewDialog />;
}
