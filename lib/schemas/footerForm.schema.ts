import z from "zod";

export const footerFormSchema = z.object({
  name: z
    .string()
    .min(2, "Имя должно содержать не менее 2 символов")
    .max(50, "Имя не должно превышать 50 символов")
    .regex(
      /^[\p{L}\s'-]+$/u,
      "Имя может содержать только буквы, пробелы, дефисы и апострофы",
    ),

  email: z
    .string()
    .min(1, "Email обязателен для заполнения")
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Введите корректный email адрес",
    ),

  phone: z
    .string()
    .min(1, "Телефон обязателен для заполнения")
    .refine(
      (val) => {
        if (!val) return true; // Пропускаем пустое значение (поле необязательное)
        // Считаем только цифры
        const digits = val.replace(/\D/g, "");
        return digits.length <= 11;
      },
      { message: "Номер телефона не должен содержать больше 11 цифр" },
    )
    .refine(
      (val) => !val || /^[\d\s()+-]{10,}$/.test(val),
      "Некорректный формат телефона",
    ),

  message: z
    .string()
    .min(5, "Сообщение должно содержать не менее 5 символов")
    .max(1000, "Сообщение не должно превышать 1000 символов"),
});

export type FooterFormData = z.infer<typeof footerFormSchema>;
