import z from "zod";

export const signInSchema = z.object({
  email: z
    .string()
    .min(1, "Email обязателен для заполнения")
    .regex(
      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      "Введите корректный email адрес",
    ),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be more than 6 characters")
    .max(32, "Password must be less than 32 characters"),
});
