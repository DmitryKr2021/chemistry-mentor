"use client";

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
import Link from "next/link";
import CommonButton from "@/app/components/common/CommonButton";

export default function ReviewAction() {
  const { session, status } = useAuthStore();

  const { open } = useOpenAuthModal();
  const handleLoginClick = () => open("login");
  const handleRegisterClick = () => open("register");

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
        <Dialog>
          <DialogTrigger asChild>
            <CommonButton>Оставить отзыв</CommonButton>
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
              <Button
                asChild
                className="w-full bg-emerald-600 hover:bg-emerald-700 rounded-md"
                onClick={handleLoginClick}
              >
                <Link href="#">
                  <LogIn className="w-4 h-4" />
                  Войти
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="w-full rounded-md"
                onClick={handleRegisterClick}
              >
                <Link href="#">
                  <UserPlus className="w-4 h-4" />
                  Регистрация
                </Link>
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // ✅ АВТОРИЗОВАННЫЙ ПОЛЬЗОВАТЕЛЬ
  // Показываем форму отзыва. Убедитесь, что в ReviewDialog убрана дублирующая проверка авторизации
  return <ReviewDialog />;
}
