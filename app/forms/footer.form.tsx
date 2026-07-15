"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Send, UserCheck, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  footerFormSchema,
  type FooterFormData,
} from "@/lib/schemas/footerForm.schema";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { getCurrentUser } from "@/app/actions/user"; // 🔹 НОВОЕ

export default function QuickContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true); // 🔹 НОВОЕ
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔹 НОВОЕ

  const form = useForm<FooterFormData>({
    resolver: zodResolver(footerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // 🔹 НОВОЕ: Загрузка данных пользователя при монтировании
  useEffect(() => {
    async function loadUserData() {
      try {
        const userData = await getCurrentUser();

        if (userData) {
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

  const onSubmit = async (data: FooterFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitMessage(
          "Заявка успешно отправлена! Я свяжусь с Вами в ближайшее время",
        );
        form.reset();
      } else {
        setSubmitMessage("Произошла ошибка при отправке");
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitMessage("Произошла ошибка при отправке");
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitMessage(""), 5000);
    }
  };

  // 🔹 НОВОЕ: Индикатор загрузки данных пользователя
  if (isLoadingUser) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
          <p className="text-slate-400 text-sm">Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 max-w-md"
      >
        {/* 🔹 НОВОЕ: Бейдж "Данные подставлены из профиля" */}
        {isLoggedIn && (
          <div className="flex items-center gap-2 px-3 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-green-300 text-sm">
            <UserCheck className="w-4 h-4 flex-shrink-0" />
            <span>
              Данные подставлены из вашего профиля. Вы можете их изменить.
            </span>
          </div>
        )}

        {/* Имя */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Ваше имя"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:ring-offset-slate-800 px-4 rounded-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
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
                  placeholder="your@email.com"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:ring-offset-slate-800 px-4 rounded-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Телефон (необязательный) */}
        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="+7 (___) ___-__-__"
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:ring-offset-slate-800 px-4 rounded-sm"
                  value={field.value || ""}
                  onChange={(e) => {
                    // 1. Получаем только цифры
                    let raw = e.target.value.replace(/\D/g, "");

                    // 2. ОБРЕЗАЕМ, если цифр больше 11
                    if (raw.length > 11) {
                      raw = raw.slice(0, 11);
                    }
                    // 3. Форматируем
                    let formatted = "";
                    if (raw.length > 0) {
                      if (raw.startsWith("8")) raw = "7" + raw.slice(1);
                      if (!raw.startsWith("7")) raw = "7" + raw;

                      // Применяем маску только если есть хотя бы 1 цифра
                      formatted = raw.replace(
                        /^(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})$/,
                        "+$1 ($2) $3-$4-$5",
                      );

                      // Убираем лишние пробелы и скобки, если номер неполный
                      formatted = formatted
                        .replace(/\(\)$/g, "")
                        .replace(/\s-\s$/g, "");
                    }

                    // 4. Обновляем значение формы
                    field.onChange(formatted);
                  }}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Тема */}
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="К чему Вам необходимо подготовиться"
                  rows={5}
                  className="bg-slate-700 border-slate-600 text-white placeholder:text-slate-400 focus-visible:ring-blue-500 focus-visible:ring-offset-slate-800 mt-1 resize-y px-4 rounded-sm"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-400 text-xs" />
            </FormItem>
          )}
        />

        {/* Сообщение об отправке */}
        {submitMessage && (
          <div
            className={`p-3 rounded text-sm ${
              submitMessage.includes("успешно")
                ? "bg-green-100 text-green-700 border border-green-200"
                : "bg-red-100 text-red-700 border border-red-200"
            }`}
          >
            {submitMessage}
          </div>
        )}

        {/* Кнопка отправки */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="bg-[var(--button-yellow)] hover:bg-green-300 text-slate-900 font-bold w-full shadow-lg hover:shadow-green-400/50 transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 rounded-sm hover:cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full animate-spin" />
              Отправка...
            </>
          ) : (
            <>
              Отправить заявку
              <Send className="w-4 h-4" />
            </>
          )}
        </Button>
      </form>
    </Form>
  );
}
