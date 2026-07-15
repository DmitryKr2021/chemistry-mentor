"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  trialLessonSchema,
  TrialLessonFormData,
} from "@/lib/schemas/trialLessonSchema";
import { PhoneInput } from "../components/common/phoneMask";
import { Send, UserCheck, Loader2 } from "lucide-react";
import { getCurrentUser } from "@/app/actions/user"; // 🔹 НОВОЕ

// Темы для выбора
const TOPICS = [
  "Общая химия",
  "Неорганическая химия",
  "Органическая химия",
  "Физическая химия",
  "Подготовка к ЕГЭ",
  "Подготовка к ОГЭ",
  "Подготовка к олимпиадам",
  "Помощь со школьной программой",
  "Решение задач",
  "Другая тема",
];

interface TrialLessonFormProps {
  onClose?: () => void;
}

export default function TrialLessonForm({ onClose }: TrialLessonFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoadingUser, setIsLoadingUser] = useState(true); // 🔹 НОВОЕ
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔹 НОВОЕ
  const [submitMessage, setSubmitMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const form = useForm<TrialLessonFormData>({
    resolver: zodResolver(trialLessonSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      topic: "",
      comment: "",
    },
  });

  // 🔹 НОВОЕ: Загрузка данных пользователя при монтировании
  useEffect(() => {
    async function loadUserData() {
      try {
        const userData = await getCurrentUser();

        if (userData) {
          // Пользователь залогинен — подставляем данные
          form.setValue("name", userData.name);
          form.setValue("email", userData.email);
          if (userData.phone) {
            form.setValue("phone", userData.phone);
          }
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Ошибка загрузки данных пользователя:", error);
      } finally {
        setIsLoadingUser(false);
      }
    }

    loadUserData();
  }, [form]);

  const onSubmit = async (data: TrialLessonFormData) => {
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch("/api/trial-lesson", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setSubmitMessage({
          type: "success",
          text: "Заявка успешно отправлена! Я свяжусь с вами в ближайшее время.",
        });
        form.reset();
        setTimeout(() => {
          onClose?.();
        }, 2000);
      } else {
        setSubmitMessage({
          type: "error",
          text: result.error || "Произошла ошибка при отправке",
        });
      }
    } catch (error) {
      console.error("Ошибка отправки:", error);
      setSubmitMessage({
        type: "error",
        text: "Ошибка соединения с сервером",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(null), 5000);
    }
  };

  // 🔹 НОВОЕ: Индикатор загрузки данных пользователя
  if (isLoadingUser) {
    return (
      <div className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-2xl flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-lime-400" />
          <p className="text-white text-sm">Загрузка данных...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-2xl">
      {/* 🔹 НОВОЕ: Бейдж "Вы авторизованы" */}
      {isLoggedIn && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-green-500/20 border border-green-500/30 rounded-lg text-green-300 text-sm">
          <UserCheck className="w-4 h-4" />
          <span>
            Данные подставлены из вашего профиля. При необходимости вы можете их
            изменить.
          </span>
        </div>
      )}

      {submitMessage && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm ${
            submitMessage.type === "success"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-red-500/20 text-red-300 border border-red-500/30"
          }`}
        >
          {submitMessage.text}
        </div>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Имя */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder="Имя"
                    className="bg-white text-slate-900 border-0 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-lime-400 px-4 rounded-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-300 text-xs" />
              </FormItem>
            )}
          />

          {/* Телефон */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <PhoneInput
                    className="bg-white mt-1 px-4 rounded-sm text-slate-900"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage className="text-red-300 text-xs" />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email"
                    className="bg-white text-slate-900 border-0 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-lime-400 px-4 rounded-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-300 text-xs" />
              </FormItem>
            )}
          />

          {/* Выбор темы */}
          <FormField
            control={form.control}
            name="topic"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="bg-white text-slate-900 border-0 focus:ring-2 focus:ring-lime-400 px-4 rounded-sm cursor-pointer">
                      <SelectValue placeholder="Выберите тему" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {TOPICS.map((topic) => (
                      <SelectItem key={topic} value={topic}>
                        {topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage className="text-red-300 text-xs" />
              </FormItem>
            )}
          />

          {/* Комментарий */}
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    placeholder="Комментарий"
                    className="bg-white text-slate-900 border-0 placeholder:text-slate-400 focus-visible:ring-2 focus-visible:ring-lime-400 min-h-[100px] px-4 rounded-sm"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-300 text-xs" />
              </FormItem>
            )}
          />

          {/* Кнопка отправки */}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-[var(--button-yellow)] hover:bg-green-300 text-slate-900 font-semibold w-full rounded-sm hover:cursor-pointer shadow-lg hover:shadow-green-400/50"
          >
            {isSubmitting ? (
              "Отправка..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Отправить заявку
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
