"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface PhoneInputProps extends Omit<
  React.ComponentPropsWithoutRef<"input">,
  "value" | "onChange"
> {
  value?: string;
  onChange?: (value: string) => void;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ className, value = "", onChange, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let raw = e.target.value.replace(/\D/g, "");

      // Ограничиваем 11 цифрами
      if (raw.length > 11) {
        raw = raw.slice(0, 11);
      }

      // Нормализация: 8 → 7, добавляем 7 если нужно
      if (raw.startsWith("8")) raw = "7" + raw.slice(1);
      if (raw.length > 0 && !raw.startsWith("7")) raw = "7" + raw;

      // Форматирование с поддержкой неполного ввода
      let formatted = "";
      if (raw.length > 0) {
        formatted = raw.replace(
          /^(\d{1})(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})$/,
          "+$1 ($2) $3-$4-$5",
        );
        // Убираем лишние символы маски при неполном вводе
        formatted = formatted
          .replace(/\(\)$/g, "")
          .replace(/\s-\s$/g, "")
          .replace(/\(\s*\)/g, "");
      }

      onChange?.(formatted);
    };

    return (
      <Input
        ref={ref}
        type="tel"
        placeholder="+7 (___) ___-__-__"
        value={value}
        onChange={handleChange}
        className={cn("font-mono", className)} // font-mono для выравнивания цифр
        {...props}
      />
    );
  },
);
PhoneInput.displayName = "PhoneInput";
