"use client";

import { useActionState, useState, useEffect, useRef } from "react";
import { addReviewAction, type AddReviewState } from "./action";
import CommonButton from "@/app/components/common/CommonButton";

const initialState: AddReviewState = { success: false };

export function AddReviewForm() {
  const [state, formAction, isPending] = useActionState(
    addReviewAction,
    initialState,
  );

  const formRef = useRef<HTMLFormElement>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // ✅ Ref для отслеживания предыдущего значения state.success
  const prevSuccessRef = useRef(state.success);

  useEffect(() => {
    // Проверяем, изменилось ли значение с false на true
    const wasSuccess = prevSuccessRef.current;
    prevSuccessRef.current = state.success;

    // Реагируем только на переход false → true
    if (!wasSuccess && state.success) {
      // Сбрасываем форму
      formRef.current?.reset();

      // Показываем сообщение (асинхронно через setTimeout)
      const showTimer = setTimeout(() => {
        setShowSuccess(true);
      }, 0);

      // Автоскрытие через 3 секунды
      const hideTimer = setTimeout(() => {
        setShowSuccess(false);
      }, 3000);

      // Очистка таймеров
      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [state.success]);

  return (
    <form
      ref={formRef}
      action={formAction}
      className="bg-white p-6 rounded-lg shadow space-y-4 max-w-2xl"
    >
      <h2 className="text-xl font-semibold mb-2">Новый отзыв</h2>

      {/* Имя автора */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Имя автора <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          name="authorName"
          required
          className="w-full border rounded px-3 py-2"
          placeholder="Например, Мария Иванова"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Email (необязательно)
        </label>
        <input
          type="email"
          name="authorEmail"
          className="w-full border rounded px-3 py-2"
          placeholder="example@mail.ru"
        />
      </div>

      {/* Рейтинг */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Оценка <span className="text-red-500">*</span>
        </label>
        <select
          name="rating"
          required
          defaultValue="5"
          className="w-full border rounded px-3 py-2"
        >
          <option value="5">⭐ 5 — Отлично</option>
          <option value="4">⭐ 4 — Хорошо</option>
          <option value="3">⭐ 3 — Нормально</option>
          <option value="2">⭐ 2 — Плохо</option>
          <option value="1">⭐ 1 — Ужасно</option>
        </select>
      </div>

      {/* Текст отзыва */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Текст отзыва <span className="text-red-500">*</span>
        </label>
        <textarea
          name="content"
          required
          rows={5}
          className="w-full border rounded px-3 py-2"
          placeholder="Скопируйте сюда текст отзыва с другого сайта..."
        />
      </div>

      {/* Дата отзыва */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Дата отзыва (необязательно, по умолчанию — сегодня)
        </label>
        <input
          type="date"
          name="createdAt"
          className="w-full border rounded px-3 py-2"
        />
      </div>

      {/* Сообщения */}
      {showSuccess && (
        <div className="p-3 bg-green-100 text-green-800 rounded animate-pulse">
          ✅ Отзыв успешно добавлен!
        </div>
      )}
      {state.error && (
        <div className="p-3 bg-red-100 text-red-800 rounded">
          ❌ {state.error}
        </div>
      )}

      {/* Кнопка */}
      <CommonButton type="submit" disabled={isPending}>
        {isPending ? "Сохранение..." : "Добавить отзыв"}
      </CommonButton>
    </form>
  );
}
