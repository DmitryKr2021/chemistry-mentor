import z from "zod";

export const trialLessonSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать минимум 2 символа")
    .max(50, "Имя не должно превышать 50 символов")
    .regex(/^[а-яА-ЯёЁa-zA-Z\s-]+$/, "Имя должно содержать только буквы"),

  phone: z
    .string()
    .min(18, "Введите полный номер телефона") // 18 символов с маской +7 (___) ___-__-__
    .regex(/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/, "Некорректный формат телефона"),

  email: z
    .string()
    .min(1, "Email обязателен для заполнения")
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Введите корректный email адрес",
    ),

  topic: z.string().min(1, "Выберите тему занятия"),

  comment: z
    .string()
    .max(500, "Комментарий не должен превышать 500 символов")
    .optional(),
});

export type TrialLessonFormData = z.infer<typeof trialLessonSchema>;
