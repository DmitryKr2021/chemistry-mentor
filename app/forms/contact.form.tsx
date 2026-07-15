"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  contactSchema,
  type ContactFormData,
} from "@/lib/schemas/contactSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Send, UserCheck, Loader2 } from "lucide-react";
import { PhoneInput } from "../components/common/phoneMask";
import { getCurrentUser } from "@/app/actions/user";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [isLoadingUser, setIsLoadingUser] = useState(true); // 🔹 НОВОЕ
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 🔹 НОВОЕ

  const form = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  // 🔹 Загрузка данных пользователя при монтировании
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

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        setSubmitMessage("Сообщение успешно отправлено!");
        form.reset(); // Сброс формы после успешной отправки
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

  // 🔹 Индикатор загрузки данных пользователя
  if (isLoadingUser) {
    return (
      <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-6">
          Форма обратной связи
        </h2>
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            <p className="text-slate-500 text-sm">Загрузка...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-800 mb-6">
        Форма обратной связи
      </h2>

      {/* 🔹 Бейдж "Данные подставлены из профиля" */}
      {isLoggedIn && (
        <div className="mb-4 flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
          <UserCheck className="w-4 h-4 flex-shrink-0" />
          <span>
            Данные подставлены из вашего профиля. Вы можете их изменить.
          </span>
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
                <FormControl className="bg-white rounded-sm px-4">
                  <Input placeholder="Ваше имя" className="mt-1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormControl className="bg-white rounded-sm px-4">
                  <Input
                    type="email"
                    placeholder="your@email.com"
                    className="mt-1"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Телефон */}
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormControl className="bg-white rounded-sm px-4">
                  <PhoneInput
                    className="mt-1"
                    value={field.value || ""}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Сообщение */}
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <FormControl className="bg-white rounded-sm px-4">
                  <Textarea
                    placeholder="Ваше сообщение..."
                    rows={5}
                    className="mt-1 resize-y"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
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
            className="bg-[var(--button-yellow)] hover:bg-green-300 text-slate-900 font-semibold w-full rounded-sm cursor-pointer shadow-lg hover:shadow-green-400/50"
          >
            {isSubmitting ? (
              "Отправка..."
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                Отправить сообщение
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
