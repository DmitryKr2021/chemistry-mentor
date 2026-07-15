"use client";

import { useState, useEffect } from "react";
import { Star, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "../store/auth.store";

export default function ReviewDialog() {
  const { session } = useAuthStore();

  const [isOpen, setIsOpen] = useState(false);

  const initialFormData = {
    name: "",
    email: "",
    text: "",
    rating: 5,
  };

  const [formData, setFormData] = useState(initialFormData);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const resetFormContent = () => {
    setFormData((prev) => ({
      ...prev,
      text: "",
      rating: 5,
    }));
    setFeedback(null); // убираем сообщения об успехе/ошибке
  };

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Диалог закрывается (крестик, клик вне формы, кнопка "Отмена")
      resetFormContent();
    }
    setIsOpen(open);
  };

  useEffect(() => {
    if (!session?.user?.email) return;

    let isMounted = true;

    fetch("/api/user")
      .then((res) => {
        if (!res.ok) throw new Error("Не удалось загрузить профиль");
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setFormData((prev) => ({
            ...prev,
            name: data.name || "",
            email: data.email || "",
          }));
        }
      })
      .catch((err) => console.warn("Ошибка загрузки профиля:", err));

    return () => {
      isMounted = false;
    }; // Очистка при размонтировании
  }, [session]);

  const handleSubmit = async (
    e: React.SyntheticEvent<HTMLFormElement, Event>,
  ) => {
    e.preventDefault();
    if (!session || !formData.text || formData.rating === 0) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          text: formData.text,
          rating: formData.rating,
        }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Ошибка сервера: ${res.status}`);
      }

      setFeedback({
        type: "success",
        message: "Отзыв успешно отправлен! Он появится после модерации.",
      });
      setFormData((prev) => ({ ...prev, text: "" }));
      // Автоматически закрыть диалог через 2 секунды
      setTimeout(() => setIsOpen(false), 2000);
    } catch (error) {
      setFeedback({
        type: "error",
        message: "Произошла ошибка. Пожалуйста, попробуйте позже.",
      });
      console.log("error===", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center">
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogTrigger asChild>
          <Button className="bg-[var(--button-yellow)] hover:bg-green-300 cursor-pointer text-slate-900 font-semibold px-8 py-6 text-lg rounded-lg transition-colors shadow-lg hover:shadow-green-400/50">
            Оставить отзыв
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px] bg-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-800">
              Оставить отзыв
            </DialogTitle>
            <DialogDescription>
              Поделитесь своим опытом занятий с Дмитрием Крыльским
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              {feedback && (
                <div
                  className={`p-3 rounded-md text-sm ${feedback.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}
                >
                  {feedback.message}
                </div>
              )}

              {/* 2. Поля из БД, недоступные для редактирования */}
              <div className="space-y-2">
                <Label htmlFor="name">Ваше имя</Label>
                <Input
                  id="name"
                  value={formData.name}
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Адрес почты</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  disabled
                  className="bg-slate-50 cursor-not-allowed"
                />
              </div>

              <div className="space-y-2">
                <Label>Оценка</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="focus:outline-none transition-transform hover:scale-110 cursor-pointer"
                      aria-label={`Оценка ${star} из 5`}
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= formData.rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "fill-gray-200 text-gray-200"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="text">Ваш отзыв</Label>
                <Textarea
                  id="text"
                  placeholder="Расскажите о своем опыте..."
                  value={formData.text}
                  onChange={(e) =>
                    setFormData({ ...formData, text: e.target.value })
                  }
                  rows={5}
                  required
                  minLength={10}
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetFormContent();
                  setIsOpen(false);
                }}
                disabled={isSubmitting}
                className="cursor-pointer rounded-sm"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                disabled={
                  isSubmitting || !formData.text || formData.rating === 0
                }
                className="bg-emerald-600 hover:bg-emerald-700 hover:cursor-pointer disabled:opacity-50 rounded-sm"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                    Отправка...
                  </>
                ) : (
                  "Отправить"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
